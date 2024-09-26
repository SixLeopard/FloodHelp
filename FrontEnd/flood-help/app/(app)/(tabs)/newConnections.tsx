import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";
import FH_Button from "@/components/navigation/FH_Button";
import useAPI from "@/hooks/useAPI";

const newConnections = () => {
    const styles = useStyles();
    const relationships = useAPI(`/relationships/get_relationships`);
    const currentUser = useAPI('/accounts/get_current');
    const [email, setEmail ] = useState('')


    const handleUserSearch = async (email) => {
        let url = "http://54.206.190.121:5000/relationships/create";
        const formData = new FormData();
        formData.append('requestee_email', email);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });
            console.log(await response.json());
        } catch (error) {
            console.error("Error with API call:", error);
        }
    }
    if (!relationships || !currentUser) {
        return <Text>Loading...</Text>;
    }




    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Add Connections</Text>
            <Text>TODO: Add back button</Text>
            <Text>TODO: Add search bar</Text>

            {/* Example for sending new connection requests */}
            <UserCard
                username="Send a Request"
                userId="new1"
                userAction={"sendRequest"}
            />

            <TextInput
                style={styles.inputBoxSignInPage}
                value={email}
                onChangeText={setEmail}
                placeholder="floodhelp@example.com"
                placeholderTextColor="#ccc"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TouchableOpacity
                style={styles.signInButton}
                onPress={() => handleUserSearch(email)}
            >
                <Text style={styles.signInButtonText}>Add User</Text>
            </TouchableOpacity>



            <Text style={styles.headerText}>Pending Connection Requests</Text>
            {/* Map through relationships and show pending requests */}
            {Object.entries(relationships).map(([key, connection]) => {
                if (!connection.approved && connection.requester_uid === currentUser.uid) {
                    // Show pending requests where the current user is the requester
                    return (
                        <UserCard
                            key={key}
                            username={connection.requestee_name}
                            userId={connection.requestee_uid}
                            relationshipID={key}
                            userAction={"pendingRequest"}
                        />
                    );
                }

                return null;
            })}

            <Text style={styles.bodyText}>
                Connections can send you check-in requests and see your location during emergencies.
            </Text>
        </View>
    );
};

export default newConnections;
