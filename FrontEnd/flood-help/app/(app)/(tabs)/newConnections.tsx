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

            <UserCard username="Send a Request" userId="new1" sendRequest={true} status={undefined}
                      showConnectionRequest={false} pendingRequest={false} />
            <UserCard username="Send a Request" userId="new2" sendRequest={true} status={undefined}
                      showConnectionRequest={false} pendingRequest={false} />

            <Text style={styles.bodyText}>Connections can send you check in requests and see your location during an emergency</Text>


        </View>
    );
};

export default NewConnections;