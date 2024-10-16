import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useStyles from "@/constants/style";
import UserPressable from "@/components/UserPressable";
import { useTheme } from "@/contexts/ThemeContext";

const UserCard = ({ username, userID, relationshipID, userAction }) => {
    const styles = useStyles();
    const { theme } = useTheme();
    const colors = theme.colors;

    const [loading, setLoading] = useState(false);
    const [apiResult, setApiResult] = useState(null);
    const [checkInData, setCheckInData] = useState("unknown");

    useEffect(() => {
        if (userAction === "approvedRequest") {
            const fetchCheckInData = async () => {
                setLoading(true);
                try {
                    const response = await fetch("http://54.206.190.121:5000/check_in/get_checkins", {
                        method: 'GET',
                    });
                    const result = await response.json();
                    setCheckInData(result); // Store the check-in data
                } catch (error) {
                    console.error("Error fetching check-in data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCheckInData();
            getStatus();
        }
    }, [userAction]); // Fetch data only when userAction changes

    const handlePress = async (actionType) => {
        let endpoint = "http://54.206.190.121:5000";
        const formData = new FormData();
        if (actionType === 'check-status') {
            formData.append('uid', userID);
        } else {
            formData.append('relationship_id', relationshipID);
        }

        switch (actionType) {
            case 'accept':
                endpoint += "/relationships/approve/";
                break;
            case 'remove':
                endpoint += "/relationships/delete/";
                break;
            case 'send-request':
                endpoint += "/relationships/create";
                break;
            case 'check-status':
                endpoint += `/check_in/send_push`;
                break;
            default:
                return;
        }

        setLoading(true);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            setApiResult(result); // Store the result of the API call
        } catch (error) {
            console.error("Error with API call:", error);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatus = async async => {
        let result;
        setLoading(true);

        try {
            const response = await fetch("http://54.206.190.121:5000/check_in/get_checkins");
            result = await response.json();
            setCheckInData(result[userID][0][0]);
        } catch (error) {
            if (error.toString().includes("TypeError")) {
                setCheckInData("unknown")
            } else {
            console.error("Error with API call:", error);}
        } finally {
            setLoading(false);
        }
        //
        // console.log(result);
        //
        // console.log(userID);
        //
        // console.log(result[userID][0][0])
    };

    const renderIcon = () => {
        if (userAction === "approvedRequest") {
            console.log(checkInData)
            const statusIcon = checkInData === "Safe" ? "shield-check" : (checkInData === "unknown" ?  "map-marker-question":"shield-alert");
            const statusColor = checkInData === "Safe" ? colors.green : (checkInData === "unknown" ? colors.yellow : colors.red);

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
            <UserPressable userId={userID} username={username} relationshipID={relationshipID} />

            {loading ? (
                <View style={styles.page}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.bodyText}>Processing...</Text>
                </View>
            ) : (
                renderIcon()
            )}
        </View>
    );
};

export default UserCard;
