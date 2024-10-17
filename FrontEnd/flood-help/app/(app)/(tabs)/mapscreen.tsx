import React, { useState, useEffect } from "react";
import { View, Alert, TouchableOpacity, Text, ActivityIndicator, Image, BackHandler } from "react-native";
import useStyles from "@/constants/style";
import MapView, { Marker, Region, MapPressEvent } from "react-native-maps";
import {mapLightTheme, mapDarkTheme} from "@/constants/Themes"
import { useTheme } from "@/contexts/ThemeContext";
import * as Location from 'expo-location';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MapScreenRouteProp } from "@/components/navigation/types";

// Define the structure of the stack parameters, including mapscreen and newreport
type RootStackParamList = {
    mapscreen: { onLocationSelected: (address: string) => void };
    newreport: { location: string };
};

/**
 * Component that renders a map screen allowing users to select a location, fetch the corresponding address, and confirm the location.
 * 
 * @component
 * @returns {JSX.Element} The map screen component where users can select and confirm a location.
 */
export default function MapScreen() {
    const styles = useStyles(); // Custom styles from the project
    const { theme } = useTheme(); // Access the current theme (light/dark mode)
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>(); // Navigation hook
    const route = useRoute<MapScreenRouteProp>(); // Access the route params
    const [region, setRegion] = useState<Region | null>(null); // Stores the map region (latitude, longitude, etc.)
    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null); // Stores the selected map coordinates
    const [loading, setLoading] = useState<boolean>(false); // Manages loading state
    const [address, setAddress] = useState<string>(''); 

    useEffect(() => {
        /**
         * Request location permission and fetch the user's current location.
         * 
         * @async
         */
        const requestLocationPermission = async () => {
            try {
                // Request foreground location permission
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert("Permission to access location was denied");
                    return;
                }

                // Get the current location if permission is granted
                let location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;

                // Set the map region to center on the user's location
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

        /**
         * Handle Android back button press.
         * Navigates to the 'newreport' screen, passing the selected location or a default location if none is selected.
         * 
         * @returns {boolean} True to prevent the default back action.
         */
        const handleBackPress = () => {
            // If location is selected, navigate to 'newreport' and pass the location parameter
            if (selectedLocation && address) {
                navigation.navigate('newreport', { location: address });
            } else {
                navigation.navigate('newreport', { location: 'Unknown Location' });
            }
            return true; // Prevent the default back action
        };

        requestLocationPermission(); // Call the location permission function when the component mounts

        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Cleanup function to remove back button listener on unmount
        return () => backHandler.remove();
    }, [selectedLocation, address]);

    /**
     * Handles when a user taps on the map to select a location.
     * Updates the selected location with the latitude and longitude of the tapped point.
     * 
     * @param {MapPressEvent} event - The map press event that contains the coordinates of the selected location.
     */
    const handleMapPress = (event: MapPressEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude }); // Set the selected location's coordinates
    };

    /**
     * Handles the confirmation of the selected location.
     * Fetches the address of the selected location and navigates to the 'newreport' screen with the selected address.
     * 
     * @async
     */
    const handleConfirmLocation = async () => {
        if (selectedLocation) {
            setLoading(true);
            // Fetch the address based on the selected latitude and longitude
            const address = await fetchAddress(selectedLocation.latitude, selectedLocation.longitude);
            const onLocationSelected = route.params?.onLocationSelected; // Retrieve the callback from route params

            if (onLocationSelected) {
                // Call the passed function to handle the selected address and coordinates
                onLocationSelected(address, selectedLocation);
            }
            setLoading(false);
            // Navigate to the newreport screen, passing the address as a parameter
            navigation.navigate('newreport', { location: address });
        } else {
            // Alert if no location is selected
            Alert.alert('No location selected', 'Please select a location on the map.');
        }
    };

    /**
     * Fetches the address for the given latitude and longitude using reverse geocoding.
     * 
     * @param {number} latitude - The latitude of the selected location.
     * @param {number} longitude - The longitude of the selected location.
     * @returns {Promise<string>} The fetched address or an error message if the address could not be determined.
     * @async
     */
    const fetchAddress = async (latitude: number, longitude: number) => {
        try {
            // Use expo-location's reverse geocode API to fetch the address
            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (geocode.length > 0) {
                return `${geocode[0].streetNumber || ''} ${geocode[0].street || ''}, ${geocode[0].city || ''}`.trim();
            } else {
                return 'Unable to determine address'; // Fallback if no address is found
            }
        } catch (error: unknown) {
            // Handle errors and timeouts
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
                // MapView showing the map with the user's location and selected location
                <MapView
                    style={styles.map}
                    customMapStyle={theme.dark ? mapDarkTheme : mapLightTheme} // Apply custom map style based on the theme
                    initialRegion={region}
                    onPress={handleMapPress} // Handle user taps on the map
                    showsUserLocation={true} // Show the user's current location on the map
                    showsMyLocationButton={true} 
                >
                    {selectedLocation && (
                        // Marker for the selected location
                        <Marker
                            coordinate={selectedLocation}
                            title="Report Location"
                            pinColor={theme.colors.primary} // Set pin color based on the theme
                        />
                    )}
                </MapView>
            ) : (
                // Loading indicator while the map is loading the region
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text>Loading Map...</Text>
                </View>
            )}

            {/* Confirm Location button */}
            <TouchableOpacity 
                onPress={handleConfirmLocation} // Calls the confirm location function when pressed
                style={styles.confirmButtonContainer} 
                disabled={loading} // Disable the button while loading
            >
                <View style={styles.confirmButton}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" /> // Show loading spinner when fetching address
                    ) : (
                        <Text style={styles.confirmButtonText}>Confirm Location</Text> // Button text
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
}