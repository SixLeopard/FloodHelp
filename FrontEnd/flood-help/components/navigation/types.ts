import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    mapscreen: {
        onLocationSelected: (address: string, selectedCoordinates: { latitude: number, longitude: number }) => void;
    };
    newreport: undefined;
    notifications: undefined;
    index: undefined;
};

export type MapScreenRouteProp = RouteProp<RootStackParamList, 'mapscreen'>;