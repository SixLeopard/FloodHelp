import React, { useCallback, useEffect, useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    RefreshControl,
    Animated
} from "react-native";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";
import useAPI from "@/hooks/useAPI";

const ScrollView = Animated.ScrollView;

const NewConnections = ({ navigation }) => {
    const styles = useStyles();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [relationships, setRelationships] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const apiUrl = "http://54.206.190.121:5000";

    // Fetch relationships and current user data
    const fetchData = async () => {
        try {
            const relationshipsResponse = await fetch(`${apiUrl}/relationships/get_relationships`);
            const relationshipsData = await relationshipsResponse.json();
            setRelationships(relationshipsData);

            const currentUserResponse = await fetch(`${apiUrl}/accounts/get_current`);
            const currentUserData = await currentUserResponse.json();
            setCurrentUser(currentUserData);
            setRefreshing(false); // Stop refreshing after data is fetched

        } catch (error) {
            console.error("Error fetching data:", error);
            setRefreshing(false); // Stop refreshing even on error
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle user search and send a connection request
    const handleUserSearch = async (email) => {
        setLoading(true);
        setFeedbackMessage(null);

        if (!validateEmail(email)) {
            setFeedbackMessage({ type: 'error', message: 'Please enter a valid email address.' });
            setLoading(false);
            return;
        }

        const url = `${apiUrl}/relationships/create`;
        const formData = new FormData();
        formData.append('requestee_email', email);

        try {
            const response = await fetch(url, { method: 'POST', body: formData });
            const result = await response.json();
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
        } else {
            const errorMessages = {
                user_does_not_exist: 'User does not exist.',
                relationship_exists: 'Error: Relationship already exists.',
                self_relationship: 'Error: You cannot connect with yourself.',
                'database error': (error) => `Database error: ${error}`,
                invalid_account: 'Error: Invalid account. Please log in.',
                invalid_request: 'Error: Invalid request method.',
            };

            const message = Object.keys(errorMessages).find(key => response[key]) || 'Unknown error occurred. Please try again';
            setFeedbackMessage({ type: 'error', message: typeof errorMessages[message] === 'function' ? errorMessages[message](response['database error']) : errorMessages[message] });
        }
    };

    // Basic email validation function
    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    // Centralized loading state and error handling
    const renderLoadingState = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading data...</Text>
        </View>
    );

    // Centralized feedback message display
    const renderFeedbackMessage = () => (
        feedbackMessage && (
            <Text style={feedbackMessage.type === 'error' ? styles.errorText : styles.successText}>
                {feedbackMessage.message}
            </Text>
        )
    );

    // Function to render pending connection requests
    const renderPendingRequests = () => {
        const pendingRequests = Object.entries(relationships).filter(([key, connection]) =>
            !connection.approved && connection.requester_uid === currentUser.uid
        );

        // Check if there are pending requests
        if (pendingRequests.length === 0) {
            return <Text style={styles.bodyText}>No pending connection requests.</Text>;
        }

        // Map through pending requests to display UserCard components
        return pendingRequests.map(([key, connection]) => (
            <UserCard
                key={key}
                username={connection.requestee_name}
                userID={connection.requestee_uid}
                relationshipID={key}
                userAction={"pendingRequest"}
            />
        ));
    };

    // Early return if relationships or currentUser data is not yet available
    if (!relationships || !currentUser) {
        return renderLoadingState();
    }

    return (
        <View style={styles.page}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
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
                {renderFeedbackMessage()}

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
                {renderPendingRequests()}
            </ScrollView>
        </View>
    );
};

export default NewConnections;
