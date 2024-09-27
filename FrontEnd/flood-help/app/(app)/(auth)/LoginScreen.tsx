import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import useStyles from '@/constants/style'; // Importing the styles
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router'; // Import router from expo-router

const LoginScreen = () => {
    const styles = useStyles();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await signIn({ email, password });
            // Handle successful login, redirect to home screen
            router.replace('/(tabs)');
        } catch (err) {
            setError('Invalid credentials');
        }
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
                    autoCapitalize="none"
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

                {/* Error Display */}
                {error && <Text style={styles.errorText}>{error}</Text>} 

                {/* Login Button */}
                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.signInButtonText}>Login</Text>
                </TouchableOpacity>

                {/* Register and Forgot Password Links */}
                <View style={styles.linkContainer}>
                    <TouchableOpacity onPress={() => router.push('/(auth)/CreateAccountScreen')}>
                        <Text style={styles.linkText}>Register New Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('(auth)/ForgotPasswordScreen')}>
                        <Text style={styles.linkText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LoginScreen;

