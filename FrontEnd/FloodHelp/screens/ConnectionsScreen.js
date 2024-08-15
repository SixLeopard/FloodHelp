import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ConnectionsScreen({ navigation }) {
 return (
   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     <Text style={{ fontSize: 24 }}>Connections Screen</Text>
     <Text style={{ fontSize: 18 }}>This will be where users can view and add their friends/family</Text>
   </View>
 );
}