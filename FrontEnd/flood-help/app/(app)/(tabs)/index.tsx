import React, { useState, useEffect } from "react";
import { View, Alert, TouchableOpacity, ActivityIndicator, Text, Image, Modal, Pressable } from "react-native";
import useStyles from "@/constants/style";
import MapView, { Marker, Region } from "react-native-maps";
import { mapLightTheme, mapDarkTheme } from "@/constants/Themes";
import { useTheme } from "@/contexts/ThemeContext";
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

type RootStackParamList = {
    newreport: undefined;
    notifications: undefined;
};

interface Report {
    datetime: string;
    title: string;
    coordinates: string;
    location?: string;
}

interface ConnectionLocation {
    uid: number;
    latitude: number;
    longitude: number;
}

interface Relationship {
    requestee_name: string;
    requestee_uid: number;
    requester_name: string;
    requester_uid: number;
}

interface CheckInStatus {
    email: string;
    status: string;
    updateTime: string;
}

export default function Index() {
    const styles = useStyles();
    const { theme } = useTheme();
    const [region, setRegion] = useState<Region | null>(null);
    const [connectionLocations, setConnectionLocations] = useState<ConnectionLocation[]>([]);
    const [relationships, setRelationships] = useState<Relationship[]>([]);
    const [reports, setReports] = useState<{ [key: string]: Report }>({});
    const [loading, setLoading] = useState(true);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [selectedConnection, setSelectedConnection] = useState<CheckInStatus | null>(null);
    const [showHistoricalMarker, setShowHistoricalMarker] = useState(false);
    const [historicalMarkerCoords, setHistoricalMarkerCoords] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { user } = useAuth();

    const fetchReports = async () => {
        try {
            const response = await fetch('http://54.206.190.121:5000/reporting/user/get_all_report_basic', {
                method: 'GET',
            });
            const reportsData = await response.json();
            setReports(reportsData); 
            console.log('Fetched Flood Reports:', reportsData);
        } catch (error) {
            console.error('Error fetching flood reports:', error);
            setReports({});
        }
    };

    const updateLocationAndFetchConnections = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission to access location was denied");
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

            const formData = new FormData();
            formData.append('location', `(${latitude},${longitude})`);

            const locationUpdateResponse = await fetch('http://54.206.190.121:5000/locations/update', {
                method: 'POST',
                body: formData,
            });
            const locationData = await locationUpdateResponse.json();
            console.log('Location Update Response:', locationData);

            if (Object.keys(locationData).length > 0) {
                const locationsArray: ConnectionLocation[] = Object.entries(locationData).map(([uid, loc]) => {
                    const [latStr, longStr] = (loc as string).replace(/[()]/g, '').split(',');
                    return {
                        uid: parseInt(uid),
                        latitude: parseFloat(latStr),
                        longitude: parseFloat(longStr),
                    };
                });
                setConnectionLocations(locationsArray);
            }

            const relationshipsResponse = await fetch('http://54.206.190.121:5000/relationships/get_relationships', {
                method: 'GET',
            });
            const relationshipsData = await relationshipsResponse.json();
            console.log('Relationships Data:', relationshipsData);
            setRelationships(Object.values(relationshipsData));

            await fetchReports();

            setLoading(false);
        } catch (error) {
            console.error("Error updating location and fetching connections:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("useEffect triggered with user:", user);
        if (!user) return;

        updateLocationAndFetchConnections();
    }, [user]);

    const handleAddReport = () => {
        navigation.navigate('newreport');
    };

    const getAddressFromCoordinates = async (coordinates: string): Promise<string> => {
        try {
            const [latitude, longitude] = coordinates.replace(/[()]/g, '').split(',');
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);
    
            const addressArray = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
    
            if (addressArray.length > 0) {
                const address = addressArray[0];
                // Combine street and city if available
                return `${address.street}, ${address.city}`;
            } else {
                return 'Unknown Location';
            }
        } catch (error) {
            console.error("Error getting address from coordinates:", error);
            return 'Unknown Location';
        }
    };
    // Helper function to format time from a datetime string
    const formatTime = (datetime: string) => {
        const date = new Date(datetime);
        let hours = date.getUTCHours();  // Use getUTCHours for UTC time
        let minutes: string | number = date.getUTCMinutes();  // Use getUTCMinutes for UTC time
        const ampm = hours >= 12 ? 'pm' : 'am';
    
        hours = hours % 12;
        hours = hours ? hours : 12; // If hour is 0, set it to 12
        minutes = minutes < 10 ? '0' + minutes : minutes;
    
        const strTime = `${hours}:${minutes} ${ampm}`;
        return strTime;
    };

    const handleMarkerPress = async (report: Report) => {
        try {
            // Reverse geocode the coordinates to get the location
            const location = await getAddressFromCoordinates(report.coordinates);
    
            // Now set the selected report and include the fetched location
            setSelectedReport({ ...report, location }); // Add the location to the selected report
            setShowAlertModal(true);
        } catch (error) {
            console.error('Error fetching location for report:', error);
        }
    };

    // Modal for connection markers
    const handleConnectionPress = async (connection: ConnectionLocation) => {
        try {
            // Fetch the check-in status for the selected connection
            const response = await fetch('http://54.206.190.121:5000/check_in/get_checkins', {
                method: 'GET',
            });

            if (!response.ok) {
                console.error('Failed to fetch connection status:', response.status);
                Alert.alert("Error", "Failed to fetch connection status.");
                return;
            }

            const checkinsData = await response.json();

            const relationship = relationships.find(
                (rel) => (rel.requestee_uid === connection.uid || rel.requester_uid === connection.uid)
            );

            const connectionName = relationship?.requestee_uid === connection.uid
                ? relationship.requestee_name
                : relationship?.requester_name;

            // Extract the check-in status and time from the data
            const [status, updateTime] = checkinsData[`${connectionName}@floodhelp.com`] || ["Unknown", "Unknown time"];

            // Set the connection info for the modal
            setSelectedConnection({
                email: `${connectionName}@floodhelp.com`,
                status,
                updateTime,
            });

            setShowAlertModal(true); // Show modal for connection marker
        } catch (error) {
            console.error("Error fetching connection status:", error);
        }
    };

    const closeModal = () => {
        setShowAlertModal(false);
        setSelectedReport(null);
        setSelectedConnection(null);
    };

    // Toggle historical data marker
    const handleHistoricalToggle = () => {
        setShowHistoricalMarker(!showHistoricalMarker);
        if (!showHistoricalMarker) {
            // Set marker in the center of the map
            setHistoricalMarkerCoords({
                latitude: region?.latitude || 0,
                longitude: region?.longitude || 0,
            });
        } else {
            // Remove the marker
            setHistoricalMarkerCoords(null);
        }
    };

    // Function to handle marker drag event
    const onMarkerDragEnd = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setHistoricalMarkerCoords({ latitude, longitude });
        displayCoordinatesAlert(latitude, longitude);
    };

    // Handle user tap on the map to move the marker
    const onMapPress = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setHistoricalMarkerCoords({ latitude, longitude });
        displayCoordinatesAlert(latitude, longitude);
    };

    // Helper function to display alert with coordinates
    const displayCoordinatesAlert = (latitude: number, longitude: number) => {
        console.log("Marker moved/tapped to:", latitude, longitude);
        Alert.alert("Coordinates Selected", `Lat: ${latitude}, Long: ${longitude}`);
    };

    // Helper function to calculate proximity between two points
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    };

    // Check if a connection is within a certain distance of a flood area
    const isConnectionInFloodArea = (connection: ConnectionLocation): boolean => {
        if (!reports || Object.keys(reports).length === 0) return false;

        const proximityThreshold = 1; // Distance in kilometers

        return Object.values(reports).some((report) => {
            if (!report.coordinates) return false;
            const [latitudeStr, longitudeStr] = report.coordinates.replace(/[()]/g, '').split(',');
            const reportLatitude = parseFloat(latitudeStr);
            const reportLongitude = parseFloat(longitudeStr);

            if (isNaN(reportLatitude) || isNaN(reportLongitude)) return false;

            const distance = calculateDistance(connection.latitude, connection.longitude, reportLatitude, reportLongitude);
            return distance <= proximityThreshold;
        });
    };

    const getFloodColor = (title: string): string => {
        if (title.includes('Major Flood')) {
            return 'maroon';
        } else if (title.includes('Moderate Flood')) {
            return 'darkorange';
        } else if (title.includes('Minor Flood')) {
            return 'goldenrod';
        } else {
            return 'maroon';
        }
    };

    if (loading) {
        return (
            <View style={styles.page}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ textAlign: "center", marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }


    return (
        <View style={styles.page}>
            {region && (
                <MapView
                    style={styles.map}
                    customMapStyle={theme.dark ? mapDarkTheme : mapLightTheme}
                    initialRegion={region}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    onPress={showHistoricalMarker ? onMapPress : undefined}  // Only allow tap to place marker if historical mode is active
                >
                    {/* Render Flood Report Markers */}
                    {reports && Object.entries(reports).map(([key, report]: [string, any], index) => {
                        if (!report.coordinates) return null;

                        const [latitudeStr, longitudeStr] = report.coordinates.replace(/[()]/g, '').split(',');
                        const latitude = parseFloat(latitudeStr);
                        const longitude = parseFloat(longitudeStr);
                        const color = getFloodColor(report.title);

                        if (isNaN(latitude) || isNaN(longitude)) return null;

                        return (
                            <Marker
                                key={index}
                                coordinate={{ latitude, longitude }}
                                title={`${report.title}`}
                                onPress={() => handleMarkerPress(report)}
                            >
                                <FontAwesome name="exclamation-circle" size={50} color={color} />
                            </Marker>
                        );
                    })}

                    {/* Render Historical Marker (Draggable) */}
                    {showHistoricalMarker && historicalMarkerCoords && (
                        <Marker
                            coordinate={historicalMarkerCoords}
                            draggable
                            onDragEnd={onMarkerDragEnd}
                            title="Move me to select coordinates"
                        >
                            <FontAwesome name="map-marker" size={50} color="maroon" />
                        </Marker>
                    )}

                    {/* Render Connections' Locations with custom pin image */}
                    {connectionLocations.map((connection, index) => {
                        const relationship = relationships.find(
                            (rel) => (rel.requestee_uid === connection.uid || rel.requester_uid === connection.uid)
                        );
                        const connectionName = relationship?.requestee_uid === connection.uid
                            ? relationship.requestee_name
                            : relationship?.requester_name;

                        // Check if the connection is in a flood area
                        const isInFloodArea = isConnectionInFloodArea(connection);

                        return (
                            <Marker
                                key={index}
                                coordinate={{ latitude: connection.latitude, longitude: connection.longitude }}
                                title={connectionName}
                                onPress={() => handleConnectionPress(connection)}
                            >
                                <Image
                                    source={isInFloodArea ? require('@/assets/images/map-marker-warning.png') : require('@/assets/images/map-marker-default.png')}
                                    style={{ width: 40, height: 40 }}
                                    resizeMode="contain"
                                />
                            </Marker>
                        );
                    })}
                </MapView>
            )}
            {/* Flood Report Modal */}
            {selectedReport && (
            <Modal
                transparent={true}
                visible={showAlertModal}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.alertModal}>
                        <View style={styles.alertContent}>
                            {/* Row for Warning Icon and Title */}
                            <View style={styles.alertHeader}>
                                <FontAwesome name="exclamation-circle" size={30} color={getFloodColor(selectedReport.title)} />
                                <Text style={styles.alertTitle}>
                                    Flood Alert | {formatTime(selectedReport.datetime)}
                                </Text>
                            </View>
            
                            {/* Report Details */}
                            <Text style={styles.alertDescription}>
                                {selectedReport.title} was reported at {selectedReport.location || 'Unknown Location'} on {selectedReport.datetime}.
                            </Text>
            
                            {/* Got it Button */}
                            <Pressable style={styles.alertButton} onPress={closeModal}>
                                <Text style={styles.alertButtonText}>Got it!</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            )}
            {/* Connection Modal */}
            {selectedConnection && (
                <Modal
                    transparent={true}
                    visible={showAlertModal}
                    animationType="slide"
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.alertModal}>
                            <View style={styles.alertContent}>
                                {/* Row for Connection Icon and Name */}
                                <View style={styles.alertHeader}>
                                    <Image
                                        source={require('@/assets/images/connection.png')}
                                        style={{ width: 30, height: 30 }}
                                    />
                                    <Text style={styles.alertTitle}>
                                    {selectedConnection.email.split('@')[0]} | {formatTime(selectedConnection.updateTime)}
                                    </Text>
                                </View>

                                {/* Status and Time */}
                                <Text style={styles.alertDescription}>
                                    Last status: "{selectedConnection.status}" updated on {selectedConnection.updateTime}.
                                </Text>

                                {/* Buttons */}
                                <View style={styles.buttonContainer}>
                                    <Pressable style={styles.checkInButton} onPress={() => console.log("Check In pressed")}>
                                        <Text style={styles.alertButtonText}>Check In</Text>
                                    </Pressable>
                                    <Pressable style={styles.viewNotificationButton} onPress={() => navigation.navigate('notifications')}>
                                        <Text style={styles.alertButtonText}>View Notifications</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={handleAddReport} style={styles.iconButton}>
                    <Icon name="report" size={40} color={theme.dark ? "maroon" : "maroon"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleHistoricalToggle} style={styles.iconButton}>
                    <Icon name="history" size={40} color={showHistoricalMarker ? "maroon" : "midnightblue"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={updateLocationAndFetchConnections} style={styles.iconButton}>
                    <Icon name="refresh" size={40} color={theme.dark ? "green" : "green"} />
                </TouchableOpacity>
            </View>

            {/* Instructions */}
            {showHistoricalMarker && (
                <View style={styles.instructionContainer}>
                    <Text style={styles.instructionText}>Drag the pin or tap on the map to move the marker.</Text>
                    <Text style={styles.instructionText}>Tap the historical icon again to exit historical mode.</Text>
                </View>
            )}
        </View>
    );
}