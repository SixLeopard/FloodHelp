import React from 'react';
import {Text, View} from "react-native";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";

const Connections = () => {
    const styles = useStyles();

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Connections Page</Text>
            <UserCard username={"Test User 1"} userId={1}/>
            <UserCard username={"Test User 2"} userId={2}/>

        </View>
    );
};

export default Connections;