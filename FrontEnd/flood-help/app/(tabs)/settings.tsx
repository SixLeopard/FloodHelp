import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import useStyles from "@/constants/style";
import {HelloWave} from "@/components/HelloWave";


export default function SettingsScreen() {
    const { theme, toggleTheme } = useTheme();
    const styles = useStyles();

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Settings</Text>
            <View style={styles.rowContainer}>
                <Text style={styles.bodyText}>Dark Mode</Text>
                <Switch
                    onValueChange={toggleTheme}
                />
            </View>
        </View>
    );
}
