import React from 'react';
import useStyles from "@/constants/style";
import {Image} from "react-native";

const UserAvatar = ({imageLink}) => {
    const styles = useStyles();

    return (
        <Image style={styles.profileImg} source={require("../assets/images/icon.png")}></Image>
        // TODO: Fix imageLink passing
    );
};

export default UserAvatar;