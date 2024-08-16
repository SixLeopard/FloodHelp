import React from 'react';
import {Text, View} from "react-native";
import {useTheme} from "@/constants/ThemeProvider";
import useStyles from "@/constants/style";

const Connections = () => {
    const styles = useStyles();

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Connections Page</Text>
        </View>
    );
};

export default Connections;