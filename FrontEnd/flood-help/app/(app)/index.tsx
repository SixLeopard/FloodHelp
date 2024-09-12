import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/app/(app)/(auth)/LoadingScreen'

export default function Index() {
    const { user, loading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading) {
            if (!user) {
                // If the user is not authenticated, redirect to the login screen
                router.push('/(auth)/LoginScreen');
            } else {
                // If the user is authenticated, redirect to the tabs layout
                router.push('/(tabs)');

            }
        }
    }, [user, loading, router]);

    if (loading) {
        return <LoadingScreen />;
    }

    return null; // Or return a placeholder component if needed
}
