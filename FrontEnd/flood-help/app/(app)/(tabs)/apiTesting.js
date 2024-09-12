import { Text, View } from 'react-native';
import useStyles from "@/constants/style";
import getAPI from "../GetAPI";

export default function ApiTesting() {
    const styles = useStyles();

    // Change these constants to our project variables

    const URL = 'https://aurumgrallarius.com/mytransport/api/findstops';
    const body = {"lat": -27.4962819, "lon": 153.0139074, "limit": 20}
    const method = 'POST'


   const result = getAPI(URL, method, body);
    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>API Testing</Text>
            <Text>{JSON.stringify(result)}</Text>
        </View>
    );
}

