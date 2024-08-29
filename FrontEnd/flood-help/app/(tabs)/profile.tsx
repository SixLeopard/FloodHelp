import React from 'react';
import {View, Text} from "react-native";
import {useTheme} from "@/constants/ThemeProvider";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";
import UserAvatar from "@/components/UserAvatar";
import ReportCard from "@/components/ReportCard";
import {router} from "expo-router";
import {Pressable} from "react-native";

const Profile = () => {
    const styles = useStyles();
    const theme = useTheme();

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Profile Page</Text>
            <UserAvatar size={100} imageLink={""} />
            <Text style={styles.nameText}>User Name</Text>
            <Text></Text>
            <Text style={styles.bodyTextBold }>Reporting History</Text>
            {/*<ReportCard reportID={2} location={"89 Montague Rd, West End"} time={"8:29am 15/02/2022"} />*/}

            {/*<Pressable style ={styles.userPressable}*/}
            {/*           onPress={() => router.push({*/}
            {/*               pathname: '/(tabs)/newreport'*/}
            {/*           })*/}
            {/*           }>*/}
            {/*    <Text>New Report</Text>*/}
            {/*</Pressable>*/}
        </View>
    );
};

export default Profile;
