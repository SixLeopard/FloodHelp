import {Pressable, Text} from "react-native";
import {router} from "expo-router";
import React from "react";
import useStyles from "../../constants/style";
import {useTheme} from "../../contexts/ThemeContext";

const FH_Button = ({route, text, onPress, disabled}) => {
    const styles = useStyles();
    const theme = useTheme();

    const handlePress = () => {
        if (!disabled) {
            if (onPress) {
                onPress(); 
            } else if (route) {
                router.push({ pathname: route });
            }
        }
    };

    return (
        <Pressable
            style={[styles.FH_Button, disabled ? styles.disabledButton : null]} // Apply a different style when disabled
            onPress={handlePress}
            disabled={disabled} // Disable press events when disabled
        >
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    );
};

export default FH_Button;