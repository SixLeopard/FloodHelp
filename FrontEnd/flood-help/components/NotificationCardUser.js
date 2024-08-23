import React from 'react';
import {Pressable, Text, View} from "react-native";

import useStyles from "@/constants/style";
import UserAvatar from "@/components/UserAvatar";
import { router} from "expo-router";
import UserPressable from "@/components/UserPressable";

const NotificationCardUser = ({username, timeOfNotification}) => {
    const styles = useStyles();
    const body = "placeholder: has marked a b c d e f wegwegwethemselves safe"

    return (
        <View style={styles.notificationCard}>
            <UserAvatar></UserAvatar>
            {/*<UserPressable userId={1} username={'testt'}></UserPressable>*/}
            <View style={styles.notificationBody}>
                <Text>
                    <Text style={styles.bodyTextBold}>{username}</Text>
                    <Text> | </Text>
                    <Text style={styles.bodyTextDark}>{timeOfNotification}</Text>
                </Text>
                <Text style={styles.bodyTextDark}>{body}</Text>
            </View>
        </View>
    );
};

export default NotificationCardUser;