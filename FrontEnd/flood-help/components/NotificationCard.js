import React from 'react';
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import useStyles from "@/constants/style";
import UserAvatar from "@/components/UserAvatar";
import { useTheme } from "@/constants/ThemeProvider";

const NotificationCard = ({ type, title, body, timeOfNotification }) => {
    const styles = useStyles();
    const { theme } = useTheme();
    const colors = theme.colors;

    return (
        <View style={styles.notificationCard}>
            {type === 'user' && <UserAvatar />}
            {type === 'warning' && <MaterialIcons name="warning" style={styles.notifCautionIcon} />}
            <View style={styles.notificationBody}>
                <Text>
                    <Text style={styles.bodyTextBold}>{title}</Text>
                    <Text> | </Text>
                    <Text style={styles.bodyTextDark}>{timeOfNotification}</Text>
                </Text>
                <Text style={styles.bodyTextDark}>{body}</Text>
            </View>
        </View>
    );
};

export default NotificationCard;
