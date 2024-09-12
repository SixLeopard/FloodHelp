import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import useStyles from '@/constants/style'; // Importing the styles
import { router } from 'expo-router'; // Import router from expo-router


const SignInScreen = () => {
    const styles = useStyles();

    // State to hold email and password inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.page}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('@/assets/images/Logo.png')}  // Ensure logo path is correct
                    style={styles.logoImage} // Logo styling from useStyles
                    
                />
            </View>

            {/* Input Fields */}
            <View style={styles.formContainerSignInPage}>
                {/* Email Input */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.inputBoxSignInPage}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="floodhelp@example.com"
                    placeholderTextColor="#ccc"
                    keyboardType="email-address"
                />

                {/* Password Input */}
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.inputBoxSignInPage}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#ccc"
                    secureTextEntry={true}
                />

                {/* Sign In Button */}
                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={() => {
                        router.replace('/(tabs)');// Handle sign-in logic here
                    }}
                >
                    <Text style={styles.signInButtonText}>Sign In</Text>
                </TouchableOpacity>

                {/* Register and Forgot Password Links */}
                <View style={styles.linkContainer}>
                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text style={styles.linkText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('Forgot Password pressed')}>
                        <Text style={styles.linkText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default SignInScreen;
