import {Pressable, Text} from "react-native";
import {router} from "expo-router";
import React from "react";
import useStyles from "../../constants/style";
import {useTheme} from "../../constants/ThemeProvider";

const FH_Button = ({route, text}) => {
    const styles = useStyles();
    const theme = useTheme();

    return (
<Pressable style ={styles.FH_Button}
           onPress={() => router.push({
               pathname: route
           })
           }>
    <Text style={styles.buttonText}>{text}</Text>
</Pressable>
    )

}
export default FH_Button;