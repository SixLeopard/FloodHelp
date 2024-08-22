import React from 'react';
import {Pressable, Text} from "react-native";

import useStyles from "@/constants/style";
import UserAvatar from "@/components/UserAvatar";
import { router} from "expo-router";

const UserCard = ({username, userId}) => {
    const styles = useStyles();

    return (
        <Pressable style ={styles.userCard}
            onPress={() => router.push({
                pathname: '/user/[id]',
                params: {id : userId}
            })
            }>


            <UserAvatar imageLink={""}></UserAvatar>
            <Text style={styles.bodyText}>{username}</Text>

        </Pressable>
    );
};

export default UserCard;