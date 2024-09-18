import React from 'react';
import { View, Text, Animated } from 'react-native';
import useStyles from '@/constants/style';
import UserAvatar from '@/components/UserAvatar';
import ReportCard from '@/components/ReportCard';
import FH_Button from '@/components/navigation/FH_Button';
import ScrollView = Animated.ScrollView;
import getAPI from '@/hooks/GetAPI';
import {useAuth} from "@/contexts/AuthContext";

const Profile = () => {
    const styles = useStyles();
    const allReports = getAPI('/reporting/user/get_all_reports_by_user');
    const currentUser = useAuth()
    console.log(allReports)
    console.log(currentUser)
    console.log(currentUser.token != "None")

    if (!allReports) {
        return <Text>Loading... {(currentUser.token != "None").toString()}</Text>;
    }

    const currentUsersReports = Object.values(allReports);
    console.log(currentUsersReports)
    console.log(allReports)

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Profile Page</Text>
            <UserAvatar size={100} imageLink={''} />
            <Text style={styles.nameText}>User Name</Text>
            <Text style={styles.bodyTextBold}>Reporting History</Text>

            <ScrollView style={{ height: '50%', width: '100%' }}>
                <View style={styles.reportCardsContainer}>
                    {currentUsersReports.map((report) => (
                        <ReportCard
                            key={report.key}
                            report={report}
                        />
                    ))}
                </View>
            </ScrollView>

            <FH_Button route='/(tabs)/newreport' text={'Create New Hazard Report'} />
        </View>
    );
};

export default Profile;
