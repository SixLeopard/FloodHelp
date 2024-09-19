import React from 'react';
import { View, Text, Pressable } from 'react-native';
import useStyles from '@/constants/style';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

const ReportCard = ({ reportID, report }) => {
    const styles = useStyles();
    const { hazard_id, title, coordinates, datetime } = report;

console.log(report)
    return (
        <View style={styles.reportCard}>
            <Pressable
                style={styles.userPressable}
                onPress={() =>
                    router.push({
                        pathname: '/reports/[report_id]',
                        params: { report_id: reportID },
                    })
                }
            >
                <View style={styles.reportCardBody}>
                    <Text style={styles.bodyTextBold}>#{reportID} | {title}</Text>
                    <Text style={styles.bodyTextDark}>{datetime}</Text>
                    {/*TODO: setup reverse geo-coding */}
                    <Text style={styles.bodyTextDark}>{coordinates}</Text>
                </View>
            </Pressable>
        </View>
    );
};

export default ReportCard;
