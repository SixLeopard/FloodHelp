import React from 'react';
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useStyles from "@/constants/style";
import UserAvatar from "@/components/UserAvatar";
import UserPressable from "@/components/UserPressable";
import { useTheme } from "@/constants/ThemeProvider";

const UserCard = ({ username, userId, status, showConnectionRequest, sendRequest, pendingRequest }) => {
    const styles = useStyles();
    const { theme } = useTheme();
    const colors = theme.colors;

    // Determine the status icon and color based on the status prop
    const statusIcon = status === "safe" ? "shield-check" : "shield-alert";
    const statusColor = status === "safe" ? colors.green : colors.red;

    return (
        <View style={styles.userCard}>
            <UserPressable userId={userId} username={username} />

            {status && (
                <MaterialCommunityIcons name={statusIcon} style={styles.userCardIcon} color={statusColor} />
            )}

            {showConnectionRequest && (
                <View style={styles.userCardIcon}>
                    <MaterialCommunityIcons name="account-remove"  size={35} color={colors.red} />
                    <MaterialCommunityIcons name="account-check" size={35} color={colors.green} />
                </View>
            )}

            {sendRequest && (
                <View style={styles.userCardIcon}>
                    <MaterialCommunityIcons name="account-plus"  size={35} color={colors.blue} />
                </View>
            )}

            {pendingRequest && (
                <View style={styles.userCardIcon}>
                    <MaterialCommunityIcons name="timer-sand"  size={35} color={colors.blue} />
                </View>
            )}

        </View>
    );
};

export default UserCard;
