import React from 'react';
import {View, Text, Animated} from "react-native";
import useStyles from "@/constants/style";
import UserAvatar from "@/components/UserAvatar";
import ReportCard from "@/components/ReportCard";
import FH_Button from "@/components/navigation/FH_Button";
import ScrollView = Animated.ScrollView;


const Profile = () => {
    const styles = useStyles();

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Profile Page</Text>
            <UserAvatar size={100} imageLink={""} />
            <Text style={styles.nameText}>User Name</Text>
            <Text style={styles.bodyTextBold }>Reporting History</Text>
            <ScrollView style={{height: "50%", width: "100%"}}>
<View style={styles.reportCardsContainer}>

    <ReportCard reportID={1} location={"Modwest Building, UQ"} time={"11:19am 19/02/2022"} type={undefined} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. "} />
    <ReportCard reportID={2} location={"89 Montague Rd, West End"} time={"8:29am 15/02/2022"} type={undefined} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. "} />
    <ReportCard reportID={3} location={"Test 3"} time={"8:29am 15/02/2022"} type={undefined} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. "} />
    <ReportCard reportID={4} location={"Test 4"} time={"8:29am 15/02/2022"} type={undefined} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. "} />

</View>

            </ScrollView>
            <Text></Text>
            <FH_Button route='/(tabs)/newreport' text={"Create New Hazard Report"}/>
            <Text></Text>
        </View>
    );
};

export default Profile;
