import React from 'react';
import {View, Text, Button, Animated} from "react-native";
import {useTheme} from "@/constants/ThemeProvider";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";
import UserAvatar from "@/components/UserAvatar";
import ReportCard from "@/components/ReportCard";
import {router} from "expo-router";
import {Pressable} from "react-native";
import FH_Button from "@/components/navigation/FH_Button";
import ScrollView = Animated.ScrollView;


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
            <ScrollView style={{height: "50%", width: "100%"}}>
<View style={styles.reportCardsContainer}>
    <ReportCard reportID={2} location={"89 Montague Rd, West End"} time={"8:29am 15/02/2022"} type={undefined} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. "} />
    <ReportCard reportID={2} location={"89 Montague Rd, West End"} time={"8:29am 15/02/2022"} type={undefined} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. "} />
    <ReportCard reportID={2} location={"89 Montague Rd, West End"} time={"8:29am 15/02/2022"} type={undefined} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. "} />
    <ReportCard reportID={2} location={"89 Montague Rd, West End"} time={"8:29am 15/02/2022"} type={undefined} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. "} />
    <ReportCard reportID={2} location={"89 Montague Rd, West End"} time={"8:29am 15/02/2022"} type={undefined} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. "} />
    <ReportCard reportID={2} location={"89 Montague Rd, West End"} time={"8:29am 15/02/2022"} type={undefined} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. "} />

</View>

            </ScrollView>
            <FH_Button route='/(tabs)/newreport' text={"Create New Hazard Report"}/>
        </View>
    );
};

export default Profile;
