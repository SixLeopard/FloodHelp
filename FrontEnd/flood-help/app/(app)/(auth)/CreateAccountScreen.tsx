import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import useStyles from '@/constants/style';
import { router } from 'expo-router'; 
import { useAuth } from '@/contexts/AuthContext'; 

const baseUrl = 'http://54.206.190.121:5000'; // API endpoint

const RegisterScreen = () => {
    const styles = useStyles(); 
    const { signIn } = useAuth();

    // State variables for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Function to handle account creation
    const handleCreateAccount = async () => {
        setError(''); // Clear previous errors
        setSuccess(''); // Clear previous success message

        const formdata = new FormData();
        formdata.append('username', email); // Use email as the username
        formdata.append('password', password);
        formdata.append('name', name);

        const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
        };

        try {
            const response = await fetch(`${baseUrl}/accounts/create`, requestOptions);
            const result = await response.json(); // Parse the JSON response
            if (response.ok) {
                // Handle successful account creation
                setSuccess('Account created successfully');

                // Try to log in the user automatically after creating the account
                try {
                    await signIn({ username: email, password });
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
    );
};

export default RegisterScreen;

