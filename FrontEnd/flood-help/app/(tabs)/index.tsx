import React, { useState, useEffect } from "react";
import { View, Alert, Image, TouchableOpacity } from "react-native";
import useStyles from "@/constants/style";
import MapView, { Marker, Region } from "react-native-maps";
import { mapLightTheme } from "@/constants/mapLightTheme";
import { mapDarkTheme } from "@/constants/mapDarkTheme";
import { useTheme } from "@/constants/ThemeProvider";
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

    const handleAddReport = () => {
        Alert.alert("Add Report", "This will navigate to the report screen.");
    };

    const handleSeeHistoricalFlooding = () => {
        Alert.alert("Historical Flooding", "This will show historical flooding areas.");
    };

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
                            source={require('@/assets/images/marker-default.png')}
                            style={{ width: markerSize.width, height: markerSize.height }}
                        />
                    </Marker>
                </MapView>
            )}

            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={handleAddReport} style={styles.iconButton}>
                    <Icon name="report" size={40} color={theme.dark ? "white" : "black"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSeeHistoricalFlooding} style={styles.iconButton}>
                    <Icon name="history" size={40} color={theme.dark ? "white" : "black"} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
