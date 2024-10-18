import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import useStyles from '@/constants/style';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { baseURL } from '@/constants/baseurl';


const baseUrl = baseURL

const RegisterScreen = () => {
    const styles = useStyles();
    const { signIn } = useAuth();

    // State variables for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');  // New state for password confirmation
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Function to handle account creation
    const handleCreateAccount = async () => {
        setError('');
        setSuccess('');

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const formdata = new FormData();
        formdata.append('name', name);
        formdata.append('email', email);
        formdata.append('password', password);

        const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
        };

        try {
            const response = await fetch(`${baseUrl}/accounts/create`, requestOptions);
            const result = await response.json(); // Parse the JSON response
            console.log(result.message);
            if (response.ok) {
                // Handle successful account creation
                setSuccess('Account created successfully');

                // Try to log in the user automatically after creating the account
                try {
                    let resultSignIn = await signIn({ username: email, password });
                    console.log(resultSignIn)
                    router.replace('/(tabs)');
                } catch (err) {
                    setError('Invalid credentials');
                }

            } else {
                throw new Error(result.message || 'Failed to create account');
            }
        } catch (error) {
            // Handle errors
            setError(error.message || 'Failed to create account');
            console.log(error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.page}>
                    {/* Logo Section */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('@/assets/images/Logo2.png')}
                            style={styles.logoImage}
                        />
                    </View>

                    {/* Form container specific to Register page */}
                    <View style={styles.registerFormContainer}>
                        {/* Success and Error Messages */}
                        {error && <Text style={{ color: 'red' }}>{error}</Text>}
                        {success && <Text style={{ color: 'green' }}>{success}</Text>}

                        {/* Name Input */}
                        <Text style={styles.registerLabel}>Name</Text>
                        <TextInput
                            style={styles.registerInputBox}
                            value={name}
                            onChangeText={setName}
                            placeholder="Flood Help"
                            placeholderTextColor="#ccc"
                        />

                        {/* Email Input */}
                        <Text style={styles.registerLabel}>Email</Text>
                        <TextInput
                            style={styles.registerInputBox}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="floodhelp@example.com"
                            placeholderTextColor="#ccc"
                            keyboardType="email-address"
                        />

                        {/* Password Input */}
                        <Text style={styles.registerLabel}>Password</Text>
                        <TextInput
                            style={styles.registerInputBox}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            placeholderTextColor="#ccc"
                            secureTextEntry={true}
                        />

                        {/* Confirm Password Input */}
                        <Text style={styles.registerLabel}>Confirm Password</Text>
                        <TextInput
                            style={styles.registerInputBox}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm Password"
                            placeholderTextColor="#ccc"
                            secureTextEntry={true}  // Secure entry for confirmation
                        />

                        {/* Terms and Conditions */}
                        <View style={styles.termsContainer}>
                            <Checkbox
                                value={agreedToTerms}
                                onValueChange={setAgreedToTerms}
                                color={agreedToTerms ? "#4630EB" : undefined}
                                style={styles.checkbox}
                            />
                            <Text style={styles.termsText}>
                                By signing up to the application, you agree to our Terms and privacy policy
                            </Text>
                        </View>

                        {/* Register Button */}
                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={handleCreateAccount}
                            disabled={!agreedToTerms} // Disable button if terms not agreed
                        >
                            <Text style={styles.registerButtonText}>Register</Text>
                        </TouchableOpacity>

                        {/* Link to Sign In */}
                        <View style={styles.linkContainer}>
                            <TouchableOpacity onPress={() => router.push('/LoginScreen')}>
                                <Text style={styles.linkTextBoldRegister}>Have an account? Sign in instead</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Terms and privacy policy link */}
                        <TouchableOpacity onPress={() => console.log('Terms & privacy policy')}>
                            <Text style={styles.termsLinkTextRegister}>Terms & privacy policy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;
