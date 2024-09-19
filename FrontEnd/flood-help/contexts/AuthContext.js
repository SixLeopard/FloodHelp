import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuthToken, login, logout } from '@/services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await getAuthToken();
                if (token) {
                    setUser({ token });
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const signIn = async (credentials) => {
        try {
            const { token, email } = await login(credentials);
            // console.log("Token", token)
            if (token) {
                setUser({ token, email });
                console.log("user", user)
            } else {
                throw new Error('Invalid login response');

            }
        } catch (error) {
            console.error('Sign-in failed:', error);
            throw new Error('Sign-in failed: ' + error.message);
        }
    };

    const signOut = async () => {
        try {
            console.log("button pressed")
            await logout();
            setUser(null);
        } catch (error) {
            console.error('Sign-out failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
