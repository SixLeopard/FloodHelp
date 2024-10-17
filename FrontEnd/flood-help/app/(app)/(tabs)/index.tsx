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


/**
 * Main component for displaying the map with various markers and modals for flood reports, connections, and alerts.
 *
 * @component
 * @returns {JSX.Element} The main map screen component.
 */
export default function Index() {
    // Accessing theme styles and context
    const styles = useStyles();
    const { theme } = useTheme();
    
    // State variables
    const [region, setRegion] = useState<Region | null>(null); // To track user's current location
    const [connectionLocations, setConnectionLocations] = useState<ConnectionLocation[]>([]); // For connection data
    const [relationships, setRelationships] = useState<Relationship[]>([]); // For relationship data
    const [reports, setReports] = useState<{ [key: string]: Report }>({}); // Flood reports data
    const [officialAlerts, setOfficialAlerts] = useState<OfficialAlert[]>([]);  // Official flood alerts
    const [loading, setLoading] = useState(true); // Loading state
    const [showAlertModal, setShowAlertModal] = useState(false); // Modal visibility state
    const [isUserInFloodArea, setIsUserInFloodArea] = useState(false); // Whether the user is in a flood zone
    const [selectedReport, setSelectedReport] = useState<Report | null>(null); // Selected flood report for modal
    const [selectedConnection, setSelectedConnection] = useState<CheckInStatus | null>(null); // Selected connection
    const [selectedOfficialAlert, setSelectedOfficialAlert] = useState<OfficialAlert | null>(null); // Selected alert
    const [showHistoricalMarker, setShowHistoricalMarker] = useState(false); // Toggle for historical marker
    const [historicalMarkerCoords, setHistoricalMarkerCoords] = useState<{ latitude: number; longitude: number; } | null>(null); // Coordinates for historical marker
    const [polygonCoords, setPolygonCoords] = useState<{ latitude: number; longitude: number; }[]>([]); // To store polygon coordinates
    const [riskLevel, setRiskLevel] = useState<string | null>(null); // To store risk level
    const [validationScore, setValidationScore] = useState<number | null>(null); // To store the validation score


    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { user } = useAuth(); // Authentication context to get the current user

    // useEffect hook to trigger location and data fetching when user logs in
    useEffect(() => {
        console.log("useEffect triggered with user:", user);
        if (!user) return;
    
        fetchData();
    }, [user]);

    /**
     * Fetch data when the user logs in. This includes location updates, reports, and alerts.
     *
     * @async
     */
    const fetchData = async () => {
        try {
            await updateLocationAndFetchConnections();
            await fetchReports();
            await fetchOfficialAlerts();
        } catch (error) {
            console.error('Error fetching data on user login:', error);
        }
    };

    /**
     * Fetch all flood reports from the server and map them by their report IDs.
     *
     * @async
     */
    const fetchReports = async () => {
        try {
            const response = await fetch('http://54.206.190.121:5000/reporting/user/get_all_report_basic', {
                method: 'GET',
            });
            const reportsData = await response.json();

            // Convert the array of reports into an object with report_id as keys
            const mappedReports = Object.keys(reportsData).reduce((acc, reportId) => {
                acc[reportId] = {
                    report_id: reportId,  // Include the report_id
                    ...reportsData[reportId],  // Spread the other data like datetime, title, type, etc.
                };
                return acc;
            }, {} as { [key: string]: Report });

            setReports(mappedReports); 
            console.log('Fetched Flood Reports with Report IDs:', mappedReports);
        } catch (error) {
            console.error('Error fetching flood reports:', error);
            setReports({});
        }
    };

    /**
     * Fetch validation score for a specific report based on its report ID.
     *
     * @param {number} reportId - The ID of the report to fetch validation score for.
     * @async
     */
    const fetchValidationScore = async (reportId: number) => {
        try {
            const formData = new FormData();
            formData.append('report_id', String(reportId));

            const response = await fetch('http://54.206.190.121:5000/reporting/user/get_report_validation_score', {
                method: 'POST',
                body: formData,
            });

            const scoreData = await response.json();
            if (scoreData[reportId]) {
                const score = scoreData[reportId][0];
                setValidationScore(score);
            } else {
                setValidationScore(null); // Reset score if not available
            }

            console.log('Validation Score:', scoreData);
        } catch (error) {
            console.error('Error fetching validation score:', error);
        }
    };

    /**
     * Fetch official flood alerts from the server and map them into `OfficialAlert` objects.
     *
     * @async
     */
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

    /**
     * Process the polygon data received from the server and extract coordinates for flood zones.
     * 
     * @param {Object} data - The polygon data received from the server.
     */
    const processPolygonData = (data: any) => {
        let { coordinates: coordinatesString, geo_type, risk } = data;
    
        // Check if coordinates and geo_type exist
        if (!coordinatesString || !geo_type || !risk) {
            console.log("No historical risk available for this area.");
            setRiskLevel("No historical risk available for this area.");
            return;
        }
    
        // Remove extra quotes from geo_type
        geo_type = geo_type.replace(/['"]+/g, '');
        risk = risk.replace(/['"]+/g, '');
    
        // Parse the coordinates string into an array
        let coordinates;
        try {
            coordinates = typeof coordinatesString === 'string' ? JSON.parse(coordinatesString) : coordinatesString;
        } catch (error) {
            console.error('Error parsing coordinates:', error);
            console.log("No valid coordinates found.");
            return;
        }
    
        let polygonCoords: { latitude: number; longitude: number }[] = [];
    
        // Helper function to extract and flatten coordinates
        const extractCoordinates = (coords: any[]) => {
            coords.forEach((ring: any[]) => {
                ring.forEach(([longitude, latitude]: [number, number]) => {
                    polygonCoords.push({ latitude, longitude });
                });
            });
        };
    
        // Handle MultiPolygon
        if (geo_type === 'MultiPolygon') {
            coordinates.forEach((polygon: any[]) => {
                polygon.forEach((ring: any[]) => {
                    extractCoordinates([ring]); // Flatten the coordinates
                });
            });
        }
        // Handle Polygon
        else if (geo_type === 'Polygon') {
            extractCoordinates(coordinates);
        } else {
            console.log("Geo type is not recognized. No historical risk data available.");
            return;
        }
    
        // Set the polygon coordinates or handle no data case
        if (polygonCoords.length > 0) {
            setPolygonCoords(polygonCoords);
            console.log('Updated Polygon Coordinates:', polygonCoords); 
            setRiskLevel(risk);  // Set the risk level
        } else {
            console.log("No valid coordinates found.");
            setRiskLevel("No historical risk available for this area."); // Set risk level to default if no coordinates are found
        }
        };
    
    /**
     * Fetch polygon data from the server based on the given latitude and longitude.
     * 
     * @param {number} latitude - The latitude of the selected location.
     * @param {number} longitude - The longitude of the selected location.
     * @async
     */
    const fetchPolygonData = async (latitude: number, longitude: number) => {
        try {
            const formData = new FormData();
            formData.append('coordinate', `(${longitude},${latitude})`);

            const response = await fetch('http://54.206.190.121:5000/externalData/get_polygon', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log('Polygon Data:', data);

            if (data) {
                processPolygonData(data);
            } else {
                console.error('Invalid polygon data structure:', data);
            }
        } catch (error) {
            console.error('Error fetching polygon data:', error);
        }
    };
    
    /**
     * Update the user's location and fetch their connection data from the server.
     *
     * @async
     */
    const updateLocationAndFetchConnections = async () => {
        try {
            // Request location permission
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission to access location was denied");
                setLoading(false);
                return;
            }

            // Get user's current location
            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

            // Check if user is in a flood area (based on reported floods)
            const userIsNearReport = Object.values(reports).some((report) => {
                if (!report.coordinates) return false;
                const [reportLatStr, reportLonStr] = report.coordinates.replace(/[()]/g, '').split(',');
                const reportLat = parseFloat(reportLatStr);
                const reportLon = parseFloat(reportLonStr);

                if (isNaN(reportLat) || isNaN(reportLon)) return false;

                const distance = calculateDistance(latitude, longitude, reportLat, reportLon);
                return distance <= 1; // Proximity threshold in km
            });

            // Check if user is near an official alert
            const userIsNearAlert = officialAlerts.some((alert) => {
                const coordinates = alert.coordinates;
                if (!coordinates) return false;
                const [alertLatStr, alertLonStr] = coordinates.replace(/[()]/g, '').split(',');
                const alertLat = parseFloat(alertLatStr);
                const alertLon = parseFloat(alertLonStr);

                if (isNaN(alertLat) || isNaN(alertLon)) return false;

                const distance = calculateDistance(latitude, longitude, alertLat, alertLon);
                return distance <= 1; // Proximity threshold in km
            });

            const isInFloodArea = userIsNearReport || userIsNearAlert;
            setIsUserInFloodArea(isInFloodArea);

            // If user is in a flood area, change status to "Unsafe"
            if (isInFloodArea) {
                await sendUnsafeStatus();
            } else {
                // If not near any flood areas, send "Safe" status
                await sendSafeStatus();
            }

            // Update the user's location on the server
            const formData = new FormData();
            formData.append('location', `(${latitude},${longitude})`);
            const locationUpdateResponse = await fetch('http://54.206.190.121:5000/locations/update', {
                method: 'POST',
                body: formData,
            });
            const locationData = await locationUpdateResponse.json();
            console.log('Location Update Response:', locationData);

            // Process location data into ConnectionLocation objects
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

            // Fetch relationships data
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


    /**
     * Send the user's status as "Safe" to the server.
     * 
     * @async
     */
    const sendSafeStatus = async () => {
        try {
            const formData = new FormData();
            formData.append('status', 'Safe');

            const response = await fetch('http://54.206.190.121:5000/check_in/send', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.error('Failed to send Safe status:', response.status);
            } else {
                console.log('Safe status sent successfully.');
            }
        } catch (error) {
            console.error('Error sending Safe status:', error);
        }
    };
    
    /**
     * Send the user's status as "Unsafe" to the server.
     * 
     * @async
     */
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

    /**
     * Send a check-in notification to a connection based on their UID.
     * 
     * @param {number} uid - The UID of the connection to send the notification to.
     * @async
     */
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
    
            // Send the check-in notification
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
    
    /**
     * Fetch the address corresponding to the given coordinates.
     *
     * @param {string} coordinates - Coordinates as a string in "(latitude,longitude)" format.
     * @returns {Promise<string>} The address of the coordinates.
     * @async
     */
    const getAddressFromCoordinates = async (coordinates: string): Promise<string> => {
        try {
            const [latitude, longitude] = coordinates.replace(/[()]/g, '').split(',');
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);
    
            const addressArray = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
    
            if (addressArray.length > 0) {
                const address = addressArray[0];
                return `${address.street}, ${address.city}`;
            } else {
                return 'Unknown Location';
            }
        } catch (error) {
            console.error("Error getting address from coordinates:", error);
            return 'Unknown Location';
        }
    };

    /**
     * Format the time from a datetime string.
     * 
     * @param {string} datetime - The datetime string to format.
     * @returns {string} The formatted time in 12-hour format.
     */
    const formatTime = (datetime: string) => {
        const date = new Date(datetime);
        let hours = date.getUTCHours(); 
        let minutes: string | number = date.getUTCMinutes(); 
        const ampm = hours >= 12 ? 'pm' : 'am';
    
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0' + minutes : minutes;
    
        return `${hours}:${minutes} ${ampm}`;
    };

    /**
     * Handle when a flood report marker is pressed. Fetch additional data like location and validation score.
     *
     * @param {Report} report - The report object associated with the marker.
     * @async
     */
    const handleMarkerPress = async (report: any) => {
        try {
            const location = await getAddressFromCoordinates(report.coordinates);
            setSelectedReport({ ...report, location }); // Include the fetched location
        
            const reportId = report.report_id;  // Use the report_id from the fetched report data
            await fetchValidationScore(reportId);  // Fetch validation score using the report_id

            setShowAlertModal(true);
        } catch (error) {
            console.error('Error fetching location or validation score for report:', error);
        }
    };


    /**
     * Handle when an official alert marker is pressed and show a modal with alert details.
     *
     * @param {OfficialAlert} alert - The official alert object associated with the marker.
     */
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

    // Close modal function
    const closeModal = () => {
        setShowAlertModal(false);
        setSelectedReport(null);
        setSelectedConnection(null);
        setSelectedOfficialAlert(null);
    };

    /**
     * Calculate the distance between two geographic coordinates.
     * 
     * @param {number} lat1 - Latitude of the first point.
     * @param {number} lon1 - Longitude of the first point.
     * @param {number} lat2 - Latitude of the second point.
     * @param {number} lon2 - Longitude of the second point.
     * @returns {number} The distance between the two points in kilometers.
     */
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

    /**
     * Check if a connection is located within a flood zone.
     * 
     * @param {ConnectionLocation} connection - The connection's location.
     * @returns {boolean} True if the connection is in a flood area, false otherwise.
     */
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

    /**
     * Handle the event when a marker is dragged and dropped on the map.
     * 
     * @param {Object} e - The event object containing the new marker coordinates.
     */
    const onMarkerDragEnd = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setHistoricalMarkerCoords({ latitude, longitude });
        displayCoordinatesAlert(latitude, longitude);
    
        // Fetch polygon data after marker is dragged
        fetchPolygonData(latitude, longitude);
    };

    /**
     * Handle the event when a user taps on the map to move the historical marker.
     * 
     * @param {Object} e - The event object containing the new marker coordinates.
     */
    const onMapPress = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setHistoricalMarkerCoords({ latitude, longitude });
        displayCoordinatesAlert(latitude, longitude);
    
        // Fetch polygon data when user taps on the map
        fetchPolygonData(latitude, longitude);
    };

    /**
     * Display an alert with the selected coordinates after marker movement.
     * 
     * @param {number} latitude - The latitude of the selected coordinates.
     * @param {number} longitude - The longitude of the selected coordinates.
     */
    const displayCoordinatesAlert = (latitude: number, longitude: number) => {
        console.log("Marker moved/tapped to:", latitude, longitude);
        Alert.alert("Coordinates Selected", `Lat: ${latitude}, Long: ${longitude}`);
    };

    /**
     * Navigate to the 'newreport' screen to add a new report.
     */
    const handleAddReport = () => {
        navigation.navigate('newreport');
    };

    /**
     * Toggle the visibility of the historical marker on the map.
     */
    const handleHistoricalToggle = () => {
        setShowHistoricalMarker(!showHistoricalMarker);
        if (!showHistoricalMarker) {
            // Set marker in the center of the map
            setHistoricalMarkerCoords({
                latitude: region?.latitude || 0,
                longitude: region?.longitude || 0,
            });
        } else {
            // Remove the marker and polygon coordinates
            setHistoricalMarkerCoords(null);
            setPolygonCoords([]); // Reset polygon coordinates
            setRiskLevel(null); // Reset risk level when historical mode is closed
        }
    };

    /**
     * Get the appropriate color based on the flood severity type.
     * 
     * @param {string} type - The flood severity type.
     * @returns {string} The color corresponding to the flood type.
     */
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

    // Render loading spinner while data is being fetched
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
                    onPress={showHistoricalMarker ? onMapPress : undefined}  // Only allow tap to place marker if historical mode is active
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
                        const color = getFloodColor(report.type);

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
                        const coordinates = alert.coordinates || ''; 
                        const [latitudeStr, longitudeStr] = coordinates.replace(/[{}]/g, '').split(',');
                        const latitude = parseFloat(latitudeStr);
                        const longitude = parseFloat(longitudeStr);
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
                    {/* Render Polygon on the map if available */}
                    {polygonCoords.length > 0 && (
                        <Polygon
                            coordinates={polygonCoords}
                            strokeColor="maroon"  
                            fillColor="rgba(128, 0, 0, 0.3)"  
                        />
                    )}
                    {/* Render Historical Marker (Draggable) */}
                    {showHistoricalMarker && historicalMarkerCoords && (
                        <Marker
                            coordinate={historicalMarkerCoords}
                            draggable
                            onDragEnd={onMarkerDragEnd}
                            title="Move me to select coordinates"
                        >
                            <FontAwesome name="map-marker" size={50} color="midnightblue" />
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

                                {/* Display Validation Score */}
                                {validationScore !== null && (
                                    <Text style={styles.alertDescription}>
                                        Report Accuracy Score: {validationScore}
                                    </Text>
                                )}
    
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
                    <Icon name="history" size={40} color={showHistoricalMarker ? "maroon" : "midnightblue"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={updateLocationAndFetchConnections} style={styles.iconButton}>
                    <Icon name="refresh" size={40} color={theme.dark ? "green" : "green"} />
                </TouchableOpacity>
            </View>

            {/* Display Risk Information on Top of Instructions */}
            {showHistoricalMarker && (
                <View style={styles.riskContainer}>
                    <Text style={styles.riskInfo}>
                        {riskLevel ? `Risk Level: ${riskLevel}` : "Historical risk will be displayed here."}
                    </Text>
                </View>
            )}

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