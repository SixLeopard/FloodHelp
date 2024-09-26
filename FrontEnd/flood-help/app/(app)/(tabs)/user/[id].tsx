import React from 'react';
import {Animated, Text, TouchableOpacity, View} from "react-native";
import useStyles from "@/constants/style";
import {useLocalSearchParams} from "expo-router";
import UserAvatar from "@/components/UserAvatar";
import ReportCard from "@/components/ReportCard";
import FH_Button from "@/components/navigation/FH_Button";
import ScrollView = Animated.ScrollView;
import {MaterialCommunityIcons} from "@expo/vector-icons";

const UserPage = () => {
    const {id, relationshipID} = useLocalSearchParams<{ id: string, relationshipID: string}>();
    const styles = useStyles();

    const handlePress = async (relationshipID) => {
        let call = "http://54.206.190.121:5000/relationships/delete";
        const formData = new FormData();
        formData.append('relationship_id', relationshipID);

        try {
            const response = await fetch(call, {
                method: 'POST',
                body: formData,
            });
           console.log(response.json())

        } catch (error) {
            console.error("Error with API call:", error);
        }

    };




    return (
        <View style={styles.page}>
        <Text style={styles.headerText}>User Name {id}</Text>
            <UserAvatar size={100} imageLink={""} />
                <Text></Text>
                <Text style={styles.bodyTextBold }>Current Status</Text>
            <Text style={styles.bodyTextBold }>(will call databse to populate)</Text>

            <Text></Text>
            <Text style={styles.bodyTextBold }>Reporting History </Text>
            <Text style={styles.bodyTextBold }>(will call databse to populate)</Text>


            <Text></Text>
            <Text style={styles.bodyTextBold }>Connection?</Text>
            <Text style={styles.bodyTextBold }>(add connection / delete connection etc.)</Text>
            <TouchableOpacity onPress={() => handlePress(relationshipID)}>
                <MaterialCommunityIcons name="account-remove" size={35}  />
            </TouchableOpacity>



            </View>



);
};

export default UserPage;