import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, Animated, RefreshControl } from 'react-native';
import useStyles from '@/constants/style';
import useAPI from '@/hooks/useAPI';
import UserCard from '@/components/UserCard';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import FH_Button from "@/components/navigation/FH_Button";

const ScrollView = Animated.ScrollView;

const Connections = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const styles = useStyles();

    const relationships = useAPI(`/relationships/get_relationships?refreshKey=${refreshKey}`);
    const currentUser = useAPI('/accounts/get_current');

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshKey(prevKey => prevKey + 1);
    }, []);

    useEffect(() => {
        if (relationships && currentUser) {
            setRefreshing(false);
        }
    }, [relationships, currentUser]);

    if (!relationships || !currentUser) {
        return <Loading text="Loading Connections..." />;
    }

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
                    userID={connection.requester_uid}
                    relationshipID={key}
                    userAction="connectionRequest"
                />
            );
        }
    });

    return (
        <View style={styles.page}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <Text style={styles.headerText}>Connections</Text>
                {approvedConnections.length > 0 ? (
                    approvedConnections
                ) : (
                    <EmptyState message="No Approved Connections" buttonText="Add your first connection!" buttonRoute="/newConnections" />
                )}
                <Text style={styles.headerText}>Pending Connection Requests</Text>
                {pendingRequests.length > 0 ? (
                    pendingRequests
                ) : (
                    <Text style={styles.bodyText}>No Pending Connection Requests</Text>
                )}
            </ScrollView>

            <Text/>
            <FH_Button
                route="/newConnections"
                text="Add New Connections"
            />
            <Text/>
        </View>
    );
};

export default Connections;
