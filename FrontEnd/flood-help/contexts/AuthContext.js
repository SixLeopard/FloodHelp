import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuthToken, login, logout } from '@/services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check authentication status
    useEffect(() => {
        const checkAuth = async () => {
            const token = await getAuthToken();
            if (token) {
                setUser({ token }); // Add any user data received
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const signIn = async (credentials) => {
        const token = await login(credentials);
        setUser({ token });
    };

    const signOut = () => {
        logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
