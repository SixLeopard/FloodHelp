import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import useStyles from "@/constants/style";
import { useTheme } from "@/contexts/ThemeContext";
import NotificationCard from "@/components/NotificationCard";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';

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
    headline: string;
    location: string;
    risk: string;
    certainty: string;
    start: string;
    end: string;
    coordinates: string;
}

const Notifications = () => {
    const styles = useStyles();
    const { theme } = useTheme();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [floodAlerts, setFloodAlerts] = useState<AlertData[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://54.206.190.121:5000/notifications/get', {
                method: 'GET',
            });
    
            const data = await response.json();
            
            // Log the response to ensure we're receiving the correct data
            console.log('Notifications Data:', data);
    
            // Extract the array of pending notifications
            const notificationsArray = data['current pending notifications'] || [];
    
            // If there are notifications, map them into a format that can be displayed
            if (notificationsArray.length > 0) {
                const formattedNotifications = notificationsArray.map((notificationContent: string) => ({
                    type: 'user', 
                    content: notificationContent,
                    timeOfNotification: new Date().toISOString(), // Add current time as the notification time
                }));
    
                setNotifications(formattedNotifications);
            } else {
                // If no notifications, set the notifications state as empty
                setNotifications([]);
            }
    
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch official flood alerts
    const fetchFloodAlerts = async () => {
        try {
            const response = await fetch('http://54.206.190.121:5000/externalData/get_alerts', {
                method: 'GET',
            });
            const floodAlertsData = await response.json();
            setFloodAlerts(floodAlertsData);
        } catch (error) {
            console.error('Error fetching flood alerts:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchFloodAlerts();
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
            <Text style={styles.headerText}>Notifications</Text>

            {notifications.length === 0 && floodAlerts.length === 0 ? (
                <Text>No notifications or alerts found</Text>
            ) : (
                <View>
                    {/* Display User Notifications */}
                    {notifications.map((notification, index) => (
                        <View key={index}>
                            <NotificationCard
                                type={notification.type === 'check_in' ? 'user' : 'warning'}
                                title={notification.type === 'check_in' ? "You received a Check-in request" : "Flood Alert"}
                                body={notification.content}
                                timeOfNotification={new Date(notification.timeOfNotification).toLocaleTimeString()}
                            />
                            {/* Buttons below the NotificationCard for Check In */}
                            {notification.receiverUid && (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.alertButton} onPress={() => handleCheckIn(notification.receiverUid!)}>
                                        <Text style={styles.alertButtonText}>Check In</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.alertButton} onPress={() => navigation.navigate('index')}>
                                        <Text style={styles.alertButtonText}>View on Map</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}

                    {/* Display Official Flood Alerts */}
                    {floodAlerts.map((alert, index) => (
                        <NotificationCard
                            key={index}
                            type="warning"
                            title={alert.headline}
                            body={`Risk: ${alert.risk}, Certainty: ${alert.certainty}, Location: ${alert.location}`}
                            timeOfNotification={new Date(alert.start).toLocaleTimeString()}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

export default Notifications;