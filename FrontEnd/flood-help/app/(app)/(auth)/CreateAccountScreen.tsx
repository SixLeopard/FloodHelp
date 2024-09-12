import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import {router} from "expo-router";
import {useAuth} from "@/contexts/AuthContext";

const baseUrl = 'http://54.206.190.121:5000';

const CreateAccountScreen = ( ) => {
    const { signIn } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('')
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCreateAccount = async () => {
        setError(''); // Clear previous errors
        setSuccess(''); // Clear previous success message

        const formdata = new FormData();
        formdata.append('username', username);
        formdata.append('password', password);
        formdata.append('name', name);

        const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow', // Optional: handle redirects
        };

        try {
            const response = await fetch(`${baseUrl}/accounts/create`, requestOptions);
            console.log(response);
            const result = await response.json(); // Parse the JSON response
            if (response.ok) {
                // Handle successful account creation
                setSuccess('Account created successfully');
                // try {
                //     console.log("si")
                //     await signIn({ username, password });
                //     router.push('/(auth)/LoginScreen')
                // } catch (err) {
                //     setError('Invalid credentials');
                // }

            } else {
                throw new Error(result.message || 'Failed to create account');
            }
        } catch (error) {
            // Handle errors
            setError(error.message || 'Failed to create account');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text>Create Account</Text>
            <Text></Text>
            <Text></Text>
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            {success && <Text style={{ color: 'green' }}>{success}</Text>}
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
            /><TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Create Account" onPress={handleCreateAccount} />
<Text></Text>
            <Button title="Back to Login Page" onPress={() => router.push('/(auth)/LoginScreen')} />
        </View>
    );
};

export default CreateAccountScreen;
