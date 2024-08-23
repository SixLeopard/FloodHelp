import React from 'react';
import {View, Text} from "react-native";
import {useTheme} from "@/constants/ThemeProvider";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";
import UserAvatar from "@/components/UserAvatar";

const Profile = () => {
    const styles = useStyles();

    return (
        <View style={styles.page}>

            <Text style={styles.headerText}>Profile Page </Text>
            <UserAvatar></UserAvatar>
        </View>
    );
};

export default Profile;