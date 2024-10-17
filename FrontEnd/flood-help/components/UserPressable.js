import React from 'react';
import {Pressable, Text} from "react-native";

import useStyles from "@/constants/style";
import UserAvatar from "@/components/UserAvatar";
import { router} from "expo-router";

/**
 * UserPressable handles the trigger when a user related component is pressed. It is designed
 * to be used for any component that may need to be linked to the users process
 * @param username
 * @param userId
 * @param relationshipID
 * @returns {Element}
 * @constructor
 */
const UserPressable = ({username, userId, relationshipID}) => {
    const styles = useStyles();

    return (
        <Pressable style ={styles.userPressable}
                   onPress={() => router.push({
                       pathname: '/user/[id]',
                       params: {id : userId, username: username, relationshipID: relationshipID}
                   })
                   }>

            <UserAvatar imageLink={""} userId={userId}></UserAvatar>
            <Text style={styles.bodyTextBold}>{username}</Text>


        </Pressable>
    );
};

export default UserPressable;