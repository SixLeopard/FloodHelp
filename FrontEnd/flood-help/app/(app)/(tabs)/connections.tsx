import React, {useState, useCallback, useEffect} from 'react';
import { Text, View, Animated, RefreshControl, ActivityIndicator } from "react-native";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";
import FH_Button from "@/components/navigation/FH_Button";
import useAPI from "@/hooks/useAPI";

const ScrollView = Animated.ScrollView;

const Connections = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const relationships = useAPI(`/relationships/get_relationships?refreshKey=${refreshKey}`);
    const currentUser = useAPI('/accounts/get_current');
    const styles = useStyles();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshKey(prevKey => prevKey + 1);
    }, []);

    useEffect(() => {
        if (relationships && currentUser) {
            // Data is fetched, stop the spinner
            setRefreshing(false);
        }
    }, [relationships, currentUser]);

    // Wait for the data to be available
    if (!relationships || !currentUser) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={styles.primaryColor} />
                <Text style={styles.bodyText}>Loading Connections...</Text>
            </View>
        );
    }

    // Get approved and pending connections
    const approvedConnections = [];
    const pendingRequests = [];

    Object.entries(relationships).forEach(([key, connection]) => {
        const isCurrentUserRequestee = connection.requestee_uid === currentUser.uid;
        const isCurrentUserRequester = connection.requester_uid === currentUser.uid;

        if (connection.approved) {
            const username = isCurrentUserRequestee ? connection.requester_name : connection.requestee_name;
            const userId = isCurrentUserRequestee ? connection.requester_uid : connection.requestee_uid;

            approvedConnections.push(
                <UserCard
                    key={key}
                    username={username}
                    userID={userId}
                    relationshipID={key}
                    userAction="approvedRequest"
                />
            );
        } else if (!connection.approved && isCurrentUserRequestee) {
            pendingRequests.push(
                <UserCard
                    key={key}
                    username={connection.requester_name}
                    userId={connection.requester_uid}
                    relationshipID={key}
                    userAction="connectionRequest"
                />
            );
        }
    });

    return (
        <View style={styles.page}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: 'center', // Center content horizontally
                    justifyContent: 'center' // Center content vertically
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Text style={styles.headerText}>Connections</Text>
                {approvedConnections.length > 0 ? (
                    approvedConnections
                ) : (
                    <><Text style={styles.bodyText}>No Approved Connections</Text><FH_Button
                        route="/newConnections"
                        text="add your first connection!"/></>

                )}

                <Text style={styles.headerText}>Pending Connection Requests</Text>
                {pendingRequests.length > 0 ? (
                    pendingRequests
                ) : (
                    <Text style={styles.bodyText}>No Pending Connection Requests</Text>
                )}
            </ScrollView>

            <FH_Button
                route="/newConnections"
                text="Add New Connections"
            />
        </View>
    );
};

export default Connections;
