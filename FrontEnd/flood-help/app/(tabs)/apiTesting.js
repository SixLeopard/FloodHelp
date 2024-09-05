import { Text, View } from 'react-native';
import useStyles from "@/constants/style";
import getAPI from "../GetAPI";

export default function ApiTesting() {
    const styles = useStyles();

    // Change these constants

    // const URL = 'https://aurumgrallarius.com/mytransport/api/findstops';
    // const body = {"lat": -27.4962819, "lon": 153.0139074, "limit": 20}
    // const method = 'POST'

    const URL = 'http://54.206.190.121:5000/reporting/user/get_all_report';
    const body ={
        "Login": "True",
        "sessionid": "b'gAAAAABm1Dler3oe5IFx7NB_fFQPcznmmVTaoO6E6h0766nN9TS7MSfNRSRkYTb3PbNgPggiY1rk3Mx26ch3B1fzGmevG3xr6oSv9oTNo408gJPRoBKZISg='"
    }
    const method = 'POST'

   const result = getAPI(URL, method, body);
    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>API Testing</Text>
            <Text>{JSON.stringify(result)}</Text>
        </View>
    );
}

