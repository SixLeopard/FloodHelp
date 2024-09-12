import React, { useState, useEffect } from "react";
import { View, Alert, TouchableOpacity, Text, ActivityIndicator, Image } from "react-native";
import useStyles from "@/constants/style";
import MapView, { Marker, Region, MapPressEvent } from "react-native-maps";
import {mapLightTheme, mapDarkTheme} from "@/constants/Themes"
import { useTheme } from "@/contexts/ThemeContext";
import * as Location from 'expo-location';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MapScreenRouteProp } from "@/components/navigation/types";

type RootStackParamList = {
    mapscreen: { onLocationSelected: (address: string) => void };
    newreport: { location: string };
};

export default function MapScreen() {
    const styles = useStyles();
    const { theme } = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<MapScreenRouteProp>();
    const [region, setRegion] = useState<Region | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        
        const requestLocationPermission = async () => {
            try {
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
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            } catch (error) {
                console.error("Error fetching user location:", error);
                Alert.alert("Error", "Unable to fetch current location.");
            }
        };

        requestLocationPermission();
    }, []);

    const handleMapPress = (event: MapPressEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    const handleConfirmLocation = async () => {
        if (selectedLocation) {
            setLoading(true);
            const address = await fetchAddress(selectedLocation.latitude, selectedLocation.longitude);
            const onLocationSelected = route.params?.onLocationSelected;
            if (onLocationSelected) {
                onLocationSelected(address);
            }
            setLoading(false);
            navigation.navigate('newreport', { location: address }); 
        } else {
            Alert.alert('No location selected', 'Please select a location on the map.');
        }
    };

    const fetchAddress = async (latitude: number, longitude: number) => {
        try {
            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (geocode.length > 0) {
                return `${geocode[0].streetNumber || ''} ${geocode[0].street || ''}, ${geocode[0].city || ''}`.trim();
            } else {
                return 'Unable to determine address';
            }
        } catch (error: unknown) {
            // Fix for 'error is of type unknown'
            if (error instanceof Error) {
                if (error.message.includes('TimeoutException')) {
                    Alert.alert('Error', 'Location lookup timed out. Please try again or enter the address manually.');
                } else {
                    Alert.alert('Error', 'Failed to fetch address. Please try again.');
                }
            }
            return 'Error determining address';
        }
    };

    return (
        <View style={styles.container}>
            {region ? (
                <MapView
                    style={styles.map}
                    customMapStyle={theme.dark ? mapDarkTheme : mapLightTheme}
                    initialRegion={region}
                    onPress={handleMapPress}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                >
                    {selectedLocation && (
                        <Marker
                            coordinate={selectedLocation}
                            title="Report Location"
                            pinColor={theme.colors.primary}
                        />
                    )}
                </MapView>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text>Loading Map...</Text>
                </View>
            )}

            <TouchableOpacity 
                onPress={handleConfirmLocation} 
                style={styles.confirmButtonContainer} 
                disabled={loading}
            >
                <View style={styles.confirmButton}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.confirmButtonText}>Confirm Location</Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
}


