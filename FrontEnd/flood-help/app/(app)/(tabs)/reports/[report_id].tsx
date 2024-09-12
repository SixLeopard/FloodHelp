import React from 'react';
import {Text, View} from "react-native";
import useStyles from "@/constants/style";
import {useLocalSearchParams} from "expo-router";

const ReportPage = () => {
    const {report_id} = useLocalSearchParams<{ report_id: string }>();
    const styles = useStyles();


    return (
        <View style={styles.page}>
        <Text style={styles.headerText}>Report {report_id}'s Page</Text>

    </View>
);
};

export default ReportPage;