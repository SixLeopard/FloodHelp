import React from 'react';
import { Image, StyleSheet } from 'react-native';
import {router} from "expo-router";
import {Pressable} from "react-native";

/**
 * Renders the profile picture placeholder
 * @param imageLink - link to the user's profile picture (not fully implemented)
 * @param size - determines size of the icon (e.g, smaller for cards, bigger for the profile page).
 * @param userId - the ID of the related user. Used to render the profile page of that is called when pressed UserAvatar is pressed.
 * @returns {Element}
 */
const UserAvatar = ({ imageLink, size = 50, userId="default"}) => {

    const imageSource = imageLink ? { uri: imageLink } : require("../assets/images/icon.png");


    const styles = StyleSheet.create({
        profileImg: {
            height: size,
            width: size,
            borderRadius: size / 2,
            margin: 15,
        },
    });

    return (
        <Pressable style ={styles.userPressable}
                   onPress={() => router.push({
                       pathname: '/user/[id]',
                       params: {id : userId}
                   })
                   }>

        <Image
            style={styles.profileImg}
            source={imageSource}
        />
        </Pressable>
    );
};

export default UserAvatar;
