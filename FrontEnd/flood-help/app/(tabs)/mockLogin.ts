import { Alert } from 'react-native';



export const mockLogin = async (username: string, password: string) => {
    try {
        const formData = new FormData();
        formData.append('username', username); 
        formData.append('password', password); 

        const response = await fetch('http://54.206.190.121:5000/accounts/login', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result.Login === "True" && result.sessionid) {
            const sessionId = result.sessionid;
            return { sessionId, username }; 
        } else {
            Alert.alert('Error', 'Login failed.');
            return null;
        }
    } catch (error) {
        console.error("Login error:", error);
        return null;
    }
};
