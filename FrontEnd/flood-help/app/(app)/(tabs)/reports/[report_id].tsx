import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import useStyles from '@/constants/style';
import { useLocalSearchParams } from 'expo-router';
import GetAPI from '@/hooks/GetAPI';

const ReportPage = () => {
    const { report_id } = useLocalSearchParams<{ report_id: string }>();
    const styles = useStyles();


    console.log(report_id)
    const reportData = GetAPI(`/reporting/user/get_report?report_id=${report_id}`);
    console.log(reportData)



    if (!reportData) {
        return (
            <View style={styles.page}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.bodyText}>Loading report details...</Text>
            </View>
        );
    }

    if (reportData.invalid_account) {
        return (
            <View style={styles.page}>
                <Text style={styles.headerText}>Error</Text>
                <Text style={styles.bodyText}>This account is invalid or doesn't have permission to view this report.</Text>
            </View>
        );
    }

    const { title, description, coordinates, datetime, area_name } = reportData;

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Report {report_id}'s Page</Text>
            <View >
                <Text style={styles.bodyTextBold}>Title: {title || 'No Title Found'}</Text>
                <Text style={styles.bodyText}>Description: {description || 'No Description Found'}</Text>
                <Text style={styles.bodyText}>Coordinates: {coordinates || 'No Coordinates Found'}</Text>
                <Text style={styles.bodyText}>Datetime: {datetime || 'No Date Available Found'}</Text>
            </View>
        </View>
    );
};

export default ReportPage;
