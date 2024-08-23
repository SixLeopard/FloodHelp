import React from 'react';
import {Pressable, Text, View} from "react-native";

import useStyles from "@/constants/style";
import UserAvatar from "@/components/UserAvatar";
import { router} from "expo-router";
import UserPressable from "@/components/UserPressable";

const UserCard = ({username, userId}) => {
    const styles = useStyles();

    return (
        <View style={styles.userCard}>
            <UserPressable userId={userId} username={username}/>
        </View>

    );
};

export default UserCard;