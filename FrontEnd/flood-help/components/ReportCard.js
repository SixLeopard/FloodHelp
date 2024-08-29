import React from 'react';
import {View, Text, Pressable} from "react-native";
import useStyles from "@/constants/style";
import { useTheme } from "@/constants/ThemeProvider";
import {router} from "expo-router";
import UserAvatar from "@/components/UserAvatar";
import {MaterialIcons} from "@expo/vector-icons";

const ReportCard = ({ type, location, reportID, time}) => {
    const styles = useStyles();
    const { theme } = useTheme();
    const colors = theme.colors;

    return (
        <View style={styles.notificationCard}>
            <Pressable style ={styles.userPressable}
                       onPress={() => router.push({
                           pathname: '/reports/[report_id]',
                           params: {report_id : reportID}
                       })
                       }>


                    <View style={styles.notificationBody}>
                        <Text>
                            <Text style={styles.bodyTextBold}>Report #{reportID}</Text>
                            <Text> | </Text>
                            <Text style={styles.bodyTextDark}>{location}</Text>
                        </Text>
                        <Text style={styles.bodyTextDark}>{time}</Text>
                    </View>




            </Pressable>

        </View>
    );
};

export default ReportCard;
