import { StyleSheet } from 'react-native';
import {useTheme} from "@/constants/ThemeProvider";

const useStyles = () => {
    const { theme } = useTheme();
    const colors = theme.colors


    return StyleSheet.create({
        page: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: colors.background,
        },
        rowContainer: {
            flexDirection: 'row',
            padding: 20,
            alignItems: 'center'
        },
        headerText: {
            color: colors.text,
            fontFamily: 'Urbanist_900Black',
            fontSize: 20,
            paddingTop: 80,
            margin: 10,
        },
        bodyText: {
            color: colors.text,
            fontFamily: 'Urbanist_400Regular',
            fontSize: 16,
            flexWrap: 'wrap',
            width: "90%",
        },
        bodyTextDark: {
            color: colors.darkText,
            fontFamily: 'Urbanist_400Regular',
            fontSize: 16,
            flexWrap: 'wrap',
            width: "90%",
        },
        bodyTextBold: {
            color: colors.darkText,
            fontFamily: 'Urbanist_600SemiBold',
            fontSize: 16,
            flexWrap: 'wrap',
            width: "90%",
        },
        map: {

            width: '100%',
            height: '100%',
        },
        userPressable: {
            height: 70,
            flexDirection: "row",
            alignItems: 'center'
        },
        profileImg: {
            height: 50,
            width: 50,
            borderRadius: 50,
            margin: 15,
        },
        userCard: {
            height: 70,
            width: '85%',
            backgroundColor: colors.card,
            flexDirection: "row",
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignSelf: 'center',
            borderStyle: "solid",
            borderColor: colors.border,
            borderWidth: 2,
            borderRadius: 15,
            margin: 5,

        },
        notificationCard: {
            display: "flex",
            flexBasis: 'auto',
            width: '85%',
            backgroundColor: colors.card,
            flexDirection: "row",
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            alignSelf: 'center',
            borderStyle: "solid",
            borderColor: colors.border,
            borderWidth: 2,
            borderRadius: 15,
            margin: 5,

        }, notificationBody: {
            marginVertical: 15,
            width: '80%'
        },  notifCautionIcon: {
            fontSize: 50,
            color: colors.red,
            margin: 15,
        },
        iconContainer: { 
            position: 'absolute',
            top: 90, 
            left: 10, 
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 70, 
        },
        iconButton: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            padding: 10,
            borderRadius: 50, 
            marginLeft: 10, 
            marginTop: 10,
            marginBottom: 10,
        },

    });
};

export default useStyles;
