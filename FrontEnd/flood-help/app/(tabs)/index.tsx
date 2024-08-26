import React, { useState, useEffect } from "react";
import { View, Alert, Image } from "react-native";
import useStyles from "@/constants/style";
import MapView, { Marker, Region } from "react-native-maps";
import { mapLightTheme } from "@/constants/mapLightTheme";
import { mapDarkTheme } from "@/constants/mapDarkTheme";
import { useTheme } from "@/constants/ThemeProvider";
import * as Location from 'expo-location';

export default function Index() {
    const styles = useStyles();
    const { theme } = useTheme();
    const [region, setRegion] = useState<Region | null>(null);
    const [markerSize, setMarkerSize] = useState({ width: 30, height: 30 });

    useEffect(() => {
        const requestLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922, 
                longitudeDelta: 0.0421, 
            });
        };

        requestLocationPermission();
    }, []);

    return (
        <View style={styles.page}>
            {region && (
                <MapView
                    style={styles.map}
                    customMapStyle={theme.dark ? mapDarkTheme : mapLightTheme}
                    initialRegion={region}
                >
                    <Marker 
                        coordinate={region}
                        title={"Your Location"}
                    >
                        <Image
                            source={require('@/assets/marker-default.png')}
                            style={{ width: markerSize.width, height: markerSize.height }}
                        />
                    </Marker>
                </MapView>
            )}
        </View>
    );
}
