import React, { useState } from 'react';
import {Text, View, TextInput, Button, StyleSheet, Alert, Animated} from 'react-native';
import useStyles from '@/constants/style';
import FH_Button from "@/components/navigation/FH_Button";

const NewReport = () => {
    const styles = useStyles();
    const [location, setLocation] = useState('');
    const [description, setDetails] = useState('');
    const [photos, setPhotos] = useState([]);

    const handleSubmit = () => {
        if (!location || !details || !contact) {
            Alert.alert('Error', 'Please fill out all fields');
            return;
        }

        // Handle form submission logic here
        Alert.alert('Success', 'Report submitted successfully!');
    };


    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>New Report</Text>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.inputBox}
                    placeholder="Location"
                    value={location}
                    onChangeText={setLocation}
                />
                <TextInput
                    style={styles.inputBox}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDetails}
                    multiline
                />

<Text>**TOO: Add Images Feature**</Text>


                <FH_Button text="Submit Report" route='/(tabs)/profile' />
            </View>
        </View>
    );
};


export default NewReport;
