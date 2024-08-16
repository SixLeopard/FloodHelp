import { Stack } from 'expo-router/stack';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ThemeProvider } from '@/constants/ThemeProvider'

import {lightTheme} from "@/utilities/lightTheme";
import {darkTheme} from "@/utilities/darkTheme";
import defaultTheme from "@react-navigation/native/src/theming/DefaultTheme";
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
