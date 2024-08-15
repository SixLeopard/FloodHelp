import React from 'react';
import { View, Text, Button } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ReportingScreen({ navigation }) {
 return (
   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialCommunityIcons
        name="map" // TODO: make this dynamic
        size={25}
      />
     <Text style={{ fontSize: 24 }}>Reporting Screen</Text>
     <Text style={{ fontSize: 18 }}>This will be where users view/create hazard reports</Text>
   </View>
 );
}