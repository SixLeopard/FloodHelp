import React from 'react';
import { Text, View } from "react-native";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";
import FH_Button from "@/components/navigation/FH_Button";
import useAPI from "@/hooks/useAPI";

const newConnections = () => {
    const styles = useStyles();
    const relationships = useAPI(`/relationships/get_relationships`);
    const currentUser = useAPI('/accounts/get_current');

    if (!relationships || !currentUser) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Add Connections</Text>
            <Text>TODO: Add back button</Text>
            <Text>TODO: Add search bar</Text>

            {/* Example for sending new connection requests */}
            <UserCard
                username="Send a Request"
                userId="new1"
                userAction={"sendRequest"}
            />


            <Text style={styles.headerText}>Pending Connection Requests</Text>

            {/* Map through relationships and show pending requests */}
            {Object.entries(relationships).map(([key, connection]) => {
                if (!connection.approved && connection.requester_uid === currentUser.uid) {
                    // Show pending requests where the current user is the requester
                    return (
                        <UserCard
                            key={key}
                            username={connection.requestee_name}
                            userId={connection.requestee_uid}
                            relationshipID={key}
                            userAction={"pendingRequest"}
                        />
                    );
                }

                return null;
            })}

            <Text style={styles.bodyText}>
                Connections can send you check-in requests and see your location during emergencies.
            </Text>
        </View>
    );
};

export default newConnections;
