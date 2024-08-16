import React from 'react';
import {Text, View} from "react-native";

import useStyles from "@/constants/style";

const Notifications = () => {
    const styles = useStyles();

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Notifications Page</Text>
        </View>
    );
};

export default Notifications;