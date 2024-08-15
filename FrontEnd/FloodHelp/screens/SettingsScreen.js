import React from 'react';
import { View, Text, Button } from 'react-native';

export default function SettingsScreen({ navigation }) {
 return (
   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     <Text style={{ fontSize: 24 }}>Settings Screen</Text>
     <Text style={{ fontSize: 18 }}>Where users can adjust/view settings </Text>
   </View>
 );
}