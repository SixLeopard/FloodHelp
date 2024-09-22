import React, {useMemo} from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import useStyles from '@/constants/style';
import { useLocalSearchParams } from 'expo-router';
import useAPI from '@/hooks/useAPI';  // Renamed for hook convention

const ReportPage = () => {
    const { report_id } = useLocalSearchParams<{ report_id: string }>();
    const styles = useStyles();

    // useMemo remembers the formData so it's only created when `report_id` changes (this prevents the issue of repeatedly calling the API)
    const formData = useMemo(() => {
        const data = new FormData();
        data.append('report_id', report_id);
        return data;
    }, [report_id]);

    const reportData = useAPI(`/reporting/user/get_report`, formData);

    if (!reportData) {
        return (
            <View style={styles.page}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.bodyText}>Loading report details...</Text>
            </View>
        );
    }

    // Check for invalid account response
    if (reportData.invalid_account) {
        return (
            <View style={styles.page}>
                <Text style={styles.headerText}>Error</Text>
                <Text style={styles.bodyText}>This account is invalid or doesn't have permission to view this report.</Text>
            </View>
        );
    }

    // Extract report details from the response
    const { title, description, coordinates, datetime, area_name } = reportData;

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Report {report_id}'s Page</Text>
            <View>
                <Text style={styles.bodyTextBold}>Title: {title || 'No Title Found'}</Text>
                <Text style={styles.bodyText}>Description: {description || 'No Description Found'}</Text>
                <Text style={styles.bodyText}>Coordinates: {coordinates || 'No Coordinates Found'}</Text>
                <Text style={styles.bodyText}>Datetime: {datetime || 'No Date Available Found'}</Text>
            </View>
        </View>
    );
};

export default ReportPage;
