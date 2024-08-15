import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ReportingScreen({ navigation }) {
 return (
   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     <Text style={{ fontSize: 24 }}>Reporting Screen</Text>
     <Text style={{ fontSize: 18 }}>This will be where users view/create hazard reports</Text>
   </View>
 );
}