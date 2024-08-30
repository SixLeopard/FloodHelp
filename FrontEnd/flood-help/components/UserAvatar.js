import React from 'react';
import { Image, StyleSheet } from 'react-native';

const UserAvatar = ({ imageLink, size = 50}) => {

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
        <Image
            style={styles.profileImg}
            source={imageSource}
        />
    );
};

export default UserAvatar;
