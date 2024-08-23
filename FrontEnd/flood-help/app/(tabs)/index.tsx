import { View } from "react-native";
import useStyles from "@/constants/style";
import MapView, { Marker } from "react-native-maps";
import { mapLightTheme } from "@/constants/mapLightTheme";
import { mapDarkTheme } from "@/constants/mapDarkTheme";
import { useTheme } from "@/constants/ThemeProvider";
import React from "react";

export default function Index() {
    const styles = useStyles();
    const { theme } = useTheme();

    return (
        <View style={styles.page}>
            <MapView
                style={styles.map}
                customMapStyle={theme.dark ? mapDarkTheme : mapLightTheme}
                initialRegion={{
                    latitude: -27.48940955072014,
                    latitudeDelta: 0.07086089788321814,
                    longitude: 153.01367115357283,
                    longitudeDelta: 0.050797231545828936,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: -27.48940955072014,
                        longitude: 153.01367115357283,
                    }}
                    title={"test"}
                    description={"hazard"}
                >

                </Marker>
            </MapView>
        </View>
    );
}
