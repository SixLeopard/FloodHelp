import React, { useState, useEffect } from "react";
import { View, Alert, TouchableOpacity, ActivityIndicator, Text } from "react-native";
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
};

interface Report {
    datetime: string;
    title: string;
    coordinates: string;
}

export default function Index() {
    const styles = useStyles();
    const { theme } = useTheme();
    const [region, setRegion] = useState<Region | null>(null);
    const [floodReports, setFloodReports] = useState<Report[]>([]);
    const [loadingReports, setLoadingReports] = useState(true); // To track if flood reports are being loaded
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
            // Debugging console.log('Raw data from API:', data); 

            // Correcting the format of the string to valid JSON
            let reportsString = data.reports;

            // Replace single quotes with double quotes
            reportsString = reportsString.replace(/'/g, '"');

            // Replace Python's datetime.datetime with plain strings (removing `datetime.datetime`)
            reportsString = reportsString.replace(
                /datetime\.datetime\((\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*\d+\)/g,
                '"$1-$2-$3T$4:$5:$6Z"'
            );

            // Wrap the corrected string into an array and parse it
            const reports = JSON.parse(`[${reportsString}]`);
            return reports;
        } catch (error) {
            console.error('Error fetching flood reports:', error);
            return [];
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
        Alert.alert("Historical Flooding", "This will show historical flooding areas.");
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
        </View>
    );
}


