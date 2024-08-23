import { Stack } from 'expo-router/stack';
import { ThemeProvider } from '@/constants/ThemeProvider'

import FontContext from "@/constants/FontContext";

export default function Layout() {
    return (
        <FontContext>
        <ThemeProvider>
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
        </Stack>
    </ThemeProvider>
        </FontContext>
    );
}
