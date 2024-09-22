import React from 'react';
import {Text, View} from "react-native";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";
import FH_Button from "@/components/navigation/FH_Button";
import getAPI from "@/hooks/GetAPI";


const NewConnections = () => {
    const styles = useStyles();
    const relationships = getAPI(`/relationships/get_relationships`)
    const currentUser = getAPI('/accounts/get_current')
    if (!relationships || !currentUser ){
        return <Text>Loading...</Text>;
    }
    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Add Connections</Text>


            <Text>TODO: Add back button</Text>

            <Text>TODO: Add search bar</Text>

            <UserCard username="Send a Request" userId="new1" sendRequest={true} status={undefined}
                      showConnectionRequest={false} pendingRequest={false} />
            <UserCard username="Send a Request" userId="new2" sendRequest={true} status={undefined}
                      showConnectionRequest={false} pendingRequest={false} />

            <Text style={styles.headerText}>Pending Connection Requests</Text>
            {Object.entries(relationships).map(([key, connection]) =>
                connection.requester_uid == currentUser.uid ? (
                    connection.approved ? null : (
                        <UserCard
                            key = {key}
                            username={connection.requestee_name}
                            userId={connection.requestee_name}
                            pendingRequest={true}
                        />
                    )
                ) : null
            )}

            <Text style={styles.bodyText}>Connections can send you check in requests and see your location during an emergenc</Text>


        </View>
    );
};

export default NewConnections;