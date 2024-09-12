import React, { useState } from 'react';
import {ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import {Urbanist_900Black, Urbanist_300Light, Urbanist_500Medium, Urbanist_400Regular, Urbanist_600SemiBold} from '@expo-google-fonts/urbanist';

const FontContext = ({ children }) => {
    const [fontsLoaded] = useFonts({
        Urbanist_300Light,
        Urbanist_400Regular,
        Urbanist_500Medium,
        Urbanist_600SemiBold,
        Urbanist_900Black,
    });

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return <>{children}</>;
};

export default FontContext;
