import React from "react";
import { View, Text, Button } from "react-native";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ScreenHeader({ navigation }) {
  return (
    <View
      style={{
        paddingTop: 100,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="map" // TODO: make this dynamic
        size={25}
      />
      <Text>PageName</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
