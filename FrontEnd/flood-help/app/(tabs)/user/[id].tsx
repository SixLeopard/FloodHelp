import React from 'react';
import {Text, View} from "react-native";
import useStyles from "@/constants/style";
import {useLocalSearchParams} from "expo-router";

const UserPage = () => {
    const {id} = useLocalSearchParams<{ id: string }>();
    const styles = useStyles();


    return (
        <View style={styles.page}>
        <Text style={styles.headerText}>User {id}'s Page</Text>

    </View>
);
};

export default UserPage;