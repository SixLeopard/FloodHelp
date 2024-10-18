import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import useStyles from '@/constants/style';
import { useLocalSearchParams } from 'expo-router';
import MapView from "react-native-maps";
import { formatDateTime } from "@/services/DateTimeFormatter";
import { useTheme } from "@/contexts/ThemeContext";
import { baseURL } from '@/constants/baseurl';

/**
 * Report page displays a retrieved report using the /reporting/user/get_report API call.
 * With details from the database.
 * @constructor
 */
const ReportPage = () => {
    const { report_id, address } = useLocalSearchParams<{ report_id: string, address: string }>();
    const styles = useStyles();
    const theme = useTheme();

    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const baseUrl = baseURL;

    const fetchReportData = async () => {
        setRefreshing(true);
        setLoading(true);

        const formData = new FormData();
        formData.append('report_id', report_id);
        console.log(report_id);

        try {
            const response = await fetch(baseUrl + `/reporting/user/get_report`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.log(response.json())
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            setReportData(data);
        } catch (error) {
            console.error("Error fetching report data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, []);

    // Loading state
    if (loading) {
        return (
            <View style={styles.page}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.bodyText}>Loading report details...</Text>
            </View>
        );
    }

    // Invalid account handling
    if (reportData === "invalid_account") {
        return (
            <View style={styles.page}>
                <Text style={styles.headerText}>Error</Text>
                <Text style={styles.bodyText}>This account is invalid or doesn't have permission to view this report.</Text>
            </View>
        );
    }


    const {description, coordinates, datetime, area_name, title, type} = reportData;
    const [latStr, longStr] = (coordinates as string).replace(/[()]/g, '').split(',');
    return (
        <ScrollView
            contentContainerStyle={styles.page}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={fetchReportData}
                />
            }
        >
            <Text style={styles.headerText}>{title || 'No Title Found'}</Text>
            <View>
                <Text style={styles.bodyTextBold}> {type} reported {formatDateTime(datetime) || 'No date/time Found'}</Text>
                <Text style={styles.bodyText}>Description: {description || 'No Description Found'}</Text>
                <Text style={styles.bodyText}>Address: {address || 'No Address Found'}</Text>

                <MapView
                    style={styles.reportMap}
                    //specify our coordinates.
                    initialRegion={{
                        latitude: parseFloat(latStr)|| 37.78825, // Fallback
                        longitude: parseFloat(longStr) || -122.4324, // Fallback
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            </View>
        </ScrollView>
    );
};

export default ReportPage;
