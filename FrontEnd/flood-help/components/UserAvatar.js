import React from 'react';
import { Image, StyleSheet } from 'react-native';
import {router} from "expo-router";
import {Pressable} from "react-native";

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
