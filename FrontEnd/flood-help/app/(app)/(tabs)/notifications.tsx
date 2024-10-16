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

    // Refresh function for pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData().then(() => setRefreshing(false));
    }, []);

    // Fetch data function
    const fetchData = async () => {
        await Promise.all([fetchNotifications(), fetchFloodAlerts(), fetchCheckInStatuses()]);
        setLoading(false);
    };

    // Fetch notifications and replace UID with the corresponding username
    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://54.206.190.121:5000/notifications/get', {
                method: 'GET',
            });

            const data = await response.json();
            console.log('Parsed Notification Data:', data);

            const notificationsString = data['current pending notifications'];
            const sanitizedNotifications = notificationsString.replace(/'/g, '"');
            console.log('Sanitized Notifications:', sanitizedNotifications);

            try {
                const notificationsArray = JSON.parse(sanitizedNotifications);
                console.log('Notifications Array:', notificationsArray);

                if (notificationsArray.length > 0) {
                    const formattedNotifications = notificationsArray.map((notificationContent: string) => {
                        const uidMatch = notificationContent.match(/(\d+)\s+has/);
                        let userName = 'Unknown User';

                        if (uidMatch) {
                            const uid = uidMatch[1]; 
                            const userStatus = checkInStatuses.find(status => status.uid === parseInt(uid));

                            if (userStatus) {
                                userName = userStatus.name;
                            }
                            notificationContent = notificationContent.replace(uid, userName);
                        }

                        return {
                            type: 'user',
                            content: notificationContent,
                            timeOfNotification: new Date().toISOString(),
                        };
                    });

                    setNotifications(formattedNotifications);
                } else {
                    setNotifications([]);
                }
            } catch (parseError) {
                console.error('Error parsing notifications array:', parseError);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Handle status update
    const updateNotificationStatus = async (status: string) => {
        try {
            const formData = new FormData();
            formData.append('status', status);

            const response = await fetch('http://54.206.190.121:5000/check_in/send', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert(`Status updated to ${status}.`);
            } else {
                throw new Error('Failed to update status.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            Alert.alert('Error', 'Failed to update status.');
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

    // Handle check-in submission with user's name
    const handleCheckIn = (receiverUid: string) => {
        // Look up the name based on the receiverUid
        const userStatus = checkInStatuses.find(status => status.uid === parseInt(receiverUid));
        const userName = userStatus?.name || "Unknown User";

        const formData = new FormData();
        formData.append('reciever', receiverUid); 

        fetch('http://54.206.190.121:5000/check_in/send_push', { 
            method: 'POST',
            body: formData,
        })
        .then(async (response) => {
            if (response.ok) {
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
            Alert.alert('Check-In Sent', `Check-in notification sent to ${userName}.`);
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
        <View style={styles.page}>
            {/* Fixed Title */}
            <Text style={[styles.headerText, { color: theme.colors.text }]}>Notification</Text>

            {/* Scrollable Content */}
            <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={styles.scrollContainer} // Added to ensure proper alignment
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.cardsContainer}>
                    {notifications.length === 0 && floodAlerts.length === 0 && floodReports.length === 0 && checkInStatuses.length === 0 ? (
                        <Text>No notifications or alerts found</Text>
                    ) : (
                        <>
                            {notifications.map((notification, index) => (
                                <View key={index} style={styles.cardWrapper}>
                                    <NotificationCard
                                        type="user"
                                        title="Notification | Received"
                                        body={notification.content}
                                        timeOfNotification={new Date(notification.timeOfNotification).toLocaleTimeString()}
                                        onSafe={() => updateNotificationStatus('Safe')}
                                        onUnsafe={() => updateNotificationStatus('Unsafe')}
                                        onCheckIn={undefined}
                                        onViewMap={undefined}
                                    />
                                </View>
                            ))}

                            {checkInStatuses.map((status, index) => (
                                <View key={index} style={styles.cardWrapper}>
                                    <NotificationCard
                                        type="user"
                                        title={`Check-In Status | ${status.name}`}
                                        body={`Status: ${status.status}`}
                                        timeOfNotification={new Date(status.updateTime).toLocaleTimeString()}
                                        onCheckIn={() => handleCheckIn(String(status.uid))} 
                                        onViewMap={() => navigation.navigate('index')}
                                        onSafe={undefined}
                                        onUnsafe={undefined}
                                    />
                                </View>
                            ))}


                            {floodAlerts.map((alert, index) => (
                                <View key={index} style={styles.cardWrapper}>
                                    <NotificationCard
                                        type="warning"
                                        title={`Official Flood Alert | ${alert.area}`}
                                        body={`Risk: ${alert.riskLevel}, Certainty: ${alert.certainty}`}
                                        timeOfNotification={new Date(alert.effectiveFrom).toLocaleTimeString()}
                                        onCheckIn={undefined}
                                        onViewMap={undefined}
                                        onSafe={undefined}
                                        onUnsafe={undefined}
                                    />
                                </View>
                            ))}

                            {floodReports.map((report, index) => (
                                <View key={index} style={styles.cardWrapper}>
                                    <NotificationCard
                                        type="warning"
                                        title={`Reported Flood | ${report.title || "Unknown"}`}
                                        body={`Description: ${report.description || "No description provided"}`}
                                        timeOfNotification={report.datetime}
                                        onCheckIn={undefined}
                                        onViewMap={undefined}
                                        onSafe={undefined}
                                        onUnsafe={undefined}
                                    />
                                </View>
                            ))}
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default Notifications;