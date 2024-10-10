import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import useStyles from "@/constants/style";
import { useTheme } from "@/contexts/ThemeContext";
import NotificationCard from "@/components/NotificationCard";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    index: undefined;
};

type Notification = {
    type: string;
    title: string;
    body: string;
    timeOfNotification: string;
    receiverUid?: string;
};

const Notifications = () => {
    const styles = useStyles();
    const { theme } = useTheme();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://54.206.190.121:5000/notifications/get', {
                method: 'GET',
            });
            const notificationsData = await response.json();
            setNotifications(notificationsData);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleCheckIn = (receiverUid: string) => {
        // Logic to send check-in notification
        fetch('http://54.206.190.121:5000/notifications/add', {
            method: 'POST',
            body: new URLSearchParams({
                notification: 'Are you safe?',
                receiver: receiverUid
            })
        })
        .then(response => response.json())
        .then(() => {
            Alert.alert('Notification sent', 'Check-in request sent successfully.');
        })
        .catch(error => {
            console.error('Error sending check-in notification:', error);
        });
    };

    if (loading) {
        return (
            <View style={styles.page}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ textAlign: "center", marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Notifications Page</Text>

            {notifications.length === 0 ? (
                <Text>No notifications found</Text>
            ) : (
                notifications.map((notification, index) => {
                    if (notification.type === 'flood_alert') {
                        return (
                            <NotificationCard
                                key={index}
                                type="warning"
                                title={notification.title}
                                body={notification.body}
                                timeOfNotification={notification.timeOfNotification}
                            />
                        );
                    } else if (notification.type === 'check_in') {
                        return (
                            <View key={index} style={{ marginBottom: 20 }}>
                                <NotificationCard
                                    type="user"
                                    title={notification.title}
                                    body={notification.body}
                                    timeOfNotification={notification.timeOfNotification}
                                />
                                {/* Buttons below the NotificationCard */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <TouchableOpacity onPress={() => handleCheckIn(notification.receiverUid!)}>
                                        <Text style={styles.buttonText}>Check In</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('index')}>
                                        <Text style={styles.buttonText}>View on Map</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }
                    return null;
                })
            )}
        </View>
    );
};

export default Notifications;