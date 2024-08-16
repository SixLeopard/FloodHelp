import { StyleSheet } from 'react-native';
import {useTheme} from "@/constants/ThemeProvider";

const useStyles = () => {
    const { theme } = useTheme();
    const colors = theme.colors


    return StyleSheet.create({
        page: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
        },
        rowContainer: {
            flexDirection: 'row',
            padding: 20,
        },
        headerText: {
            color: colors.text,
            fontFamily: 'Urbanist_900Black',
            fontSize: 20
        },
        bodyText: {
            color: colors.text,
            fontFamily: 'Urbanist_600SemiBold',
            fontSize: 16


        }
    });
};

export default useStyles;
