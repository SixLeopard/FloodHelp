import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#ecf0f1',
 },
 titleText: {
   fontSize: 24,
   fontWeight: 'bold',
   marginBottom: 20,
 },
 button: {
   marginTop: 20,
 },
});

export const tabStyles = StyleSheet.create({
 tabBarIcon: {
   marginBottom: -3,
 },
});

export const mapStyle = StyleSheet.create({ 
    map: {
    width: '100%',
    height: '100%',
  },
})