import React from 'react';
import {Pressable, Text} from "react-native";

import useStyles from "@/constants/style";
import UserAvatar from "@/components/UserAvatar";
import { router} from "expo-router";

const UserPressable = ({username, userId}) => {
    const styles = useStyles();

    return (
        <Pressable style ={styles.userPressable}
                   onPress={() => router.push({
                       pathname: '/user/[id]',
                       params: {id : userId}
                   })
                   }>

            <UserAvatar imageLink={""} userId={userId}></UserAvatar>
            <Text style={styles.bodyTextBold}>{username}</Text>

        </Pressable>
    );
};

export default UserPressable;