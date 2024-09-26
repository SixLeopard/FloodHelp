import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import useStyles from '@/constants/style'; // Import your styles
import { router } from 'expo-router'; // Import the router

const ForgotPasswordScreen = () => {
    const styles = useStyles(); // Access styles using useStyles
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(''); // State for displaying messages

    // Handle Reset Password Logic
    const handleResetPassword = () => {
        if (!email) {
            setMessage('Please enter your email.');
            return;
        }
        
        // Display a success message indicating the action
        setMessage('A reset link will be sent to your email once the functionality is implemented.');
    };

    return (
        <View style={styles.page}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('@/assets/images/Logo2.png')} 
                    style={styles.logoImage} 
                />
            </View>

            {/* Forgot Password Form */}
            <View style={styles.formContainerForgotPassword}>
                <Text style={styles.headerText}>Forgot Password</Text>

                {/* Message Display */}
                {message && <Text style={{ color: 'green', marginBottom: 15 }}>{message}</Text>}

                {/* Email Input */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.inputBoxSignInPage}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="floodhelp@example.com"
                    placeholderTextColor="#ccc"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* Button Container */}
                <View style={styles.buttonContainer}>
                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.replace('/LoginScreen')}
                    >
                        <Text style={styles.registerButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    {/* Reset Button */}
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={handleResetPassword}
                    >
                        <Text style={styles.registerButtonText}>Reset Password</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ForgotPasswordScreen;
