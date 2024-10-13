import React, { useState, useCallback } from 'react';
import { View, Text, Animated, RefreshControl } from 'react-native';
import useStyles from '@/constants/style';
import UserAvatar from '@/components/UserAvatar';
import ReportCard from '@/components/ReportCard';
import FH_Button from '@/components/navigation/FH_Button';
import useAPI from '@/hooks/useAPI';
import * as Location from "expo-location";

const ScrollView = Animated.ScrollView;

const Profile = () => {
    const styles = useStyles();
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Use this to trigger re-fetch

    const allReports = useAPI(`/reporting/user/get_all_reports_by_user?refreshKey=${refreshKey}`);
    const currentUser = useAPI('/accounts/get_current')

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshKey(prevKey => prevKey + 1);
        setRefreshing(false);
    }, []);


    if (!allReports || !currentUser) {
        return <Text>Loading...</Text>;
    }


    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Profile Page</Text>
            <UserAvatar size={100} imageLink={''} />
            <Text style={styles.nameText}>{currentUser.name}</Text>
            <Text style={styles.bodyTextBold}>My Reporting History</Text>

            <ScrollView
                style={{ height: '50%', width: '100%' }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.reportCardsContainer}>
                    {Object.entries(allReports).map(([key, report]) => (
                        <ReportCard
                            key={key}
                            reportID={key}
                            report={report}
                        />
                    ))}
                </View>
            </ScrollView>
<Text/>
            <FH_Button route='/(tabs)/newreport' text={'Create New Hazard Report'} />
            <Text></Text>
        </View>
    );
};

export default Profile;
