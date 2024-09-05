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
        FH_Button: {
            backgroundColor: colors.blue,

            height: 40,
            display: "flex",
            flexBasis: 'auto',
            flexDirection: "row",
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: colors.blue,
            borderRadius: 15,
            margin: 15,
            padding: 5,
            paddingHorizontal: 20,
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
        },
        bodyTextDark: {
            color: colors.darkText,
            fontFamily: 'Urbanist_400Regular',
            fontSize: 16,
            flexWrap: 'wrap',

        },
        bodyTextBold: {
            color: colors.darkText,
            fontFamily: 'Urbanist_600SemiBold',
            fontSize: 16,
            flexWrap: 'wrap',

        },
        nameText: {
            color: colors.text,
            fontFamily: 'Urbanist_400Regular',
            fontSize: 20,
            flexWrap: 'wrap',

        },
        buttonText: {
            color: colors.white,
            fontFamily: 'Urbanist_600SemiBold',
            fontSize: 16,
            flexWrap: 'wrap',
            padding: 2,
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
        userCard: {
            height: 70,
            width: '85%',
            backgroundColor: colors.card,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: 'center',
            alignSelf: 'center',
            borderStyle: "solid",
            borderColor: colors.border,
            borderWidth: 2,
            borderRadius: 15,
            margin: 5,

        },
        userCardIcon: {
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 15,
            gap: 10,
            fontSize: 35,

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
            alignContent: 'center'
        },
        reportCard: {
            flex: 1,
            backgroundColor: colors.card,
            flexDirection: "column",
            justifyContent:'center',
            alignItems: 'center',
            borderStyle: "solid",
            borderColor: colors.border,
            borderWidth: 2,
            borderRadius: 15,
            margin: 5,
            padding: 15,
        },
        reportCardsContainer: {
            alignItems: "center",

        },
        reportCardBody: {
            width: '85%',
        },
        formContainer: {
            flex: 1,
        },
        inputBox: {
            height: 40,
            width: 300,
            borderColor: colors.border,
            borderWidth: 1.5,
            borderRadius: 5,
            marginBottom: 12,
            paddingHorizontal: 8,
            backgroundColor: '#fff',
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

        // New styles for SettingsScreen
        boxContainer: {
            width: '90%',
            padding: 15,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: theme.dark ? '#666' : '#ccc', // Dark mode: darker border, Light mode: lighter border
            borderRadius: 10,
            backgroundColor: theme.dark ? '#444' : '#f8f9fa', // Dark mode: darker background, Light mode: lighter background
        },
        subHeaderText: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: colors.text, // Adapt to theme text color
        },
        rowContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
        },
        logoutButton: {
            marginTop: 20,
            backgroundColor: colors.red,
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            width: '90%',
        },
        logoutButtonText: {
            color: '#FFF',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });
};

export default useStyles;
