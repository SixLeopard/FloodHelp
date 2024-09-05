import React from 'react';
import {Animated, Text, View} from "react-native";
import useStyles from "@/constants/style";
import {useLocalSearchParams} from "expo-router";
import UserAvatar from "@/components/UserAvatar";
import ReportCard from "@/components/ReportCard";
import FH_Button from "@/components/navigation/FH_Button";
import ScrollView = Animated.ScrollView;

const UserPage = () => {
    const {id} = useLocalSearchParams<{ id: string }>();
    const styles = useStyles();


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

            </View>



);
};

export default UserPage;