import React, { useState, useEffect } from "react";
import { View, Alert, TouchableOpacity, ActivityIndicator, Text, Image } from "react-native";
import useStyles from "@/constants/style";
import MapView, { Marker, Polygon, Region } from "react-native-maps";
import { mapLightTheme, mapDarkTheme } from "@/constants/Themes";
import { useTheme } from "@/contexts/ThemeContext";
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import historicalFloodData from '@/assets/historical_flood_data.json';

// Define the structure of historical flood data
interface HistoricalFloodData {
    flood_risk: { [key: string]: string }; // 'Very Low', 'Low', 'Medium', 'High', etc.
    coordinates: { [key: string]: number[][][] | number[][][][] }; // Polygon or MultiPolygon
    type: { [key: string]: 'Polygon' | 'MultiPolygon' }; // 'Polygon' or 'MultiPolygon'
}

type RootStackParamList = {
    newreport: undefined;
    notifications: undefined;
};

interface Report {
    datetime: string;
    title: string;
    coordinates: string;
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

export default function Index() {
    const styles = useStyles();
    const { theme } = useTheme();
    const [region, setRegion] = useState<Region | null>(null);
    const [connectionLocations, setConnectionLocations] = useState<ConnectionLocation[]>([]);
    const [relationships, setRelationships] = useState<Relationship[]>([]);
    const [reports, setReports] = useState<{ [key: string]: Report }>({});
    const [loading, setLoading] = useState(true);
    const [showHistoricalData, setShowHistoricalData] = useState(false);
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

    const handleConnectionPress = async (uid: number) => {
        try {
            // Fetch the status of the connection
            const response = await fetch('http://54.206.190.121:5000/check_in/get_checkins', {
                method: 'GET',
            });
    
            if (!response.ok) {
                // If response is not OK, print the status and throw an error
                console.error('Failed to fetch connection status:', response.status);
                Alert.alert("Error", "Failed to fetch connection status.");
                return;
            }
    
            const checkinsData = await response.json();
    
            // Find the status for the clicked connection by UID
            const [connectionStatus, updateTime] = checkinsData[uid] || ["Unknown", "Unknown time"];
    
            // Show name, status, and a button to check notifications in the Alert
            Alert.alert(
                "Connection Status",
                `Status: ${connectionStatus} | Update Time: ${updateTime}`,
                [
                    {
                        text: "Check Notifications",
                        onPress: () => navigation.navigate('notifications'),
                    },
                    { text: "OK", onPress: () => {} },
                ]
            );
        } catch (error) {
            console.error("Error fetching connection status:", error);
        }
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
                    showsMyLocationButton={false}
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
                                description={`Reported on: ${report.datetime}`}
                            >
                                <FontAwesome name="exclamation-circle" size={40} color={color} />
                            </Marker>
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

                        // Check if the connection is in a flood area
                        const isInFloodArea = isConnectionInFloodArea(connection);

                        return (
                            <Marker
                                key={index}
                                coordinate={{ latitude: connection.latitude, longitude: connection.longitude }}
                                title={connectionName}
                                onPress={() => handleConnectionPress(connection.uid)}
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
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={handleAddReport} style={styles.iconButton}>
                    <Icon name="report" size={40} color={theme.dark ? "maroon" : "maroon"} />
                </TouchableOpacity>
                {/* Historical Data Icon */}
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="history" size={40} color={showHistoricalData ? "midnightblue" : "midnightblue"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={updateLocationAndFetchConnections} style={styles.iconButton}>
                    <Icon name="refresh" size={40} color={theme.dark ? "green" : "green"} />
                </TouchableOpacity>
            </View>
        </View>
    );
}