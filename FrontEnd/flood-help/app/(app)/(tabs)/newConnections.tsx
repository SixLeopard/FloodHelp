import React, {useCallback, useEffect, useState} from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert,
    RefreshControl,
    Animated
} from "react-native";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";
import FH_Button from "@/components/navigation/FH_Button";
import useAPI from "@/hooks/useAPI";
import ScrollView = Animated.ScrollView;

const NewConnections = ({ navigation }) => {
    const styles = useStyles();
    const relationships = useAPI(`/relationships/get_relationships`);
    const currentUser = useAPI('/accounts/get_current');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [refreshing, setRefreshing] = useState(false); // State for refreshing
    const [refreshKey, setRefreshKey] = useState(0); // Trigger for refreshing

    // Handle user search and send a connection request
    const handleUserSearch = async (email) => {
        setLoading(true);
        setFeedbackMessage(null); // Reset feedback message

        if (!validateEmail(email)) {
            setFeedbackMessage({ type: 'error', message: 'Please enter a valid email address.' });
            setLoading(false);
            return;
        }

        let url = "http://54.206.190.121:5000/relationships/create";
        const formData = new FormData();
        formData.append('requestee_email', email);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            // Handle different response cases
            handleApiResponse(result);

        } catch (error) {
            setFeedbackMessage({ type: 'error', message: 'Error with API call. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    // Handle various API responses
    const handleApiResponse = (response) => {
        if (response.success) {
            setFeedbackMessage({ type: 'success', message: 'Connection request sent successfully!' });
        } else if (response.user_does_not_exist) {
            setFeedbackMessage({ type: 'error', message: 'User does not exist.' });
        } else if (response.relationship_exists) {
            setFeedbackMessage({ type: 'error', message: 'Error: Relationship already exists.' });
        } else if (response.self_relationship) {
            setFeedbackMessage({ type: 'error', message: 'Error: You cannot connect with yourself.' });
        } else if (response['database error']) {
            setFeedbackMessage({ type: 'error', message: `Database error: ${response['database error']}` });
        } else if (response.invalid_account) {
            setFeedbackMessage({ type: 'error', message: 'Error: Invalid account. Please log in.' });
        } else if (response.invalid_request) {
            setFeedbackMessage({ type: 'error', message: 'Error: Invalid request method.' });
        } else {
            setFeedbackMessage({ type: 'error', message: 'Unknown error occurred. Please try again' });
        }
    };

    // Basic email validation function
    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true); // Start refreshing
        setRefreshKey(prevKey => prevKey + 1); // Increment refresh key to refetch data
    }, []);

    // Stop refreshing after data is fetched
    useEffect(() => {
        if (relationships && currentUser) {
            setRefreshing(false); // Stop the spinner once data is loaded
        }
    }, [relationships, currentUser]);

    if (!relationships || !currentUser) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading data...</Text>
            </View>
        );
    }



    return (
        <View style={styles.page}>
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                alignItems: 'center', // Center content horizontally
                justifyContent: 'center' // Center content vertically
            }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Text style={styles.headerText}>Add Connections</Text>
            <Text style={styles.bodyText}>
                Connections can send you check-in requests and see your location during emergencies.
            </Text>


            {/* Email Input Field */}
            <TextInput
                style={styles.inputBoxSignInPage}
                value={email}
                onChangeText={setEmail}
                placeholder="floodhelp@example.com"
                placeholderTextColor="#ccc"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Feedback Message Display */}
            {feedbackMessage && (
                <Text style={feedbackMessage.type === 'error' ? styles.errorText : styles.successText}>
                    {feedbackMessage.message}
                </Text>
            )}

            {/* Send Connection Request Button */}
            <TouchableOpacity
                style={styles.signInButton}
                onPress={() => handleUserSearch(email)}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.signInButtonText}>Send Connection Request</Text>
                )}
            </TouchableOpacity>

            <Text style={styles.headerText}>Connection Requests Sent</Text>

            {/* Render pending requests */}
            {relationships && renderPendingRequests(relationships, currentUser)}
        </ScrollView>
            </View>
    );
};

// Function to render pending connection requests
const renderPendingRequests = (relationships, currentUser) => {
    return Object.entries(relationships).map(([key, connection]) => {
        if (!connection.approved && connection.requester_uid === currentUser.uid) {
            return (
                <UserCard
                    key={key}
                    username={connection.requestee_name}
                    userID={connection.requestee_uid}
                    relationshipID={key}
                    userAction={"pendingRequest"}
                />
            );
        }
        return null;
    });
};

export default NewConnections;
