import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import useStyles from '@/constants/style';
import { useLocalSearchParams } from 'expo-router';
import GetAPI from '@/hooks/GetAPI';

const ReportPage = () => {
    const { report_id } = useLocalSearchParams<{ report_id: string }>();
    const styles = useStyles();

    const reportData = GetAPI('/reporting/user/get_report', { report_id });

    // console.log(reportData)

    // Destructure the fetched report data
    const { title, description, coordinates, datetime, area_name } = reportData;

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Report {report_id}'s Page</Text>

            {/* Display the report details */}
            {reportData ? (
                <View style={styles.reportDetails}>
                    <Text style={styles.bodyTextBold}>Title: {title}</Text>
                    <Text style={styles.bodyText}>Description: {description}</Text>
                    <Text style={styles.bodyText}>Coordinates: {coordinates}</Text>
                    <Text style={styles.bodyText}>Datetime: {datetime}</Text>
                    {area_name && <Text style={styles.bodyText}>Area: {area_name}</Text>}
                </View>
            ) : (
                <Text>No report details available</Text>
            )}
        </View>
    );
};

export default ReportPage;
