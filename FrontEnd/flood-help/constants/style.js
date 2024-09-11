import { StyleSheet } from 'react-native';
import {useTheme} from "@/constants/ThemeProvider";
import {Colors} from "@/constants/Colors";


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
            flex: 1,
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
            backgroundColor: 'rgba(203, 209, 204, 0.8)',
            padding: 10,
            borderRadius: 50,
            marginLeft: 10,
            marginTop: 10,
            marginBottom: 10,
        },

        container: {
            flex: 1,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        confirmButtonContainer: {
            marginVertical: 0,  
            marginHorizontal: 0, 
            padding: 0, 
            backgroundColor: 'transparent',
        },
        confirmButton: {
            backgroundColor: colors.blue,
            height: 40,
            display: "flex",
            flexDirection: "row",
            justifyContent: 'center',
            alignItems: 'center',
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: colors.blue,
            padding: 5, 
            paddingHorizontal: 20,
        },
        confirmButtonText: {
            color: colors.white,
            fontFamily: 'Urbanist_600SemiBold',
            fontSize: 16,
            flexWrap: 'wrap',
            padding: 2,
        },

        locationContainer: {
            marginTop: 40,
            marginBottom: 20,
            padding: 10,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 5,
            backgroundColor: colors.card,
        },
        locationText: {
            fontSize: 16,
            color: colors.text,
        },
        pickerContainer: {
            marginBottom: 20,
            padding: 10,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 5,
            backgroundColor: colors.card,
        },
        picker: {
            height: 40,
        },
        imageContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginVertical: 10,
        },
        imagePreviewContainer: {
            position: 'relative',
            marginRight: 10,
            marginBottom: 10,
        },
        imageButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        imagePreview: {
            width: 100,
            height: 100,
        },
        imageText: {
            fontSize: 16,
            color: '#898f8a', 
            marginBottom: 5,
        },
        removeImageButton: {
            backgroundColor: colors.red,

            height: 40,
            display: "flex",
            flexBasis: 'auto',
            flexDirection: "row",
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: colors.red,
            borderRadius: 15,
            margin: 15,
            padding: 5,
            paddingHorizontal: 20,
        },
        removeImageText: {
            color: colors.white,
            fontFamily: 'Urbanist_600SemiBold',
            fontSize: 16,
            flexWrap: 'wrap',
            padding: 2,
        },
        imageButton: {
            backgroundColor: colors.green,

            height: 40,
            display: "flex",
            flexBasis: 'auto',
            flexDirection: "row",
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: colors.green,
            borderRadius: 15,
            margin: 15,
            padding: 5,
            paddingHorizontal: 20,
        },
        imageButtonText: {
            color: colors.white,
            fontFamily: 'Urbanist_600SemiBold',
            fontSize: 16,
            flexWrap: 'wrap',
            padding: 2,
        },
        boxContainer: {
            width: '90%',
            padding: 15,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: theme.dark ? Colors.custom.borderDark : Colors.custom.borderLight, 
            borderRadius: 10,
            backgroundColor: theme.dark ? Colors.custom.boxBackgroundDark : Colors.custom.boxBackgroundLight, 
        },
        subHeaderText: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: colors.text, 
        },
        rowContainerSetting: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: Colors.custom.borderLight, 
        },
        logoutButton: {
            marginTop: 20,
            backgroundColor: Colors.custom.logoutButtonRed, 
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

        descriptionContainer: {
            marginBottom: 20,
            padding: 10,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 5,
            backgroundColor: colors.card,
        },
        
        descriptionInput: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            padding: 8,
            minHeight: 100,
            textAlignVertical: 'top',
        },

    });
};

export default useStyles;
