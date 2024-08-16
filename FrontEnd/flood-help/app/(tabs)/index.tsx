import { Text, View } from "react-native";
import useStyles from "@/constants/style";

export default function Index() {
    const styles = useStyles();

    return (
        <View style={styles.page}>
      <Text style={styles.headerText}>Map</Text>
    </View>
  );
}
