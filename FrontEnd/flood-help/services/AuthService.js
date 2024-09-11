import * as SecureStore from 'expo-secure-store';

const baseUrl = 'http://54.206.190.121:5000';

// Function to login by making a POST request to the backend
export const login = async ({ email, password }) => {
    try {
        const formdata = new FormData();
        formdata.append('username', email); // Use "username" if that's what the backend expects
        formdata.append('password', password);

        const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow', // Optional: in case you need to handle redirects
        };

        const response = await fetch(`${baseUrl}/accounts/login`, requestOptions);

        const data = await response.json(); // Parse the JSON response

        // Check if the login was successful
        if (data.Login === 'True' && data.sessionid) {
            // Save the session ID securely
            await SecureStore.setItemAsync('sessionid', data.sessionid);
            return data.sessionid;
        } else {
            throw new Error('Invalid login');
        }
    } catch (error) {
        // Handle any errors (network errors, API errors, etc.)
        throw new Error(error.message || 'Failed to login');
    }
};

// Function to logout and remove session ID
export const logout = async () => {
    await SecureStore.deleteItemAsync('sessionid');
};

// Function to retrieve the stored session ID (used for checking authentication)
export const getAuthToken = async () => {
    const sessionid = await SecureStore.getItemAsync('sessionid');
    return sessionid;
};
