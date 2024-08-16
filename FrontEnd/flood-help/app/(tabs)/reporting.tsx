import React from 'react';
import {View, Text} from "react-native";
import {useTheme} from "@/constants/ThemeProvider";
import useStyles from "@/constants/style";

const Reporting = () => {
    const styles = useStyles();

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Reporting Page </Text>
        </View>
    );
};

export default Reporting;