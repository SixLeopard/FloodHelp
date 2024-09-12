import React, { useState, useEffect } from "react";
import { View, Alert, Image, TouchableOpacity } from "react-native";
import useStyles from "@/constants/style";
import MapView, { Marker, Region } from "react-native-maps";
import { mapLightTheme } from "@/constants/mapLightTheme";
import { mapDarkTheme } from "@/constants/mapDarkTheme";
import { useTheme } from "@/constants/ThemeProvider";
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';

type RootStackParamList = {
    newreport: undefined; 
};

// Simulated Flood Data
const simulatedFloodData = [
    {
        location_name: 'Flood 1',
        Coordinates: { latitude: -27.5782, longitude: 153.09387 },
        Flood_Category: 'Major Flood',
    },
];

export default function Index() {
    const styles = useStyles();
    const { theme } = useTheme();
    const [region, setRegion] = useState<Region | null>(null);
    const [markerSize, setMarkerSize] = useState({ width: 30, height: 30 });
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
        Alert.alert("Historical Flooding", "This will show historical flooding areas.");
    };

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

                    {/* Render Simulated Flood Data */}
                    {simulatedFloodData.map((floodData, index) => (
                        <Marker 
                            key={index}
                            coordinate={floodData.Coordinates}
                            title={floodData.location_name}
                            description={`Flood Category: ${floodData.Flood_Category}`}
                        >
                            <FontAwesome name="exclamation-triangle" size={40} color="maroon" />
                        </Marker>
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
        </View>
    );
}


