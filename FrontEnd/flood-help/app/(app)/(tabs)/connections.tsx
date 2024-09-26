import React from 'react';
import { Text, View } from "react-native";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";
import FH_Button from "@/components/navigation/FH_Button";
import useAPI from "@/hooks/useAPI";
import { useAuth } from "@/contexts/AuthContext";

const Connections = () => {
    const relationships = useAPI('/relationships/get_relationships');
    const currentUser = useAPI('/accounts/get_current');
    const styles = useStyles();

    if (!relationships || !currentUser) {
        return <Text>Loading...</Text>;
    }

    console.log(relationships)

    // Helper function to determine the userAction prop

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Connections Page</Text>

            {Object.entries(relationships).map(([key, connection]) => {
                // Only show approved connections
                var username = connection.requestee_name
                if (connection.approved) {
                    if (connection.requestee_name == currentUser.name) {
                         username = connection.requester_name
                    }


                    return (
                        <UserCard
                            key={key}
                            username={username}
                            userID={connection.requestee_uid}
                            relationshipID={key}
                            userAction={"approvedRequest"}
                        />
                    );
                }
                return null;
            })}

            <Text style={styles.headerText}>Pending Connection Requests</Text>

            {Object.entries(relationships).map(([key, connection]) => {

                // Show pending requests where the current user is the requestee
                if (!connection.approved && !(connection.requester_uid === currentUser.uid)) {
                    return (
                        <UserCard
                            key={key}
                            username={connection.requester_name}
                            userId={connection.requester_id}
                            relationshipID={key}
                            userAction={"connectionRequest"}
                        />
                    );
                }

                return null;
            })}

            <FH_Button route="/newConnections" text="Add New Connections" />
        </View>
    );
};

export default Connections;
