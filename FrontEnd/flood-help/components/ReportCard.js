import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import useStyles from '@/constants/style';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { handleReverseGeo } from '@/services/reverseGeo';
import {formatDateTime} from "@/services/DateTimeFormatter";

const ReportCard = ({ reportID, report }) => {
    const styles = useStyles();
    let { hazard_id, title, coordinates, datetime } = report;
    const [address, setAddress] = useState('Loading address...');
    datetime = formatDateTime(datetime);

    useEffect(() => {
        const fetchAddress = async () => {
            const addr = await handleReverseGeo(coordinates);
            setAddress(addr);
        };
        fetchAddress();
    }, [coordinates]);

    return (
        <View style={styles.reportCard}>
            <Pressable
                style={styles.userPressable}
                onPress={() =>
                    router.push({
                        pathname: '/reports/[report_id]',
                        params: { report_id: reportID, address: address},
                    })
                }
            >
                <View style={styles.reportCardBody}>
                    <Text style={styles.bodyTextBold}>#{reportID} | {title}</Text>
                    <Text style={styles.bodyTextDark}>{datetime}</Text>
                    <Text style={styles.bodyTextDark}>{address}</Text>
                </View>
            </Pressable>
        </View>
    );
};

export default ReportCard;
