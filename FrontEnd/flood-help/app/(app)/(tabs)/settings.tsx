import React, { useState } from 'react'; // Added useState import
import { View, Text, Switch , TouchableOpacity} from 'react-native'; // Added TouchableOpacity import
import { useTheme } from '@/contexts/ThemeContext';
import useStyles from "@/constants/style";
import {useAuth} from "@/contexts/AuthContext";


export default function SettingsScreen() {
    const { theme, toggleTheme } = useTheme();
    const styles = useStyles();
    const { signOut } = useAuth();

    // State for notification switches
    const [familyStatus, setFamilyStatus] = useState(true);
    const [floodingAlert, setFloodingAlert] = useState(true);
    const [textAlerts, setTextAlerts] = useState(true);

    return (
        <View style={styles.page}>
            {/* Settings Header */}
            <Text style={styles.headerText}>Settings</Text>
            
            {/* Display Section with Box */}
            <View style={styles.boxContainer}>
                <Text style={styles.subHeaderText}>Display</Text>
                <View style={styles.rowContainerSetting}>
                    <Text style={styles.bodyText}>Light Mode</Text>
                    <Switch
                        value={!theme.dark} // Toggle Light Mode
                        onValueChange={toggleTheme}
                    />
                </View>
            </View>

            {/* Notification Center Section with Box */}
            <View style={styles.boxContainer}>
                <Text style={styles.subHeaderText}>Notification Center</Text>

                {/* Family Status Notification */}
                <View style={styles.rowContainerSetting}>
                    <Text style={styles.bodyText}>Family Status</Text>
                    <Switch
                        value={familyStatus}
                        onValueChange={setFamilyStatus}
                    />
                </View>

                {/* Flooding Alert Notification */}
                <View style={styles.rowContainerSetting}>
                    <Text style={styles.bodyText}>Flooding Alert</Text>
                    <Switch
                        value={floodingAlert}
                        onValueChange={setFloodingAlert}
                    />
                </View>

                {/* Text Alerts Notification */}
                <View style={styles.rowContainerSetting}>
                    <Text style={styles.bodyText}>Text Alerts</Text>
                    <Switch
                        value={textAlerts}
                        onValueChange={setTextAlerts}
                    />
                </View>
            </View>

            {/* Log Out Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <Text style={styles.logoutButtonText}>Log out</Text>
            </TouchableOpacity>
        </View>
    );
}
