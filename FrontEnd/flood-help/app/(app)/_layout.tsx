import { Stack } from 'expo-router/stack';
import { ThemeProvider } from '@/contexts/ThemeContext';
import FontContext from '@/contexts/FontContext';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
    return (
        <AuthProvider>
            <FontContext>
                <ThemeProvider>
                    <Stack>
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="(auth)/LoginScreen" options={{ headerShown: false }} />
                        <Stack.Screen name="(auth)/CreateAccountScreen" options={{ headerShown: false }} />
                    </Stack>
                </ThemeProvider>
            </FontContext>
        </AuthProvider>
    );
}
