import * as Location from "expo-location";

/**
 * This function is used to reverse geocoding, it takes in coordinates and translates them into a
 * street address. Using the expo-location package. 
 * @param coordinateString
 * @returns {Promise<string>}
 */
export const handleReverseGeo = async (coordinateString) => {
    const [latStr, longStr] = coordinateString.replace(/[()]/g, '').split(',').map(Number);

    try {
        const geocode = await Location.reverseGeocodeAsync({ latitude: latStr, longitude: longStr });
        if (geocode.length > 0) {
            return `${geocode[0].streetNumber || ''} ${geocode[0].street || ''}, ${geocode[0].city || ''}`.trim();
        } else {
            return 'Unable to determine address';
        }
    } catch (error) {
        return 'Error fetching address';
    }
};
