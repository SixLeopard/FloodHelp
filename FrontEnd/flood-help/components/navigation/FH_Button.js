import {Pressable, Text} from "react-native";
import {router} from "expo-router";
import React from "react";
import useStyles from "../../constants/style";
import {useTheme} from "../../contexts/ThemeContext";

const FH_Button = ({route, text, onPress}) => {
    const styles = useStyles();
    const theme = useTheme();

    const handlePress = () => {
        if (onPress) {
            onPress(); 
        } else if (route) {
            router.push({ pathname: route });
        }
    };

    return (
        <Pressable style={styles.FH_Button} onPress={handlePress}>
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    );
};
export default FH_Button;