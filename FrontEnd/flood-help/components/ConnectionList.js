import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import UserCard from './UserCard';

const ConnectionList = ({ relationships, currentUser }) => {
    console.log(item.status)
    const renderItem = ({ item }) => (
        <UserCard
            username={item.username}
            userID={item.userID}
            relationshipID={item.relationshipID}
            userAction={item.userAction}
            status={item.status}
        />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={relationships}
                renderItem={renderItem}
                keyExtractor={(item) => item.relationshipID.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 20,
    },
});

export default ConnectionList;
