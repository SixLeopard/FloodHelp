import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import useStyles from '@/constants/style';

const NewReport = () => {
    const styles = useStyles();
    const [location, setLocation] = useState('');
    const [details, setDetails] = useState('');
    const [contact, setContact] = useState('');

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
                    style={styles.input}
                    placeholder="Location"
                    value={location}
                    onChangeText={setLocation}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Details"
                    value={details}
                    onChangeText={setDetails}
                    multiline
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contact Information"
                    value={contact}
                    onChangeText={setContact}
                />
                <Button title="Submit Report" onPress={handleSubmit} />
            </View>
        </View>
    );
};


export default NewReport;
