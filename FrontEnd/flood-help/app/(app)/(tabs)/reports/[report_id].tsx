import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import useStyles from '@/constants/style';
import { useLocalSearchParams } from 'expo-router';
import useAPI from '@/hooks/useAPI';

/**
 * Report page displays a retrieved report using the /reporting/user/get_report API call.
 * With details from the database.
 * @constructor
 */
const ReportPage = () => {
    const { report_id, address } = useLocalSearchParams<{ report_id: string, address: string }>();
    const styles = useStyles();

    // useMemo to prepare the formData
    const formData = useMemo(() => {
        const data = new FormData();
        data.append('report_id', report_id);
        return data;
    }, [report_id]);

    const reportData = useAPI(`/reporting/user/get_report`, formData);

    // Loading state
    if (!reportData) {
        return (
            <View style={styles.page}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.bodyText}>Loading report details...</Text>
            </View>
        );
    }

    // Invalid account handling
    if (reportData == "invalid_account") {
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
            <View>
                <Text style={styles.bodyTextBold}>Title: {title || 'No Title Found'}</Text>
                <Text style={styles.bodyText}>Description: {description || 'No Description Found'}</Text>
                <Text style={styles.bodyText}>Address: {address || 'No Address Found'}</Text>
                <Text style={styles.bodyText}>Datetime: {datetime || 'No Date Available Found'}</Text>
            </View>
        </View>
    );
};

export default ReportPage;
