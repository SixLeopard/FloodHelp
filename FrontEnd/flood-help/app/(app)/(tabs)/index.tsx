import React, { useState, useEffect } from "react";
import { View, Alert, TouchableOpacity, ActivityIndicator, Text, Image } from "react-native";
import useStyles from "@/constants/style";
import MapView, { Marker, Region } from "react-native-maps";
import { mapLightTheme, mapDarkTheme } from "@/constants/Themes";
import { useTheme } from "@/contexts/ThemeContext";
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import useAPI from '@/hooks/useAPI';

type RootStackParamList = {
    newreport: undefined;
};

interface Report {
    datetime: string;
    title: string;
    coordinates: string;
}

interface ConnectionLocation {
    uid: number;
    latitude: number;
    longitude: number;
}

interface Relationship {
    requestee_name: string;
    requestee_uid: number;
    requester_name: string;
    requester_uid: number;
}

export default function Index() {
    const styles = useStyles();
    const { theme } = useTheme();
    const [region, setRegion] = useState<Region | null>(null);
    const [connectionLocations, setConnectionLocations] = useState<ConnectionLocation[]>([]);
    const [relationships, setRelationships] = useState<Relationship[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { user } = useAuth();

    const reports = useAPI('/reporting/user/get_all_report_basic');

    const updateLocationAndFetchConnections = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission to access location was denied");
                setLoading(false);
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

            const formData = new FormData();
            formData.append('location', `(${latitude},${longitude})`);

            const locationUpdateResponse = await fetch('http://54.206.190.121:5000/locations/update', {
                method: 'POST',
                body: formData,
            });
            const locationData = await locationUpdateResponse.json();
            console.log('Location Update Response:', locationData);

            if (Object.keys(locationData).length > 0) {
                const locationsArray: ConnectionLocation[] = Object.entries(locationData).map(([uid, loc]) => {
                    const [latStr, longStr] = (loc as string).replace(/[()]/g, '').split(',');
                    return {
                        uid: parseInt(uid),
                        latitude: parseFloat(latStr),
                        longitude: parseFloat(longStr),
                    };
                });
                setConnectionLocations(locationsArray);
            }

            const relationshipsResponse = await fetch('http://54.206.190.121:5000/relationships/get_relationships', {
                method: 'GET',
            });
            const relationshipsData = await relationshipsResponse.json();
            console.log('Relationships Data:', relationshipsData);
            setRelationships(Object.values(relationshipsData));
            setLoading(false);
        } catch (error) {
            console.error("Error updating location and fetching connections:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("useEffect triggered with user:", user);
        if (!user) return;

        updateLocationAndFetchConnections();
    }, [user]);

    const handleAddReport = () => {
        navigation.navigate('newreport');
    };

    const getFloodColor = (title: string): string => {
        if (title.includes('Major Flood')) {
            return 'maroon';
        } else if (title.includes('Moderate Flood')) {
            return 'darkorange';
        } else if (title.includes('Minor Flood')) {
            return 'goldenrod';
        } else {
            return 'maroon';
        }
    };

    if (loading || !reports) {
        return (
            <View style={styles.page}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ textAlign: "center", marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.page}>
            {region && (
                <MapView
                    style={styles.map}
                    customMapStyle={theme.dark ? mapDarkTheme : mapLightTheme}
                    initialRegion={region}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                >
                    {/* Render Flood Report Markers */}
                    {reports && Object.entries(reports).map(([key, report]: [string, any], index) => {
                        if (!report.coordinates) return null;

                        const [latitudeStr, longitudeStr] = report.coordinates.replace(/[()]/g, '').split(',');
                        const latitude = parseFloat(latitudeStr);
                        const longitude = parseFloat(longitudeStr);
                        const color = getFloodColor(report.title);

                        if (isNaN(latitude) || isNaN(longitude)) return null;

                        return (
                            <Marker
                                key={index}
                                coordinate={{ latitude, longitude }}
                                title={`${report.title}`}
                                description={`Reported on: ${report.datetime}`}
                            >
                                <FontAwesome name="exclamation-circle" size={40} color={color} />
                            </Marker>
                        );
                    })}

                    {/* Render Connections' Locations with custom pin image */}
                    {connectionLocations.map((connection, index) => {
                        const relationship = relationships.find(
                            (rel) => (rel.requestee_uid === connection.uid || rel.requester_uid === connection.uid)
                        );
                        const connectionName = relationship?.requestee_uid === connection.uid
                            ? relationship.requestee_name
                            : relationship?.requester_name;

                        return (
                            <Marker
                                key={index}
                                coordinate={{ latitude: connection.latitude, longitude: connection.longitude }}
                                title={connectionName}
                            >
                                <Image
                                    source={require('@/assets/images/map-marker-default.png')}
                                    style={{ width: 40, height: 40 }}
                                    resizeMode="contain"
                                />
                            </Marker>
                        );
                    })}
                </MapView>
            )}
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={handleAddReport} style={styles.iconButton}>
                    <Icon name="report" size={40} color={theme.dark ? "maroon" : "maroon"} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.iconButton}
                >
                    <Icon name="history" size={40} color={theme.dark ? "midnightblue" : "midnightblue"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={updateLocationAndFetchConnections} style={styles.iconButton}>
                    <Icon name="refresh" size={40} color={theme.dark ? "green" : "green"} />
                </TouchableOpacity>
            </View>
        </View>
    );
}