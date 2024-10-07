import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, ActivityIndicator, ScrollView, RefreshControl, BackHandler } from 'react-native';
import useStyles from "@/constants/style";
import { useTheme } from "@/contexts/ThemeContext";
import NotificationCard from "@/components/NotificationCard";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    index: undefined;
};

type Notification = {
    type: string;
    content: string;
    timeOfNotification: string;
    receiverUid?: string;
};

interface AlertData {
    id: number;
    description: string;
    area: string;
    riskLevel: string;
    certainty: string;
    effectiveFrom: string;
    effectiveUntil: string;
    coordinates: string;
}

interface FloodReport {
    area_name: string | null;
    coordinates: string;
    datetime: string;
    description: string;
    hazard_id: number;
    img: string | null;
    reporting_user_id: number;
    title: string;
}

interface CheckInStatus {
    uid: number;
    name: string;
    status: string;
    updateTime: string;
}

const Notifications = () => {
    const styles = useStyles();
    const { theme } = useTheme();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [floodAlerts, setFloodAlerts] = useState<AlertData[]>([]);
    const [floodReports, setFloodReports] = useState<FloodReport[]>([]);
    const [checkInStatuses, setCheckInStatuses] = useState<CheckInStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch data function
    const fetchData = async () => {
        await Promise.all([fetchNotifications(), fetchFloodAlerts(), fetchFloodReports(), fetchCheckInStatuses()]);
        setLoading(false);
    };

    // Fetch notifications
const fetchNotifications = async () => {
    try {
        const response = await fetch('http://54.206.190.121:5000/notifications/get', {
            method: 'GET',
        });

        const textResponse = await response.text(); // Fetch raw response as text
        console.log('Raw Notification Response:', textResponse); // Log the raw response

        // Manually add quotes around object keys and convert single quotes to double quotes
        const fixedTextResponse = textResponse
            .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')  // Add quotes around keys
            .replace(/'/g, '"');  // Convert single quotes to double quotes

        try {
            const data = JSON.parse(fixedTextResponse);
            console.log('Parsed Notification Data:', data);

            const notificationsArray = data['current pending notifications'] || [];
            if (notificationsArray.length > 0) {
                const formattedNotifications = notificationsArray.map((notificationContent: string) => ({
                    type: 'user',
                    content: notificationContent,
                    timeOfNotification: new Date().toISOString(),
                }));
                setNotifications(formattedNotifications);
            } else {
                setNotifications([]);
            }
        } catch (jsonError) {
            console.error('Error parsing notification response as JSON:', jsonError);
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};


    // Fetch official flood alerts
    const fetchFloodAlerts = async () => {
        try {
            const response = await fetch('http://54.206.190.121:5000/externalData/get_alerts', {
                method: 'GET',
            });
            const floodAlertsData = await response.json();

            const formattedFloodAlerts = floodAlertsData.map((alert: any[]) => ({
                id: alert[0],
                description: alert[1],
                area: alert[2],
                riskLevel: alert[3],
                certainty: alert[4],
                effectiveFrom: alert[5],
                effectiveUntil: alert[6],
                coordinates: alert[7]
            }));

            setFloodAlerts(formattedFloodAlerts);
        } catch (error) {
            console.error('Error fetching flood alerts:', error);
        }
    };

    // Fetch reported flood details
    const fetchFloodReports = async () => {
        try {
            const response = await fetch('http://54.206.190.121:5000/reporting/user/get_all_report_details', {
                method: 'GET',
            });
            const floodReportsData = await response.json();
            const formattedReports = Object.values(floodReportsData) as FloodReport[];

            setFloodReports(formattedReports);
        } catch (error) {
            console.error('Error fetching flood reports:', error);
        }
    };

    // Fetch check-in statuses
    const fetchCheckInStatuses = async () => {
        try {
            const response = await fetch('http://54.206.190.121:5000/check_in/get_checkins', {
                method: 'GET',
            });

            const checkInsData = (await response.json()) as { [uid: string]: [[string, string], string] };

            const formattedCheckIns = Object.entries(checkInsData).map(([uid, [[status, updateTime], name]]) => ({
                uid: parseInt(uid, 10),
                name,
                status,
                updateTime,
            }));

            setCheckInStatuses(formattedCheckIns);
        } catch (error) {
            console.error('Error fetching check-in statuses:', error);
        }
    };

    // Refresh function for pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData().then(() => setRefreshing(false));
    }, []);

    // Handle check-in submission
    const handleCheckIn = (receiverUid: string) => {
        const formData = new FormData();
        formData.append('notification', 'Are you safe?');
        formData.append('receiver', receiverUid);
    
        fetch('http://54.206.190.121:5000/notifications/add', {
            method: 'POST',
            body: formData,  
        })
        .then(async (response) => {
            if (response.ok) {
                // Check if the content is actually JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return response.json(); 
                } else {
                    return response.text(); 
                }
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then((data) => {
            console.log('Notification response:', data);
            Alert.alert('Notification sent', 'Check-in request sent successfully.');
        })
        .catch((error) => {
            console.error('Error sending check-in notification:', error);
        });
    };
    
    // Handle back button press
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('index'); // Always navigate to index
                return true; // Prevent default back button behavior
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [navigation])
    );

    if (loading) {
        return (
            <View style={[styles.page, { flex: 1 }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ textAlign: "center", marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={[styles.page]}>
                <Text style={[styles.headerText, { color: theme.colors.text }]}>Notification</Text>
                {notifications.length === 0 && floodAlerts.length === 0 && floodReports.length === 0 && checkInStatuses.length === 0 ? (
                    <Text>No notifications or alerts found</Text>
                ) : (
                    <View>
                        {/* Display User Notifications */}
                        {notifications.map((notification, index) => (
                            <View key={index}>
                                <NotificationCard
                                    type="user"
                                    title="Notification"
                                    body={notification.content}
                                    timeOfNotification={new Date(notification.timeOfNotification).toLocaleTimeString()}
                                    onCheckIn={undefined} 
                                    onViewMap={undefined}
                                />
                            </View>
                        ))}

                        {/* Display Official Flood Alerts */}
                        {floodAlerts.map((alert, index) => (
                            <NotificationCard
                                key={index}
                                type="warning"
                                title={`Official Flood Alert | ${alert.area}`}
                                body={`Risk: ${alert.riskLevel}, Certainty: ${alert.certainty}`}
                                timeOfNotification={new Date(alert.effectiveFrom).toLocaleTimeString()}
                                onCheckIn={undefined} 
                                onViewMap={undefined}
                            />
                        ))}

                        {/* Display Reported Floods */}
                        {floodReports.map((report, index) => (
                            <NotificationCard
                                key={index}
                                type="warning"
                                title={`Reported Flood | ${report.title || "Unknown"}`}
                                body={`Description: ${report.description || "No description provided"}`}
                                timeOfNotification={report.datetime}
                                onCheckIn={undefined} 
                                onViewMap={undefined}
                            />
                        ))}

                        {/* Display Check-In Statuses */}
                        {checkInStatuses.map((status, index) => (
                            <NotificationCard
                                key={index}
                                type="user"
                                title={`Check-In Status | ${status.name}`}
                                body={`Status: ${status.status}`}
                                timeOfNotification={new Date(status.updateTime).toLocaleTimeString()}
                                onCheckIn={() => handleCheckIn(String(status.uid))}
                                onViewMap={() => navigation.navigate('index')}
                            />
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default Notifications;

