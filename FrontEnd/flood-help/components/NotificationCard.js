import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import useStyles from "@/constants/style";
import UserAvatar from "@/components/UserAvatar";

const NotificationCard = ({ type, title, body, timeOfNotification, onCheckIn, onViewMap }) => {
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
                {/* Only render buttons if both onCheckIn and onViewMap are passed */}
                {onCheckIn && onViewMap && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.checkInButton} onPress={onCheckIn}>
                            <Text style={styles.alertButtonText}>Check In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.viewNotificationButton} onPress={onViewMap}>
                            <Text style={styles.alertButtonText}>View on Map</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

export default NotificationCard;





