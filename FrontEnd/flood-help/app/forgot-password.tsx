import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import useStyles from '@/constants/style'; // Importing the styles
import { router } from 'expo-router'; // Import router from expo-router

const ForgotPasswordScreen = () => {
    const styles = useStyles();
    const [email, setEmail] = useState('');

    return (
        <View style={styles.page}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('@/assets/images/Logo2.png')} 
                    style={styles.logoImage} 
                />
            </View>
        </View>
    );
};

export default ForgotPasswordScreen;
