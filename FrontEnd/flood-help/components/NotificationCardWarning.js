import React from 'react';
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import useStyles from "@/constants/style";
import UserAvatar from "@/components/UserAvatar";
import { router } from "expo-router";
import UserPressable from "@/components/UserPressable";
import {useTheme} from "@/constants/ThemeProvider";



const NotificationCardWarning = ({ warning, timeOfNotification }) => {
    const styles = useStyles();
    const { theme } = useTheme();
    const colors = theme.colors
    const body = "Expected flooding in St Lucia today from 9am. "

    //TODO: Add Buttons (view on map, check in etc).
    return (
        <View style={styles.notificationCard}>
            <MaterialIcons name="warning" style={styles.notifCautionIcon} />
            <View style={styles.notificationBody}>
                <Text>
                    <Text style={styles.bodyTextBold}>{warning}</Text>
                    <Text> | </Text>
                    <Text style={styles.bodyTextDark}>{timeOfNotification}</Text>
                </Text>
                <Text style={styles.bodyTextDark}>{body}</Text>
            </View>
        </View>
    );
};

export default NotificationCardWarning;
