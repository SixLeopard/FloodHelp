import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/app/(app)/(auth)/LoadingScreen'
import useAPI from "@/hooks/useAPI";

export default function Index() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const userAPI = useAPI('/accounts/get_current')
    console.log('userAPI:', userAPI)

    React.useEffect(() => {
        if (!loading) {
            if (!user || userAPI == null) {
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
