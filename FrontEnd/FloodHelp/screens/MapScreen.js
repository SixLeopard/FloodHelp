import React from 'react';
import { View, Text, Button } from 'react-native';
import MapView from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function MapScreen({ navigation }) {
 return (
   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     <Text style={{ fontSize: 24 }}>Map Screen</Text>
     <Text style={{ fontSize: 18 }}>This will be the page the app default opens to</Text>
     <MapView style={styles.map} />
   </View>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '70%',
  },
  
});