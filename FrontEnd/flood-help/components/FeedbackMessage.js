import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


/**
 * Simple Formatter for error messages when they're displayed on the front end.
 * @param message
 * @returns {React.JSX.Element|null}
 * @constructor
 */
const FeedbackMessage = ({ message }) => {
    if (!message) return null;

    const { type, content } = message;

    return (
        <View style={[styles.container, type === 'error' ? styles.error : styles.success]}>
            <Text style={styles.text}>{content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
    },
    success: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
    },
    error: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
    },
});

export default FeedbackMessage;
