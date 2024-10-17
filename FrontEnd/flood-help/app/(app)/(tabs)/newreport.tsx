import React, { useState, useEffect, useCallback } from 'react';
import { Alert, ScrollView, RefreshControl, Text, View, BackHandler } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import useStyles from '@/constants/style';
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import NewReportCard from '@/components/NewReportCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/navigation/types';
import { useAuth } from '@/contexts/AuthContext';

type NewReportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'newreport'>;

/**
 * NewReport component allows users to submit flood reports by selecting a location, adding details,
 * and attaching photos. The component includes features for image picking, location fetching,
 * and submission form validation.
 * 
 * @component
 * @returns {JSX.Element} The New Report screen component.
 */
const NewReport = () => {
    const styles = useStyles();
    const { theme } = useTheme();
    const navigation = useNavigation<NewReportScreenNavigationProp>();
    const { user } = useAuth();

    const [location, setLocation] = useState('Fetching current location...');
    const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);
    const [floodType, setFloodType] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    /**
     * Function to handle refresh action, which re-fetches the current location.
     * 
     * @callback
     */
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchCurrentLocation().then(() => setRefreshing(false));
    }, []);
    
    /**
     * Fetches the current location of the user when the component mounts.
     * 
     * @async
     */
    useEffect(() => {
        fetchCurrentLocation();
    }, []);
    
    /**
     * Fetches the user's current location and reverse geocodes it to an address.
     * 
     * @async
     */
    const fetchCurrentLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission to access location was denied");
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = currentLocation.coords;

            // Save the coordinates to state
            setCoordinates({ latitude, longitude });

            let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (geocode.length > 0) {
                const address = `${geocode[0].streetNumber || ''} ${geocode[0].street || ''}, ${geocode[0].city || ''}`;
                setLocation(address.trim());
            } else {
                setLocation('Unable to determine address');
            }
        } catch (error) {
            console.error("Error fetching current location:", error);
            setLocation('Error fetching location');
        }
    };

    /**
     * Navigates to the map screen where users can select a new location for the report.
     * 
     * @callback
     */
    const handleLocationPress = () => {
        navigation.navigate('mapscreen', {
            onLocationSelected: (address: string, selectedCoordinates: { latitude: number, longitude: number }) => {
                setLocation(address);
                setCoordinates(selectedCoordinates);
            },
        });
    };

    /**
     * Opens the image picker to allow users to select an image from their gallery.
     * 
     * @async
     */
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const fileName = result.assets[0].uri.split('/').pop() ?? '';
            setPhotos([...photos, fileName]);
        }
    };

    /**
     * Opens the camera to allow users to take a photo and attach it to the report.
     * 
     * @async
     */
    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const fileName = result.assets[0].uri.split('/').pop() ?? '';
            setPhotos([...photos, fileName]);
        }
    };

    /**
     * Removes an image from the selected photos array based on its index.
     * 
     * @param {number} index - The index of the photo to remove from the list.
     */
    const removeImage = (index: number) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
    };

    /**
     * Handles the submission of the new report by sending the collected data to the server.
     * 
     * @async
     */
    const handleSubmit = async () => {
        if (!coordinates || !location || location === 'Fetching current location...') {
            Alert.alert('Error', 'Location is required.');
            return;
        }

        if (!user?.token) {
            Alert.alert('Error', 'You must be logged in to submit a report.');
            return;
        }

        try {
            const locationForBackend = `${coordinates.latitude},${coordinates.longitude}`;
            setLoading(true);

            const body = new FormData();
            body.append('location', locationForBackend);
            body.append('type', floodType);
            body.append('title', title);
            body.append('description', description);
            if (photos.length > 0) {
                body.append('image', photos[0]);
            }

            // Submit the form data using a standard fetch call
            const response = await fetch('http://54.206.190.121:5000/reporting/user/add_report', {
                method: 'POST',
                body: body
            });

            if (response.ok) {
                Alert.alert('Success', 'Report submitted successfully!');
                resetForm();
                navigation.navigate('index');
            } else {
                setError('Failed to submit report.');
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            setError('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Resets the form fields to their initial values after submitting a report or cancelling.
     */
    const resetForm = () => {
        setLocation('Fetching current location...');
        setCoordinates(null); // Reset coordinates
        setFloodType('');
        setTitle('');
        setDescription('');
        setPhotos([]);
    };
    
    /**
     * Adds a listener for Android's back button press event.
     * Navigates back to the home screen when the back button is pressed.
     * 
     * @callback
     */
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('index');
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [navigation])
    );

    return (
        <View style={[styles.page]}>
            {/* Fixed Title */}
            <Text style={[styles.headerText, { color: theme.colors.text }]}>New Report</Text>
    
            {/* Scrollable Content */}
            <ScrollView
                contentContainerStyle={{ 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    width: '100%', 
                }}
                style={{ width: '100%' }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={{ width: '90%' }}>
                    <NewReportCard
                        location={location}
                        onLocationPress={handleLocationPress}
                        floodType={floodType}
                        setFloodType={setFloodType}
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        photos={photos}
                        onTakePhoto={takePhoto}
                        onPickImage={pickImage}
                        onRemoveImage={removeImage}
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default NewReport;