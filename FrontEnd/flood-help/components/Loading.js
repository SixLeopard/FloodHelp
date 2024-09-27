import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import useStyles from '@/constants/style';

const Loading = ({ text = "Loading..." }) => {
    const styles = useStyles();
    return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color={styles.primaryColor} />
            <Text style={styles.bodyText}>{text}</Text>
        </View>
    );
};

export default Loading;
