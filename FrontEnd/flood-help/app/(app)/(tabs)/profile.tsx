import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Animated, RefreshControl, Modal, TouchableOpacity } from 'react-native';
import useStyles from '@/constants/style';
import UserAvatar from '@/components/UserAvatar';
import ReportCard from '@/components/ReportCard';
import FH_Button from '@/components/navigation/FH_Button';
import useAPI from '@/hooks/useAPI';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import MaterialCommunityIcons

const ScrollView = Animated.ScrollView;

const Profile = () => {
    const styles = useStyles(); // Fetching styles using the useStyles hook
    // Local state management
    const [refreshing, setRefreshing] = useState(false); // State to track refresh status
    const [refreshKey, setRefreshKey] = useState(0); // Key to trigger data refresh
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
    const [status, setStatus] = useState("Unknown"); // User status (e.g., Safe, Unsafe)
    const [time, setTime] = useState(null); // Time related to status check
    const [loading, setLoading] = useState(true); // Loading state for fetching data
    const [error, setError] = useState(null); // Error state for handling API errors

    const allReports = useAPI(`/reporting/user/get_all_reports_by_user?refreshKey=${refreshKey}`);
    const currentUser = useAPI('/accounts/get_current');
    const userStatus = useAPI('check_in/get_my_status');

    const fetchStatus = async () => {
        try {
            const response = await fetch('http://54.206.190.121:5000/check_in/get_my_status');
            const data = await response.json();
            setStatus(data.status);
            setTime(data.time);
        } catch (error) {
            setError('Error getting status');
            console.error('Error getting status:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchStatus();
            setLoading(false);
        };
        fetchData();
    }, [refreshKey]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshKey(prevKey => prevKey + 1);
        fetchStatus().finally(() => setRefreshing(false));
    }, []);

    const handleChangeStatus = async (newStatus) => {
        const formData = new FormData();
        formData.append('status', newStatus);

        try {
            const response = await fetch('http://54.206.190.121:5000/check_in/send', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            setStatus(newStatus);
        } catch (error) {
            setError('Error updating status');
            console.error('Error updating status:', error);
        } finally {
            setModalVisible(false);
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Profile Page</Text>
            <UserAvatar size={100} imageLink={''} />
            <Text style={styles.nameText}>{currentUser.name || "User Name"}</Text>

            <View style={styles.updateStatuBox}>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={status === "Safe" ? styles.SafeStatus_Button : styles.DefaultStatus_Button}
                >
                    <Text style={styles.buttonText}>Current Status: {status}</Text>
                    <Icon name="pencil" size={16} color="white" style={modalstyle.icon} />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={modalstyle.modalContainer}>
                    <View style={modalstyle.modalContent}>
                        <Text style={modalstyle.modalHeader}>Update Your Status</Text>
                        <TouchableOpacity onPress={() => handleChangeStatus('Safe')}>
                            <Text style={modalstyle.modalButton}>Mark Safe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleChangeStatus('Unsafe')}>
                            <Text style={modalstyle.modalButton}>Mark Unsafe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={modalstyle.modalCancel}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Text style={styles.bodyTextBold}>My Reporting History</Text>

            <ScrollView
                style={{ height: '50%', width: '100%' }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.reportCardsContainer}>
                    {Object.entries(allReports).map(([key, report]) => (
                        <ReportCard
                            key={key}
                            reportID={key}
                            report={report}
                        />
                    ))}
                </View>
            </ScrollView>

            <Text />
            <FH_Button route='/(tabs)/newreport' text={'Create New Hazard Report'} />
            <Text />
        </View>
    );
};

export default Profile;

// Modal styles remain unchanged
const modalstyle = {
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButton: {
        fontSize: 16,
        color: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 10,
        textAlign: 'center',
    },
    modalCancel: {
        fontSize: 16,
        color: 'red',
        marginTop: 20,
        textAlign: 'center',
    },
    statusButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        flexDirection: 'row', // Align items in a row
        alignItems: 'center',  // Center vertically
        justifyContent: 'space-between', // Space between text and icon
    },
    icon: {
        marginLeft: 10, // Add space between text and icon
    },
};
