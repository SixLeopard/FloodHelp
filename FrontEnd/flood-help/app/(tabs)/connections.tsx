import React from 'react';
import {Text, View} from "react-native";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";
import FH_Button from "@/components/navigation/FH_Button";


const Connections = () => {
    const styles = useStyles();

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Connections Page</Text>
            <UserCard username={"Test User 1"} userId={1}/>
            <UserCard username={"Test User 2"} userId={2}/>
            <UserCard username="Marked Safe" userId="marked safe" status={"safe"} />
            <UserCard username="Status Unknown" userId="status unknown" status={"unknown"} />
            <UserCard username="Connection Request" userId="connection request" showConnectionRequest={true} />
            <UserCard username="Send a Request" userId="send request" sendRequest={true} />
            <UserCard username="Pending Request" userId="pending req" pendingRequest={true} />

            <FH_Button route="/newConnections" text="Add New Connections"></FH_Button>


        </View>
    );
};

export default Connections;