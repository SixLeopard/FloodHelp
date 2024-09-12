import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Checkbox } from 'expo-checkbox'; // Correct import for expo-checkbox
import useStyles from '@/constants/style'; // Import the styles from your style file
import { router } from 'expo-router'; // Import router from expo-router


const RegisterScreen = () => {
    const styles = useStyles(); // Accessing styles from the useStyles hook

    // State variables for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    return (
        <View style={styles.page}>
            {/* Form container specific to Register page */}
            <View style={styles.registerFormContainer}>
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

                {/* Phone Input */}
                <Text style={styles.registerLabel}>Phone</Text>
                <TextInput
                    style={styles.registerInputBox}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="04xx xxx xxx"
                    placeholderTextColor="#ccc"
                    keyboardType="phone-pad"
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
                        color={agreedToTerms ? "#4630EB" : undefined} // Use color for checked state
                        style={styles.checkbox}
                    />
                    <Text style={styles.termsText}>
                        By signing up to the application, you agree to our Terms and privacy policy
                    </Text>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => {
                        // Handle registration logic here
                    }}
                    disabled={!agreedToTerms} // Disable button if terms not agreed
                >
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>

                {/* Link to Sign In */}
                <View style={styles.linkContainer}>
                    <TouchableOpacity onPress={() => router.replace('/sign-in')}>
                        <Text style={styles.linkTextBoldRegister}>Have an account? Sign in instead </Text>
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
