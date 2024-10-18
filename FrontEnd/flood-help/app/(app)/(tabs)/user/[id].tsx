import React from 'react';
import {Animated, Text, TouchableOpacity, View} from "react-native";
import useStyles from "@/constants/style";
import {router, useLocalSearchParams} from "expo-router";
import UserAvatar from "@/components/UserAvatar";
import { baseURL } from '@/constants/baseurl';

const baseUrL = baseURL;

/**
 * User page displays information about the specified user with details from the database,
 * provided the user is an approved connection.
 * It also handles the functionality for deleting the relationship.
 */
const UserPage = () => {
    const {id, username, relationshipID} = useLocalSearchParams<{ id: string, username: string, relationshipID: string}>();
    const styles = useStyles();

    const handlePress = async (relationshipID) => {
        let call = baseUrL + "/relationships/delete/";
        const formData = new FormData();
        formData.append('relationship_id', relationshipID);

        try {
            const response = await fetch(call, {
                method: 'POST',
                body: formData,
            });
           console.log(response.json())
            router.replace('/connections')

        } catch (error) {
            console.error("Error with API call:", error);
        }

    };




    return (
        <View style={styles.page}>
        <Text style={styles.headerText}>{username}</Text>
            <UserAvatar size={100} imageLink={""} />
                <Text></Text>
                <Text style={styles.bodyTextBold }>Current Status</Text>
            <Text style={styles.bodyTextBold }>(will call databse to populate)</Text>

            <Text></Text>
            <Text style={styles.bodyTextBold }>Reporting History </Text>
            <Text style={styles.bodyTextBold }>(will call databse to populate)</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={() => handlePress(relationshipID)}>
                <Text style={styles.logoutButtonText}>Delete Connection</Text>
            </TouchableOpacity>


            </View>



);
};

export default UserPage;