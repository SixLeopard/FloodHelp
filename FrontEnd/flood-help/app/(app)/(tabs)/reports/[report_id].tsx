import React, { useEffect, useMemo } from 'react';
import { Text, View, ActivityIndicator, Image, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import useAPI from '@/hooks/useAPI';
import MapView, { Marker } from 'react-native-maps';
import useStyles from '@/constants/style';

const ReportPage = () => {
    const { report_id, address } = useLocalSearchParams<{ report_id: string, address: string }>();
    const styles = useStyles();

    // useMemo to prepare the formData
    const formData = useMemo(() => {
        const data = new FormData();
        data.append('report_id', report_id);
        return data;
    }, [report_id]);

    const reportData = useAPI(`/reporting/user/get_report`, formData);

    // Loading state
    if (!reportData) {
        return (
            <View style={styles.page}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.bodyText}>Loading report details...</Text>
            </View>
        );
    }

    // Invalid account handling
    if (reportData == "invalid_account") {
        return (
            <View style={styles.page}>
                <Text style={styles.headerText}>Error</Text>
                <Text style={styles.bodyText}>This account is invalid or doesn't have permission to view this report.</Text>
            </View>
        );
    }
        const {title, description, coordinates, datetime, area_name, imageUrl} = reportData;

        const [latitudeStr, longitudeStr] = reportData.coordinates.replace(/[()]/g, '').split(',');
        const latitude = parseFloat(latitudeStr);
        const longitude = parseFloat(longitudeStr);

    return (
        <View style={styles.page}>
            <Text style={styles.headerText}>Report {report_id}'s Page</Text>
            <View>
                <Text style={styles.bodyTextBold}>Title: {title || 'No Title Found'}</Text>
                <Text style={styles.bodyText}>Description: {description || 'No Description Found'}</Text>
                <Text style={styles.bodyText}>Address: {address || 'No Address Found'}</Text>
                <Text style={styles.bodyText}>Datetime: {datetime || 'No Date Available'}</Text>

                {/* Display Image if available */}
                {imageUrl && (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}

                {/* Map View */}
                {latitude && longitude ? (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude,
                            longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker coordinate={{ latitude, longitude }} />
                    </MapView>
                ) : (
                    <Text style={styles.bodyText}>Location not available.</Text>
                )}
            </View>
        </View>
    );
};

const mapWidth = Dimensions.get('window').width * 0.9; // Adjust map width dynamically

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 200,
        marginVertical: 10,
    },
    map: {
        width: mapWidth,
        height: 300,
        marginVertical: 10,
    },
});

export default ReportPage;
