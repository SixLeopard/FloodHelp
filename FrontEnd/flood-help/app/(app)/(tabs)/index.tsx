import React, { useState, useEffect } from "react";
import { View, Alert, TouchableOpacity, ActivityIndicator, Text, Image, Modal, Pressable } from "react-native";
import useStyles from "@/constants/style";
import MapView, { Marker, Region, Polygon } from "react-native-maps";
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
    type: string;
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
    uid: number;
    name: string;
    status: string;
    updateTime: string;
}

interface OfficialAlert {
    id: number;
    description: string;
    area: string;
    riskLevel: string;
    certainty: string;
    effectiveFrom: string;
    effectiveUntil: string;
    coordinates: string;
}

interface HistoricalEntry {
    id: number;
    risk: string;
    coordinates: string;
    type: string;
}

interface HistoricalData {
    id: number;
    risk: string;
    coordinates: Array<{ latitude: number; longitude: number }> | null;
    type: string;
}




export default function Index() {
    const styles = useStyles();
    const { theme } = useTheme();
    const [region, setRegion] = useState<Region | null>(null);
    const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
    const [connectionLocations, setConnectionLocations] = useState<ConnectionLocation[]>([]);
    const [relationships, setRelationships] = useState<Relationship[]>([]);
    const [reports, setReports] = useState<{ [key: string]: Report }>({});
    const [officialAlerts, setOfficialAlerts] = useState<OfficialAlert[]>([]);  
    const [loading, setLoading] = useState(true);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [isUserInFloodArea, setIsUserInFloodArea] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [selectedConnection, setSelectedConnection] = useState<CheckInStatus | null>(null);
    const [selectedOfficialAlert, setSelectedOfficialAlert] = useState<OfficialAlert | null>(null); 
    const [selectedPolygonRisk, setSelectedPolygonRisk] = useState<string | null>(null);
    const [isHistoricalModeActive, setIsHistoricalModeActive] = useState(false);
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

    const fetchOfficialAlerts = async () => {
        try {
            const response = await fetch('http://54.206.190.121:5000/externalData/get_alerts', {
                method: 'GET',
            });
            const alertsData = await response.json();
    
            // Map the array format into OfficialAlert objects
            const mappedAlerts = alertsData.map((alert: any[]): OfficialAlert => ({
                id: alert[0], 
                description: alert[1],
                area: alert[2],
                riskLevel: alert[3],
                certainty: alert[4],
                effectiveFrom: alert[5],
                effectiveUntil: alert[6],
                coordinates: alert[7],
            }));
    
            setOfficialAlerts(mappedAlerts); 
            console.log('Fetched Official Alerts:', mappedAlerts);
        } catch (error) {
            console.error('Error fetching official alerts:', error);
            setOfficialAlerts([]);
        }
    };

    // Fetch historical data
    const fetchHistoricalData = async () => {
        try {
            console.log('Fetching historical data...');
            const response = await fetch('http://54.206.190.121:5000/externalData/get_historical_data', {
                method: 'GET',
            });
        
            const data: HistoricalEntry[] = await response.json();
            console.log('Raw data fetched:', data); // Log the fetched data
        
            const parsedHistoricalData = data.map((entry: any, index: number) => {
                let coordinates: Array<{ latitude: number; longitude: number }> = [];
    
                const id = typeof entry[0] === 'number' ? entry[0] : 91 + index;
    
                try {
                    if (!entry[2] || entry[2].trim() === "") {
                        return null; // Silently skip entries with missing coordinates
                    }
    
                    const sanitizedCoordinates = entry[2].replace(/\\/g, ''); // Remove extra backslashes
                    const parsedCoordinates = JSON.parse(sanitizedCoordinates);
    
                    const type = entry[3] ? entry[3].replace(/['"]/g, '') : null;
                    if (!type) {
                        return null; // Silently skip entries with missing type
                    }
    
                    // Handle Polygon and MultiPolygon types
                    if (type === 'Polygon' || type === 'MultiPolygon') {
                        if (Array.isArray(parsedCoordinates)) {
                            if (type === 'Polygon' && parsedCoordinates.length > 0 && Array.isArray(parsedCoordinates[0])) {
                                coordinates = parsedCoordinates[0].map((coord: any) => {
                                    if (Array.isArray(coord) && coord.length === 2) {
                                        const [lon, lat] = coord;
                                        if (typeof lat === 'number' && typeof lon === 'number') {
                                            return { latitude: lat, longitude: lon };
                                        }
                                    }
                                    return null;
                                }).filter((coord) => coord !== null);
                            } else if (type === 'MultiPolygon') {
                                parsedCoordinates.forEach((polygon: any) => {
                                    if (Array.isArray(polygon[0])) {
                                        const polygonCoordinates = polygon[0].map((coord: any) => {
                                            if (Array.isArray(coord) && coord.length === 2) {
                                                const [lon, lat] = coord;
                                                if (typeof lat === 'number' && typeof lon === 'number') {
                                                    return { latitude: lat, longitude: lon };
                                                }
                                            }
                                            return null;
                                        }).filter((coord) => coord !== null);
                                        coordinates = coordinates.concat(polygonCoordinates); // Concatenate multiple polygons
                                    }
                                });
                            }
                        } else {
                            console.error(`Invalid coordinates format for entry with id ${id}:`, parsedCoordinates);
                        }
                    } else {
                        return null; // Silently skip unknown types
                    }
                } catch (parseError) {
                    console.error(`Error parsing coordinates for entry with id ${id}:`, parseError);
                }
    
                return {
                    id: id,
                    risk: entry[1] ? entry[1].replace(/['"]/g, '') : 'Unknown', 
                    coordinates: coordinates.length > 0 ? coordinates : null, 
                    type: entry[3] ? entry[3].replace(/['"]/g, '') : 'Unknown', 
                };
            }).filter((entry) => entry !== null);
        
            console.log('Parsed historical data:', parsedHistoricalData);
            setHistoricalData(parsedHistoricalData); // Set parsed data
        } catch (error) {
            console.error('Error fetching historical data:', error);
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

            // Check if user is in a flood area
            const userIsInFloodArea = Object.values(reports).some((report) => {
                if (!report.coordinates) return false;
                const [reportLatStr, reportLonStr] = report.coordinates.replace(/[()]/g, '').split(',');
                const reportLat = parseFloat(reportLatStr);
                const reportLon = parseFloat(reportLonStr);

                if (isNaN(reportLat) || isNaN(reportLon)) return false;

                const distance = calculateDistance(latitude, longitude, reportLat, reportLon);
                return distance <= 1; // Proximity threshold in km
            });

            // Update the state based on the user's proximity to the flood area
            setIsUserInFloodArea(userIsInFloodArea);

            // If user is too close to a flood zone, change status to "Unsafe"
            if (userIsInFloodArea) {
                await sendUnsafeStatus();
            }

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
            await fetchOfficialAlerts();

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

    // Get color based on risk level
    const getPolygonColor = (risk: string): string => {
        switch (risk.toLowerCase()) {
            case 'high':
                return 'rgba(255, 0, 0, 0.5)'; // Red for high risk
            case 'medium':
                return 'rgba(255, 165, 0, 0.5)'; // Orange for medium risk
            case 'low':
                return 'rgba(255, 255, 0, 0.5)'; // Yellow for low risk
            default:
                return 'rgba(0, 0, 255, 0.5)'; // Blue for unknown risk
        }
    };

    // Toggle historical data mode
    const handleHistoricalToggle = () => {
        if (isHistoricalModeActive) {
            console.log('Exiting historical mode...');
            setIsHistoricalModeActive(false);
            setHistoricalData([]); // Clear historical data when exiting
        } else {
            console.log('Entering historical mode...');
            fetchHistoricalData();
            setIsHistoricalModeActive(true);
        }
    };

    // Display a modal when a polygon is pressed
    const handlePolygonPress = (risk: string) => {
        setSelectedPolygonRisk(risk);
    };

    // Function to send "Unsafe" status
    const sendUnsafeStatus = async () => {
        try {
            const formData = new FormData();
            formData.append('status', 'Unsafe');

            const response = await fetch('http://54.206.190.121:5000/check_in/send', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.error('Failed to send Unsafe status:', response.status);
            } else {
                console.log('Unsafe status sent successfully.');
            }
        } catch (error) {
            console.error('Error sending Unsafe status:', error);
        }
    };

    const handleCheckIn = async (uid: number) => {
        try {
            // Look up the user's name based on the uid
            const relationship = relationships.find(
                (rel) => rel.requestee_uid === uid || rel.requester_uid === uid
            );
    
            const userName = relationship?.requestee_uid === uid
                ? relationship?.requestee_name
                : relationship?.requester_name;
    
            const formData = new FormData();
            formData.append('reciever', String(uid));
    
            // Send the check-in notification using the updated API endpoint
            const response = await fetch('http://54.206.190.121:5000/check_in/send_push', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                Alert.alert('Check-In Sent', `Check-in notification sent to ${userName || 'Unknown User'}.`);
            } else {
                console.error('Failed to send check-in notification:', response.status);
                Alert.alert('Error', 'Failed to send check-in notification.');
            }
        } catch (error) {
            console.error('Error sending check-in notification:', error);
            Alert.alert('Error', 'Failed to send check-in notification.');
        }
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

    const handleOfficialAlertPress = (alert: OfficialAlert) => {
        setSelectedOfficialAlert(alert);  
        setShowAlertModal(true);
    };

    // Modal for connection markers
    const handleConnectionPress = async (connection: ConnectionLocation) => {
        try {
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
                ? relationship?.requestee_name || 'Unknown'
                : relationship?.requester_name || 'Unknown';

            const [status, updateTime] = checkinsData[`${connection.uid}`][0] || ["Unknown", "Unknown time"];

            setSelectedConnection({
                uid: connection.uid,
                name: connectionName,
                status,
                updateTime,
            });

            setShowAlertModal(true);
        } catch (error) {
            console.error("Error fetching connection status:", error);
        }
    };

    const closeModal = () => {
        setShowAlertModal(false);
        setSelectedReport(null);
        setSelectedConnection(null);
        setSelectedOfficialAlert(null);
        setSelectedPolygonRisk(null);
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

    const getFloodColor = (type: string): string => {
        if (type == null) {
            return 'midnightblue';
        }
        if (type.includes('Major Flood')) {
            return 'maroon';
        } else if (type.includes('Moderate Flood')) {
            return 'darkorange';
        } else if (type.includes('Minor Flood')) {
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
                    showsUserLocation={false}
                    showsMyLocationButton={true}
                >
                    {/* Render User's Current Location Marker with Custom Circle */}
                    {region && (
                        <Marker
                            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                            title={"Your Location"}
                        >
                            <View style={[
                                styles.circleMarker,
                                { backgroundColor: isUserInFloodArea ? "maroon" : "green" }
                                ]} />
                        </Marker>
                    )}
                    
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

                    {/* Render Official Alert Markers */}
                    {officialAlerts.map((alert, index) => {
                        // Ensure coordinates are a string and process them safely
                        const coordinates = alert.coordinates || ''; 

                        // Only process coordinates if they're available
                        const [latitudeStr, longitudeStr] = coordinates.replace(/[{}]/g, '').split(',');

                        // Parse the latitude and longitude strings into floats
                        const latitude = parseFloat(latitudeStr);
                        const longitude = parseFloat(longitudeStr);

                        // If parsing failed, skip rendering this marker
                        if (isNaN(latitude) || isNaN(longitude)) return null;

                        return (
                            <Marker
                                key={index}
                                coordinate={{ latitude, longitude }}
                                title={"Official Flood Alert"} 
                                onPress={() => handleOfficialAlertPress(alert)}
                            >
                                <FontAwesome name="exclamation-triangle" size={50} color="maroon" />
                            </Marker>
                        );
                    })}

                    {/* Render Historical Data as Polygons */}
                    {historicalData.map((data, index) => {
                        // Ensure coordinates are not null before rendering the Polygon
                        if (!data.coordinates) return null;

                        return (
                            <Polygon
                                key={index}
                                coordinates={data.coordinates.map(coord => ({
                                    latitude: coord.latitude, // Access latitude directly
                                    longitude: coord.longitude, // Access longitude directly
                                }))}
                                strokeColor="rgba(0,0,0,0.5)" // Border color
                                fillColor={getPolygonColor(data.risk)} // Fill color based on risk
                                tappable
                                onPress={() => handlePolygonPress(data.risk)} // Show risk on tap
                            />
                        );
                    })}


                    {/* Render Connections' Locations with custom pin image */}
                    {connectionLocations.map((connection, index) => {
                        const relationship = relationships.find(
                            (rel) => (rel.requestee_uid === connection.uid || rel.requester_uid === connection.uid)
                        );
                        const connectionName = relationship?.requestee_uid === connection.uid
                            ? relationship.requestee_name
                            : relationship?.requester_name;

                        const isInFloodArea = isConnectionInFloodArea(connection);

                        return (
                            <Marker
                                key={index}
                                coordinate={{ latitude: connection.latitude, longitude: connection.longitude }}
                                title={connectionName}

                                onPress={() => handleConnectionPress(connection)}
                            >
                                <View style={{
                                    width: 60, 
                                    height: 60,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Image
                                        source={isInFloodArea ? require('@/assets/images/map-marker-warning.png') : require('@/assets/images/map-marker-default.png')}
                                        style={{ width: 50, height: 50 }}
                                        resizeMode="contain"
                                    />
                                </View>
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
                    onRequestClose={closeModal} // Closing modal on back press for Android
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={closeModal} // Close modal when pressing outside
                    >
                        <View style={styles.alertModal}>
                            <View style={styles.alertContent}>
                                {/* Row for Warning Icon and Title */}
                                <View style={styles.alertHeader}>
                                    <FontAwesome name="exclamation-circle" size={30} color={getFloodColor(selectedReport.type)} />
                                    <Text style={styles.alertTitle}>
                                    {selectedReport.title} | {formatTime(selectedReport.datetime)}
                                    </Text>
                                </View>
    
                                {/* Report Details */}
                                <Text style={styles.alertDescription}>
                                    {selectedReport.type} was reported at {selectedReport.location || 'Unknown Location'} on {selectedReport.datetime}.
                                </Text>
    
                                {/* Got it Button */}
                                <Pressable style={styles.alertButton} onPress={closeModal}>
                                    <Text style={styles.alertButtonText}>Got it!</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            )}
            {/* Official Alert Modal */}
            {selectedOfficialAlert && (
                <Modal
                    transparent={true}
                    visible={showAlertModal}
                    animationType="slide"
                    onRequestClose={closeModal}  // Close modal on back press for Android
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={closeModal}  // Close modal when pressing outside
                    >
                        <View style={styles.alertModal}>
                            <View style={styles.alertContent}>
                                {/* Row for Warning Icon and Title */}
                                <View style={styles.alertHeader}>
                                    <FontAwesome name="warning" size={30} color="maroon" />
                                    <Text style={styles.alertTitle}>
                                        Flood Alert | {formatTime(selectedOfficialAlert.effectiveFrom)}
                                    </Text>
                                </View>

                                {/* Official Alert Details */}
                                <Text style={styles.alertDescription}>
                                    Official flood alert at {selectedOfficialAlert.area} received on {new Date(selectedOfficialAlert.effectiveFrom).toLocaleString()}.
                                </Text>

                                {/* Got it Button */}
                                <Pressable style={styles.alertButton} onPress={closeModal}>
                                    <Text style={styles.alertButtonText}>Got it!</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            )}
            {/* Modal for showing polygon risk */}
            {selectedPolygonRisk && (
                <Modal
                    transparent={true}
                    visible={!!selectedPolygonRisk}
                    animationType="slide"
                    onRequestClose={closeModal}
                >
                    <Pressable style={styles.modalOverlay} onPress={closeModal}>
                        <View style={styles.alertModal}>
                            <View style={styles.alertContent}>
                                <Text style={styles.alertTitle}>Risk Level: {selectedPolygonRisk}</Text>
                                <Pressable style={styles.alertButton} onPress={closeModal}>
                                    <Text style={styles.alertButtonText}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            )}
            {/* Connection Modal */}
            {selectedConnection && (
                <Modal
                    transparent={true}
                    visible={showAlertModal}
                    animationType="slide"
                    onRequestClose={closeModal} // Closing modal on back press for Android
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={closeModal} // Close modal when pressing outside
                    >
                        <View style={styles.alertModal}>
                            <View style={styles.alertContent}>
                                <View style={styles.alertHeader}>
                                    <Image
                                        source={require('@/assets/images/connection.png')}
                                        style={{ width: 30, height: 30 }}
                                    />
                                    <Text style={styles.alertTitle}>
                                        {selectedConnection.name} | {formatTime(selectedConnection.updateTime)}
                                    </Text>
                                </View>

                                <Text style={styles.alertDescription}>
                                    Last status: "{selectedConnection.status}" updated on {selectedConnection.updateTime}.
                                </Text>

                                <View style={styles.buttonContainer}>
                                    <Pressable style={styles.checkInButton} onPress={() => handleCheckIn(selectedConnection.uid)}>
                                        <Text style={styles.alertButtonText}>Check In</Text>
                                    </Pressable>
                                    <Pressable style={styles.viewNotificationButton} onPress={() => navigation.navigate('notifications')}>
                                        <Text style={styles.alertButtonText}>View Notifications</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            )}

            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={handleAddReport} style={styles.iconButton}>
                    <Icon name="report" size={40} color={theme.dark ? "maroon" : "maroon"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleHistoricalToggle} style={styles.iconButton}>
                    <Icon name="history" size={40} color={isHistoricalModeActive ? "maroon" : "midnightblue"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={updateLocationAndFetchConnections} style={styles.iconButton}>
                    <Icon name="refresh" size={40} color={theme.dark ? "green" : "green"} />
                </TouchableOpacity>
            </View>
        </View>
    );
}