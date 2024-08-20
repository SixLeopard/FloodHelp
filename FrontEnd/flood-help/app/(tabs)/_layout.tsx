import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useColorScheme } from '@/hooks/useColorScheme';
import { darkTheme } from '@/utilities/darkTheme';
import { lightTheme } from '@/utilities/lightTheme';
import {useTheme} from "@/constants/ThemeProvider";

export default function TabLayout() {
    // const colorScheme = useColorScheme();

    // // Select the appropriate theme colors based on the color scheme
    // const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
    // const { colors } = theme;

    const { theme } = useTheme();
    const { colors } = theme;

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.tint || colors.primary,
                tabBarInactiveTintColor: colors.tabIconDefault || colors.border,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    // height: 60,
                },
                headerShown: false,
            }}>
            <Tabs.Screen
                name="reporting"
                options={{
                    headerShown: false,
                    tabBarLabel: "Report",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="pencil" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    headerShown: false,
                    tabBarLabel: "Notifications",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="bell" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    tabBarLabel: "Map",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="map" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="connections"
                options={{
                    headerShown: false,
                    tabBarLabel: "Connections",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="human-greeting" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    headerShown: false,
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="cog" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
