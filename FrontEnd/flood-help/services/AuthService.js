import * as SecureStore from 'expo-secure-store';
import {router} from "expo-router";

const baseUrl = 'http://54.206.190.121:5000'; // Make sure this URL is correct

// Function to login by making a POST request to the backend
export const login = async ({ email, password }) => {
    try {
        const formData = new FormData();
        formData.append('username', email); // Ensure this matches the backend expected field
        formData.append('password', password);

        const requestOptions = {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data', // Include this header for FormData
            },
        };

        const response = await fetch(`${baseUrl}/accounts/login`, requestOptions);
        console.log(response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response

        // Check if the login was successful
        if (data.Login === 'True' && data.sessionid) {
            // Save the session ID securely
            await SecureStore.setItemAsync('sessionid', data.sessionid);
            router.push('/(tabs)');
            return data.sessionid;
        } else {
            throw new Error('Invalid login response');
        }
    } catch (error) {
        // Handle any errors (network errors, API errors, etc.)
        console.error('Login failed:', error);
        throw new Error(error.message || 'Failed to login');
    }
};

// Function to logout and remove session ID
export const logout = async () => {
    try {
        console.log('logout block reached')
        await SecureStore.deleteItemAsync('sessionid');
        router.push('/(auth)/LoginScreen');
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

// Function to retrieve the stored session ID (used for checking authentication)
export const getAuthToken = async () => {
    try {
        const sessionid = await SecureStore.getItemAsync('sessionid');
        return sessionid;
    } catch (error) {
        console.error('Failed to retrieve auth token:', error);
        return null;
    }
};
