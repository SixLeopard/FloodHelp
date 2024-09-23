import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useStyles from "@/constants/style";
import UserPressable from "@/components/UserPressable";
import { useTheme } from "@/contexts/ThemeContext";

const UserCard = ({ username, userID, relationshipID, userAction }) => {
    const styles = useStyles();
    const { theme } = useTheme();
    const colors = theme.colors;

    // State to track loading and result of the API call
    const [loading, setLoading] = useState(false);
    const [apiResult, setApiResult] = useState(null);

    // Function to handle API call on icon press
    const handlePress = async (actionType) => {
        let endpoint;
        const formData = new FormData();
        formData.append('relationship_id', relationshipID);

        // Define the endpoint based on the actionType
        switch (actionType) {
            case 'accept':
                endpoint = "/relationships/approve";
                break;
            case 'remove':
                endpoint = "/relationships/delete/";
                break;
            case 'send-request':
                endpoint = "/relationships/create"; // Example endpoint for sending new requests
                break;
            case 'check-status':
                endpoint = `/user/${userID}/status`; // Example endpoint for checking user status
                break;
            default:
                return;
        }

        setLoading(true); // Set loading to true when the request starts

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json(); // Handle JSON response
            setApiResult(result); // Store the result of the API call
        } catch (error) {
            console.error("Error with API call:", error);
        } finally {
            setLoading(false); // Set loading to false when the request is complete
        }
    };

    // Determine which icon and color to show based on the userAction input
    const renderIcon = () => {
        if (userAction === "approvedRequest") {
            const statusIcon = userAction.status === "safe" ? "shield-check" : "shield-alert";
            const statusColor = userAction.status === "safe" ? colors.green : colors.red;
            return (
                <TouchableOpacity onPress={() => handlePress('check-status')}>
                    <MaterialCommunityIcons
                        name={statusIcon}
                        style={styles.userCardIcon}
                        color={statusColor}
                    />
                </TouchableOpacity>
            );
        }

        if (userAction === "connectionRequest") {
            return (
                <View style={styles.userCardIcon}>
                    <TouchableOpacity onPress={() => handlePress('remove')}>
                        <MaterialCommunityIcons name="account-remove" size={35} color={colors.red} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('accept')}>
                        <MaterialCommunityIcons name="account-check" size={35} color={colors.green} />
                    </TouchableOpacity>
                </View>
            );
        }

        if (userAction === "sendRequest") {
            return (
                <TouchableOpacity onPress={() => handlePress('send-request')}>
                    <MaterialCommunityIcons name="account-plus" size={35} color={colors.blue} />
                </TouchableOpacity>
            );
        }

        if (userAction === "pendingRequest") {
            return (
                <MaterialCommunityIcons name="timer-sand" size={35} color={colors.blue} />
            );
        }

        return null;
    };

    return (
        <View style={styles.userCard}>
            <UserPressable userId={userID} username={username} />

            {loading ? (
                // Show a loading spinner when API call is in progress
                <View style={styles.page}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.bodyText}>Processing...</Text>
                </View>
            ) : (
                // Render the icon if not loading
                renderIcon()
            )}
        </View>
    );
};

export default UserCard;
