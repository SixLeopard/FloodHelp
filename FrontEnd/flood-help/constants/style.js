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
        formContainer: {
            flex: 1,
        },
        input: {
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            marginBottom: 12,
            paddingHorizontal: 8,
            backgroundColor: '#fff',
        },

    });
};

export default useStyles;
