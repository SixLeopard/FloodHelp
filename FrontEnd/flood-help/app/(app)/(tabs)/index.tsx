import React, { useState, useEffect } from "react";
import { View, Alert, TouchableOpacity, ActivityIndicator, Text } from "react-native";
import useStyles from "@/constants/style";
import MapView, { Polygon, Marker, Region } from "react-native-maps";
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
};

interface Report {
    datetime: string;
    title: string;
    coordinates: string;
}

interface HistoricalFloodData {
    features: Array<{
        attributes: {
            OBJECTID: number;
            FLOOD_RISK: string;
            FLOOD_TYPE: string;
        };
        geometry: {
            rings: number[][][];
        };
    }>;
}

export default function Index() {
    const styles = useStyles();
    const { theme } = useTheme();
    const [region, setRegion] = useState<Region | null>(null);
    const [floodReports, setFloodReports] = useState<Report[]>([]);
    const [loadingReports, setLoadingReports] = useState(true);
    const [historicalFloodData, setHistoricalFloodData] = useState<HistoricalFloodData | null>(null);
    const [loadingHistorical, setLoadingHistorical] = useState(false); 
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { user, loading } = useAuth(); // Tracking user authentication status

    const fetchFloodReports = async () => {
        if (!user?.token) {
            console.error("User is not authenticated");
            return [];
        }

        try {
            const response = await fetch('http://54.206.190.121:5000/reporting/user/get_all_report_basic', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Id': user.token,
                    'Session-Username': user.username,
                },
            });

            const data = await response.json();
            //console.log('Raw data from API:', data); 

            const reports = Object.keys(data).map(key => ({
                title: data[key].title,
                datetime: data[key].datetime,
                coordinates: data[key].coordinates
            }));

            return reports;
        } catch (error) {
            console.error('Error fetching flood reports:', error);
            return [];
        }
    };

    const fetchHistoricalFloodData = async () => {
        setLoadingHistorical(true);
        try {
            const response = await fetch(
                'https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services/Flood_Awareness_Flood_Risk_Overall/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
            );
            const data: HistoricalFloodData = await response.json();
            setHistoricalFloodData(data);
        } catch (error) {
            console.error('Error fetching historical flood data:', error);
        } finally {
            setLoadingHistorical(false);
        }
    };
    

    useEffect(() => {
        const requestLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission to access location was denied");
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
        };

        requestLocationPermission();
    }, []);

    // Fetch flood reports after authentication and location permission
    useEffect(() => {
        const loadFloodReports = async () => {
            if (loading || !user) return; // Wait until authentication is resolved
            setLoadingReports(true); // Start loading reports
            const reports = await fetchFloodReports();
            setFloodReports(reports);
            setLoadingReports(false); // Done loading reports
        };

        loadFloodReports();
    }, [loading, user]);

    const handleAddReport = () => {
        navigation.navigate('newreport');
    };

    const handleSeeHistoricalFlooding = () => {
        if (historicalFloodData) {
            // If historical data is already loaded, remove it
            setHistoricalFloodData(null);
        } else {
            // If no data is loaded, fetch it
            fetchHistoricalFloodData();
        }
    };

    if (loading || loadingReports) {
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
                    {floodReports.map((report, index) => {
                        // Check if coordinates are missing or invalid
                        if (!report.coordinates) {
                            console.warn(`Skipping report ${report.title} due to missing coordinates.`);
                            return null;
                        }

                        const [latitudeStr, longitudeStr] = report.coordinates.replace(/[()]/g, '').split(',');
                        const latitude = parseFloat(latitudeStr);
                        const longitude = parseFloat(longitudeStr);

                        // Skip if coordinates are not valid numbers
                        if (isNaN(latitude) || isNaN(longitude)) {
                            console.warn(`Skipping report ${report.title} due to invalid coordinates: ${report.coordinates}`);
                            return null;
                        }

                        return (
                            <Marker
                                key={index}
                                coordinate={{ latitude, longitude }}
                                title={report.title}
                                description={`Reported on: ${report.datetime}`}
                            >
                                <FontAwesome name="exclamation-triangle" size={40} color="maroon" />
                            </Marker>
                        );
                    })}

                    {/* Render Historical Flood Polygons */}
                {historicalFloodData?.features.map((feature, index) => (
                    <Polygon
                        key={index}
                        coordinates={feature.geometry.rings[0].map(([longitude, latitude]) => ({
                            latitude,
                            longitude,
                        }))}
                        strokeColor="rgba(128,0,0,0.5)"
                        fillColor="rgba(128,0,0,0.3)"
                    />
                ))}
                </MapView>
            )}

            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={handleAddReport} style={styles.iconButton}>
                    <Icon name="report" size={40} color={theme.dark ? "maroon" : "maroon"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSeeHistoricalFlooding} style={styles.iconButton}>
                    <Icon name="history" size={40} color={theme.dark ? "midnightblue" : "midnightblue"} />
                </TouchableOpacity>
            </View>

            {loadingHistorical && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text>Loading Historical Flood Data...</Text>
                </View>
            )}
        </View>
    );
}

