import React from 'react';
import {Text, View} from "react-native";
import useStyles from "@/constants/style";
import UserCard from "@/components/UserCard";
import FH_Button from "@/components/navigation/FH_Button";
import getAPI from "@/hooks/GetAPI";
import ReportCard from "@/components/ReportCard";
import {useAuth} from "@/contexts/AuthContext";



const Connections = () => {
    const relationships = getAPI(`/relationships/get_relationships`)
    const currentUser = getAPI('/accounts/get_current')
    const styles = useStyles();


    if (!relationships || !currentUser ){
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.page}>

            <Text style={styles.headerText}>Connections Page</Text>
            {Object.entries(relationships).map(([key, connection]) =>
                connection.approved ? (
                    <UserCard
                        username={connection.requestee_name}
                        userId={connection.requestee_name}
                        status={1}
                    /> ): (null )
            )}

            <Text style={styles.headerText}>Pending Connection Requests</Text>
            {Object.entries(relationships).map(([key, connection]) =>
                connection.requestee_uid == currentUser.uid ? (
                    connection.approved ? null : (
                        <UserCard
                            key = {key}
                            username={connection.requester_name}
                            userId={connection.requester_name}
                            showConnectionRequest={true}
                        />
                    )
                ) : null
            )}

            {/*<UserCard username={"Test User 1"} userId={1} status={undefined} showConnectionRequest={undefined}*/}
            {/*          sendRequest={undefined} pendingRequest={undefined}/>*/}
            {/*<UserCard username={"Test User 2"} userId={2} status={undefined} showConnectionRequest={undefined}*/}
            {/*          sendRequest={undefined} pendingRequest={undefined}/>*/}
            {/*<UserCard username="Marked Safe" userId="marked safe" status={"safe"} showConnectionRequest={undefined}*/}
            {/*          sendRequest={undefined} pendingRequest={undefined} />*/}
            {/*<UserCard username="Status Unknown" userId="status unknown" status={"unknown"}*/}
            {/*          showConnectionRequest={undefined} sendRequest={undefined} pendingRequest={undefined} />*/}
            {/*<UserCard username="Connection Request" userId="connection request" showConnectionRequest={true}*/}
            {/*          status={undefined} sendRequest={undefined} pendingRequest={undefined} />*/}
            {/*<UserCard username="Send a Request" userId="send request" sendRequest={true} status={undefined}*/}
            {/*          showConnectionRequest={undefined} pendingRequest={undefined} />*/}
            {/*<UserCard username="Pending Request" userId="pending req" pendingRequest={true} status={undefined}*/}
            {/*          showConnectionRequest={undefined} sendRequest={undefined} />*/}

            <FH_Button route="/newConnections" text="Add New Connections"></FH_Button>


        </View>
    );
};

export default Connections;