import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import useStyles from "@/constants/style";
import UserAvatar from "@/components/UserAvatar";

/**
 * NotificationCard is a component that displays a notification message along with optional buttons for
 * user actions like marking themselves as safe, unsafe, or checking in.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {'user'|'warning'} props.type - The type of notification (either 'user' or 'warning').
 * @param {string} props.title - The title of the notification.
 * @param {string} props.body - The main content of the notification.
 * @param {string} props.timeOfNotification - The time when the notification was received.
 * @param {Function} [props.onCheckIn] - Function to handle the "Check In" button press.
 * @param {Function} [props.onViewMap] - Function to handle the "View Map" button press.
 * @param {Function} [props.onSafe] - Function to handle the "I'm Safe" button press.
 * @param {Function} [props.onUnsafe] - Function to handle the "I'm Unsafe" button press.
 * @returns {JSX.Element} A styled notification card component.
 */
const NotificationCard = ({ type, title, body, timeOfNotification, onCheckIn, onViewMap, onSafe, onUnsafe }) => {
    const styles = useStyles();

    return (
        <View style={styles.notificationCard}>
            {/* Display different icons based on type */}
            {type === 'user' && <UserAvatar />}
            {type === 'warning' && <MaterialIcons name="warning" style={styles.notifCautionIcon} />}

            <View style={styles.notificationBody}>
                <Text style={styles.bodyTextBold}>{title}</Text>
                <Text style={styles.bodyTextDark}> | {timeOfNotification}</Text>
                <Text style={styles.bodyTextDark}>{body}</Text>
                
                {/* Render buttons for onSafe and onUnsafe */}
                {onSafe && onUnsafe && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.safeButton} onPress={onSafe}>
                            <Text style={styles.alertButtonText}>I'm Safe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.unsafeButton} onPress={onUnsafe}>
                            <Text style={styles.alertButtonText}>I'm Unsafe</Text>
                        </TouchableOpacity>
                    </View>
                )}
                
                {/* Only render buttons if both onCheckIn and onViewMap are passed */}
                {onCheckIn && onViewMap && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.checkInButton} onPress={onCheckIn}>
                            <Text style={styles.alertButtonText}>Check In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.viewNotificationButton} onPress={onViewMap}>
                            <Text style={styles.alertButtonText}>View Map</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

export default NotificationCard;





