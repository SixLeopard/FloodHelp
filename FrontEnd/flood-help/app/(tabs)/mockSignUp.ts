import { Alert } from 'react-native';


export const mockSignUp = async () => {
    try {
        const formData = new FormData();
        formData.append('name', 'test'); 
        formData.append('email', 'test@test.com'); 
        formData.append('password', 'testpassword');

        const response = await fetch('http://54.206.190.121:5000/accounts/create', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result.created === "True") {
            Alert.alert('Success', `Account created for ${result.username}`);
            return { username: result.username, password: 'testPassword' };
        } else {
            Alert.alert('Error', 'Account creation failed.');
            return null;
        }
    } catch (error) {
        console.error("Sign-up error:", error);
        return null;
    }
};