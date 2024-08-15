import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import MapScreen from "./screens/MapScreen.js";
import NotificationsScreen from "./screens/NotificationsScreen.js";
import ReportingScreen from "./screens/ReportingScreen.js";
import ConnectionsScreen from "./screens/ConnectionsScreen.js";
import SettingsScreen from "./screens/SettingsScreen.js";
import { globalStyles, tabStyles } from "./styles";

const Tab = createBottomTabNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Map"
        screenOptions={{
          showLabel: false, 
          tabBarShowLabel: false,
          activeTintColor: "#3498db",
          inactiveTintColor: "gray",
          style: {
            backgroundColor: "#ecf0f1",
          }
        }}

        
      >
        <Tab.Screen
          name="Reporting"
          component={ReportingScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Report",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="pencil" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Notifications",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="bell" // TODO: make this dynamic
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="map" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Connections"
          component={ConnectionsScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Connections",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="human-greeting" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="cog"
                color={color}
                size={size}
              />
            ),
            
          }}
        />
        
      </Tab.Navigator>
      
    </NavigationContainer>
  );
}
