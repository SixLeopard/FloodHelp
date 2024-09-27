import React from 'react';
import { Text } from 'react-native';
import FH_Button from '@/components/navigation/FH_Button';
import useStyles from "@/constants/style";
const EmptyState = ({ message, buttonText, buttonRoute }) => {
    const styles = useStyles();
    return (
        <>
            <Text style={styles.bodyText}>{message}</Text>
            {buttonText && <FH_Button route={buttonRoute} text={buttonText} />}
        </>
    );
};

export default EmptyState;
