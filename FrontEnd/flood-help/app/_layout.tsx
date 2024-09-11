import { Stack} from 'expo-router/stack';
import { ThemeProvider } from '@/constants/ThemeProvider';
import FontContext from '@/contexts/FontContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoadingScreen from "@/app/(auth)/LoadingScreen";
import LoginScreen from "@/app/(auth)/LoginScreen";

export default function RootLayout() {
    return (
        <AuthProvider>
            <AuthenticatedLayout />
        </AuthProvider>
    );
}

// AuthenticatedLayout component checks if the user is logged in
function AuthenticatedLayout() {
    const { user, loading } = useAuth(); // Get auth state from context

    if (loading) {
        return <LoadingScreen />; // Show a loading screen while checking auth status
    }

    if (!user) {
        return <LoginScreen/> // Redirect to login if user is not authenticated
    }

    return (
        <FontContext>
            <ThemeProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </ThemeProvider>
        </FontContext>
    );
}