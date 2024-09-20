import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import useStyles from '@/constants/style';
import { useTheme } from "@/contexts/ThemeContext";
import FH_Button from "@/components/navigation/FH_Button";
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/navigation/types';
import { useAuth } from '@/contexts/AuthContext';
import GetAPI from '@/hooks/GetAPI';

type NewReportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'newreport'>;

const NewReport = () => {
    const styles = useStyles();
    const { theme } = useTheme();
    const navigation = useNavigation<NewReportScreenNavigationProp>();
    const { user } = useAuth(); 
    const [location, setLocation] = useState('Fetching current location...');
    const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);
    const [floodType, setFloodType] = useState('');
    const [description, setDescription] = useState('');
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCurrentLocation(); // Fetch location when the component loads
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
            const fileName = result.assets[0].uri.split('/').pop() ?? '';
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
            const fileName = result.assets[0].uri.split('/').pop() ?? '';
            setPhotos([...photos, fileName]);
        }
    };

    const removeImage = (index: number) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
    };

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

    const resetForm = () => {
        setLocation('Fetching current location...');
        setCoordinates(null); // Reset coordinates
        setFloodType('');
        setDescription('');
        setPhotos([]);
    };

    return (
        <View style={[styles.page]}>
            <Text style={[styles.headerText, { color: theme.colors.text }]}>New Report</Text>
            <View style={styles.formContainer}>
                <TouchableOpacity onPress={handleLocationPress} style={styles.locationContainer}>
                    <Text style={[styles.bodyTextBold]}>Location</Text>
                    <Text style={[styles.bodyTextBold]}>
                        {location}
                    </Text>
                </TouchableOpacity>

                <View style={styles.pickerContainer}>
                    <Text style={[styles.bodyTextBold]}>Flood Type</Text>
                    <Picker
                        selectedValue={floodType}
                        onValueChange={(itemValue) => setFloodType(itemValue)}
                        style={[styles.picker]}
                    >
                        <Picker.Item label="Please select a flood type" value="" />
                        <Picker.Item label="Major Flood" value="Major Flood" />
                        <Picker.Item label="Moderate Flood" value="Moderate Flood" />
                        <Picker.Item label="Minor Flood" value="Minor Flood" />
                        <Picker.Item label="No Flood" value="No Flood" />
                    </Picker>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={[styles.bodyTextBold]}>Description</Text>
                    <View style={[styles.descriptionInput]}>
                        <TextInput
                            style={[styles.bodyTextBold]}
                            placeholder="Enter a description"
                            multiline
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>
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
                        <Text style={[styles.imageButtonText]}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                        <Text style={[styles.imageButtonText]}>Upload Image</Text>
                    </TouchableOpacity>
                </View>

                <FH_Button text="Submit Report" onPress={handleSubmit} route='/(tabs)/index' disabled={loading} />
                {loading && <Text>Submitting...</Text>}
                {error && <Text>Error: {error}</Text>}
            </View>
        </View>
    );
};

export default NewReport;
