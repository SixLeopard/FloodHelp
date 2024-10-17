import { RouteProp } from '@react-navigation/native';

/**
 * Defines the type for the stack of screens used in the navigation.
 * 
 * @typedef {Object} RootStackParamList
 * @property {Object} mapscreen - Screen for map functionality.
 * @property {(address: string, selectedCoordinates: { latitude: number, longitude: number }) => void} mapscreen.onLocationSelected - Callback function when a location is selected.
 * @property {undefined} newreport - Screen for creating a new report.
 * @property {undefined} notifications - Screen for viewing notifications.
 * @property {undefined} index - Home screen or main landing screen.
 */
export type RootStackParamList = {
    mapscreen: {
        onLocationSelected: (address: string, selectedCoordinates: { latitude: number, longitude: number }) => void;
    };
    newreport: undefined;
    notifications: undefined;
    index: undefined;
};

/**
 * Defines the type for the route prop for the 'mapscreen' route.
 * 
 * @typedef {RouteProp<RootStackParamList, 'mapscreen'>} MapScreenRouteProp
 */
export type MapScreenRouteProp = RouteProp<RootStackParamList, 'mapscreen'>;