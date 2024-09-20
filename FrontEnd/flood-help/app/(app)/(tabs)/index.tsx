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
import GetAPI from '@/hooks/GetAPI';

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
    const [historicalFloodData, setHistoricalFloodData] = useState<HistoricalFloodData | null>(null);
    const [loadingHistorical, setLoadingHistorical] = useState(false);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { user, loading } = useAuth();

    const reports = GetAPI('/reporting/user/get_all_report_basic');

    console.log('Reports:', reports);

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

    const handleAddReport = () => {
        navigation.navigate('newreport');
    };

    const handleSeeHistoricalFlooding = () => {
        if (historicalFloodData) {
            setHistoricalFloodData(null);
        } else {
            fetchHistoricalFloodData();
        }
    };

    if (loading || !reports) {
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
                        if (!report.coordinates) {
                            console.warn(`Skipping report ${report.title} due to missing coordinates.`);
                            return null;
                        }

                        const [latitudeStr, longitudeStr] = report.coordinates.replace(/[()]/g, '').split(',');
                        const latitude = parseFloat(latitudeStr);
                        const longitude = parseFloat(longitudeStr);

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