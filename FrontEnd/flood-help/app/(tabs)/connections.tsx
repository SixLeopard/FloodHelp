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
            <UserCard username="Marked Safe" userId="v" status={"safe"} />
            <UserCard username="Status Unknown" userId="12345" status={"unknown"} />
            <UserCard username="Connection Request" userId="12345" showConnectionRequest={true} />
            <UserCard username="Send a Request" userId="12345" sendRequest={true} />
            <UserCard username="Pending Request" userId="12345" pendingRequest={true} />


        </View>
    );
};

export default Connections;