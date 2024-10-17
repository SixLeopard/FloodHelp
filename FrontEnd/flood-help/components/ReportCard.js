import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import useStyles from '@/constants/style';

import { router } from 'expo-router';
import { handleReverseGeo } from '@/services/reverseGeo';
import {formatDateTime} from "@/services/DateTimeFormatter";
import {FontAwesome, MaterialCommunityIcons} from "@expo/vector-icons";

/**
 * ReportCard is the template for each card that shows details of the reports retrieved from the database.
 * It is called for every report in the database to be displayed on the profile page.
 * @param reportID - the ID of the relevant report
 * @param report - the details of the report (JSON format)
 * @returns {Element}
 */
const ReportCard = ({ reportID, report }) => {
    const styles = useStyles();
    let { hazard_id, title, coordinates, datetime, type } = report;
    const [address, setAddress] = useState('Loading address...');
    datetime = formatDateTime(datetime);

    let iconColour;

    if (type == null) {
        iconColour = "blue"
    } else if (type.includes('Major Flood')) {
        iconColour = 'maroon';
    } else if (type.includes('Moderate Flood')) {
        iconColour =  'darkorange';
    } else if (type.includes('Minor Flood')) {
        iconColour =  'goldenrod';
    } else {
        iconColour =  'maroon';
    }


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
                    <Text style={styles.bodyTextBold}>{title || "title not found"}</Text>
                    <Text style={styles.bodyTextDark}>{datetime}</Text>
                    <Text style={styles.bodyTextDark}>{address}</Text>
                </View>

                <FontAwesome name="exclamation-circle" size={50} color={iconColour} />
            </Pressable>
        </View>
    );
};

export default ReportCard;
