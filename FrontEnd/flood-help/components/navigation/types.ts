import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    mapscreen: { onLocationSelected: (address: string) => void };
    newreport: undefined;
};

export type MapScreenRouteProp = RouteProp<RootStackParamList, 'mapscreen'>;