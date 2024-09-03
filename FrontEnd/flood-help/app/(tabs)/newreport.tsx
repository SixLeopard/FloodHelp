import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert, Image, StyleSheet, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import useStyles from '@/constants/style';
import FH_Button from "@/components/navigation/FH_Button";
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const NewReport = () => {
    const styles = useStyles();
    const navigation = useNavigation();
    const [location, setLocation] = useState('Fetching current location...');
    const [floodType, setFloodType] = useState('');
    const [description, setDescription] = useState('');
    const [photos, setPhotos] = useState<string[]>([]);

    useEffect(() => {
        fetchCurrentLocation();
    }, []);

    const fetchCurrentLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission to access location was denied");
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = currentLocation.coords;

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

    const handleLocationPress = () => {
        navigation.navigate('mapscreen', {
            onLocationSelected: (address: string) => {
                setLocation(address);
            },
        });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const fileName = result.assets[0].uri.split('/').pop();
            setPhotos([...photos, fileName]);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const fileName = result.assets[0].uri.split('/').pop();
            setPhotos([...photos, fileName]);
        }
    };

    const removeImage = (index) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
    };

    const handleSubmit = async () => {
        if (!location || location === 'Fetching current location...') {
            Alert.alert('Error', 'Location is required.');
            return;
        }

        try {
            //const sessionID = await AsyncStorage.getItem('session_id');
            //const username = await AsyncStorage.getItem('username');

            // Mocked session data
            const mockSession = {
                username: 'john',
                id: '3'
            };

            // Prepare form data
            const formData = new FormData();
            formData.append('location', location);
            formData.append('type', floodType);
            formData.append('description', description || '');

            // Send the report to the Flask backend
            const response = await fetch('http://54.206.190.121:5000/reporting/user/add_report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Session-Username': mockSession.username, //username
                    'Session-ID': mockSession.id, //sessionID
                },
                body: new URLSearchParams(formData).toString()
            });

            const result = await response.json();

            // Debugging: Log the result
            console.log(result);

            if (result.invalid_account) {
                Alert.alert('Error', 'Invalid account.');
            } else if (result.invalid_request) {
                Alert.alert('Error', 'Invalid request.');
            } else {
                // Debugging: Log success message
                console.log('Report submitted successfully!');

                Alert.alert('Success', 'Report submitted successfully!');
                
                // Clear form
                setLocation('Fetching current location...');
                setFloodType('');
                setDescription('');
                setPhotos([]);
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            Alert.alert('Error', 'Failed to submit report.');
        }
    };



    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>New Report</Text>
            <View style={styles.formContainer}>
                <TouchableOpacity onPress={handleLocationPress} style={styles.locationContainer}>
                    <Text style={styles.bodyTextBold}>Location</Text>
                    <Text style={styles.locationText}>{location}</Text>
                </TouchableOpacity>

                <View style={styles.pickerContainer}>
                    <Text style={styles.bodyTextBold}>Flood Type</Text>
                    <Picker
                        selectedValue={floodType}
                        onValueChange={(itemValue) => setFloodType(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Please select a flood type" value="" />
                        <Picker.Item label="Major Flood" value="Major Flood" />
                        <Picker.Item label="Moderate Flood" value="Moderate Flood" />
                        <Picker.Item label="Minor Flood" value="Minor Flood" />
                        <Picker.Item label="No Flood" value="No Flood" />
                    </Picker>
                </View>

                {/* Temp Description Input, subject to change */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.bodyTextBold}>Description</Text>
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="Enter a description"
                        multiline
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <View style={styles.imageContainer}>
                    {photos.map((photo, index) => (
                        <View key={index} style={styles.imagePreviewContainer}>
                            <Text style={styles.imageText}>{photo}</Text>
                            <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeImageButton}>
                                <Text style={styles.removeImageText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={styles.imageButtonContainer}>
                    <TouchableOpacity onPress={takePhoto} style={styles.imageButton}>
                        <Text style={styles.imageButtonText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                        <Text style={styles.imageButtonText}>Upload Image</Text>
                    </TouchableOpacity>
                </View>

                <FH_Button text="Submit Report" onPress={handleSubmit} route='/(tabs)/index'/>
            </View>
        </View>
    );
};


export default NewReport;