import React from 'react';
import {Text, View} from "react-native";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";
import FH_Button from "@/components/navigation/FH_Button";


const NewConnections = () => {
    const styles = useStyles();

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Add Connections</Text>
            <Text>TODO: Add back button</Text>

            <Text>TODO: Add search bar</Text>

            <UserCard username="Send a Request" userId="12345" sendRequest={true} />
            <UserCard username="Send a Request" userId="12345" sendRequest={true} />

            <Text style={styles.bodyText}>Connections can send you check in requests and see your location during an emergenc</Text>


        </View>
    );
};

export default NewConnections;