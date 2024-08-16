import { Text, View } from "react-native";
import useStyles from "@/constants/style";
import MapView from "react-native-maps";
import {mapLightTheme} from "@/utilities/mapLightTheme";
import {mapDarkTheme} from "@/utilities/mapDarkTheme";
import {useTheme} from "@/constants/ThemeProvider";
import {lightTheme} from "@/utilities/lightTheme";
import {darkTheme} from "@/utilities/darkTheme";

export default function Index() {
    const styles = useStyles();
    const { theme } = useTheme();
    // const onRegionChange = (region) => {
    //     console.log(region);
    // }

    return (
        <View style={styles.page}>
            <MapView
                style={styles.map}
                customMapStyle={theme.dark ? mapDarkTheme : mapLightTheme}
                // onRegionChange={onRegionChange}
                initialRegion={{"latitude": -27.48940955072014, "latitudeDelta": 0.07086089788321814, "longitude": 153.01367115357283, "longitudeDelta": 0.050797231545828936}}


            >

        </MapView>
    </View>
  );
}
