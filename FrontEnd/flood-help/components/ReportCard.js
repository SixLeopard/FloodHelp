import React from 'react';
import { View, Text, Pressable } from 'react-native';
import useStyles from '@/constants/style';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

const ReportCard = ({ report }) => {
    const styles = useStyles();
    const { theme } = useTheme();
    const colors = theme.colors;

    // Destructure the report object
    const { hazard_id, title, coordinates, datetime } = report;

    return (
        <View style={styles.reportCard}>
            <Pressable
                style={styles.userPressable}
                onPress={() =>
                    router.push({
                        pathname: '/reports/[report_id]',
                        params: { report_id: hazard_id },
                    })
                }
            >
                <View style={styles.reportCardBody}>
                    <Text style={styles.bodyTextBold}>#{hazard_id} | {title}</Text>
                    <Text style={styles.bodyTextDark}>{datetime}</Text>
                    {/*TODO: setup reverse geo-coding */}
                    <Text style={styles.bodyTextDark}>{coordinates}</Text>
                </View>
            </Pressable>
        </View>
    );
};

export default ReportCard;
