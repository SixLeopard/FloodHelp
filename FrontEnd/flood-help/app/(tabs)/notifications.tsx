import React from 'react';
import {Text, View} from "react-native";

import useStyles from "@/constants/style";
import NotificationCardUser from "@/components/NotificationCardUser";
import NotificationCardWarning from "@/components/NotificationCardWarning";

const Notifications = () => {
    const styles = useStyles();
    // TODO: load notifcations dynamically (sort by most recent)
    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Notifications Page</Text>
            <NotificationCardUser username={"Bob Tester"} timeOfNotification={"10:00am"}></NotificationCardUser>
            <NotificationCardWarning warning={"Flood Alert"} timeOfNotification={"6:00am"}></NotificationCardWarning>
        </View>
    );
};

export default Notifications;