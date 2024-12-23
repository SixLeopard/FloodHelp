import * as SecureStore from 'expo-secure-store';
import {router} from "expo-router";
import getAPI from "@/hooks/useAPI";
import { baseURL } from '@/constants/baseurl';

const baseUrl = baseURL;

// Function to login by making a POST request to the backend
export const login = async ({ email, password }) => {
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const requestOptions = {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        console.log(formData);
       const response = await fetch(`${baseUrl}/accounts/login`, requestOptions);
       //  const response = await getAPI(`/accounts/login`, formData)
        console.log(response);
        console.log(requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response
    console.log(data);
        // Check if the login was successful
        if (data.Login === 'True' && data.sessionid !== "None") {
            // Save the session ID securely
            await SecureStore.setItemAsync('sessionid', data.sessionid);
            router.push('/(tabs)');
            return { token: data.sessionid, email };
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
