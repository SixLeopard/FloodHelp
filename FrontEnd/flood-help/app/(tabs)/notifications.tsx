import React from 'react';
import {Text, View} from "react-native";

import useStyles from "@/constants/style";
import NotificationCardUser from "@/components/NotificationCardUser";
import NotificationCardWarning from "@/components/NotificationCardWarning";
import NotificationCard from "@/components/NotificationCard";

const Notifications = () => {
    const styles = useStyles();
    // TODO: load notifcations dynamically (sort by most recent)
    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Notifications Page</Text>
            <NotificationCard
                type="user"
                title={"Bob Tester"}
                body="Bob has marked themselves safe"
                timeOfNotification={'10:00am'}
            />
            <NotificationCard
                type="warning"
                title={"Flood Alert"}
                body="Expected flooding in St Lucia today from 9am."
                timeOfNotification={"6:00am"}
            />

        </View>
    );
};

export default Notifications;