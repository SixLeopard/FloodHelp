import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import {router} from "expo-router";

export default function LoginScreen() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        console.log("login button presed")
        try {
            console.log("try block")
            await signIn({ email, password });
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <View>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>

            <Text>Login</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error && <Text>{error}</Text>}
            <Button title="Login" onPress={handleLogin} />

            <Text></Text>
            <Text></Text>

            <Button title="Register New Account" onPress={() => router.push('/(auth)/CreateAccountScreen')} />

        </View>
    );
}
