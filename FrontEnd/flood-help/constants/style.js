import { StyleSheet } from 'react-native';
import {useTheme} from "@/contexts/ThemeContext";
import {Colors} from "@/constants/Colors";

const useStyles = () => {
    const {theme} = useTheme();
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
            margin: 4,
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
            color: colors.darkText,
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
            marginBottom: 8,

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
            width: '70%'
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
            width: '100%',
            backgroundColor: colors.white, // Light background for the form
            borderColor: colors.grey, // Subtle border around the form
            borderWidth: 2,
            borderRadius: 10, // Rounded corners
            padding: 20,
            marginVertical: 20,
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
            backgroundColor: colors.green,
            height: 40,
            display: "flex",
            flexDirection: "row",
            justifyContent: 'center',
            alignItems: 'center',
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: colors.green,
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
            marginBottom: 20,
            padding: 10,
            borderWidth: 2,
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
            borderWidth: 2,
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
            marginVertical: 20,
        },
        imagePreviewContainer: {
            marginRight: 10,
            marginBottom: 10,
        },
        imageButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
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
            flex: 1,
            backgroundColor: colors.green,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 15,
            marginHorizontal: 5,
        },
        imageButtonText: {
            color: colors.white,
            fontFamily: 'Urbanist_600SemiBold',
            fontSize: 16,
            flexWrap: 'wrap',
            padding: 2,
        },
        titleContainer: {
            marginBottom: 20,
            padding: 10,
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: 5,
            backgroundColor: colors.card,
        },
        inputBox: {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 5,
            padding: 8,
            height: 40,  
            textAlignVertical: 'center',
        },
        descriptionContainer: {
            marginBottom: 20,
            padding: 10,
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: 5,
            backgroundColor: colors.card,
        },
        descriptionInput: {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 5,
            padding: 8,
            minHeight: 100,
            textAlignVertical: 'top',
        },
        boxContainer: {
            width: '90%',
            padding: 15,
            marginVertical: 10,
            borderWidth: 1.5,
            borderColor: theme.dark ? Colors.custom.borderDark : Colors.custom.borderLight, 
            borderRadius: 20,
            backgroundColor: colors.card,
        },
        subHeaderText: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: colors.darkText, 
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

        instructionContainer: {
            position: 'absolute',
            bottom: 30, 
            left: 10,
            right: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
            padding: 10,
            borderRadius: 8,
            zIndex: 1, // Ensures it sits above the map
        },
        instructionText: {
            fontSize: 14, 
            color: '#333', // Dark text for readability
            textAlign: 'center',
            marginBottom: 5, // Adds space between instructions
        },

        logoImage: {
            width: 250,  // Adjust the width
            height: 250, // Adjust the height
            marginTop: 100,
            marginBottom:50 ,
        },

        label: {
            fontSize: 16,
            fontWeight: 'bold',
            alignSelf: 'flex-start', // Aligns label to the left
            marginBottom: 5,
            color: colors.text,
        },

        signInButton: {
            backgroundColor: colors.green,  // Assuming colors.green exists, otherwise use a green hex color
            paddingVertical: 12,
            paddingHorizontal: 80,
            borderRadius: 8,
            marginTop: 20,
            

        },
        signInButtonText: {
            color: colors.white,
            fontSize: 16,
            fontWeight: 'bold',
            

        },

        linkContainer: {
            marginTop: 15,
            flexDirection: 'column', // Stack the links vertically
            width: '100%',
            left: 10,

        },

        linkText: {
            fontSize: 14,
            fontWeight: 'bold',
            textDecorationLine: 'underline',
            marginVertical: 5, // Adds vertical space between links
            color: colors.text,
        },
        
        containerSignIn: {
            flex: 1, // Ensures the container takes up the full height of the screen
            justifyContent: 'center', // Centers content vertically
            alignItems: 'center', // Centers content horizontally
            backgroundColor: '#fff',
            paddingHorizontal: 30, // Adds padding to the sides // Keeps your background color consistent
        },
        
        inputBoxSignInPage: {
            height: 40,
            width: '100%',
            borderColor: '#ccc', // Light gray border
            borderWidth: 1.5,
            borderRadius: 8, // Rounded corners
            marginBottom: 12,
            paddingHorizontal: 8,
            backgroundColor: '#fff',
        },

        // Style for the gray box behind the logo
        logoContainer: {
            width: 320, // Adjust width to match logo size
            height: 225, // Adjust height to match logo size
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10, // Rounded corners
            marginBottom: 25, // Space below the logo
            marginTop: '20%', // Space below the logo
            backgroundColor: '#e9ecef',
        },

        formContainerSignInPage: {
            width: '85%', // Make the form take up 80% of the screen width
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20, // Padding inside the container
            borderRadius: 10, // Rounded corners for the form container
            marginBottom: 40, // Space below the container
            borderColor: '#e9ecef',// Gray border color
            borderWidth: 1.5, // Set the border width to make it visibl
            flexGrow: 0.5, // Allows the container to expand vertically
        },

        /* Styles specific to the Register page */
        registerFormContainer: {
            width: '90%',
            padding: 20,
            borderRadius: 10,
            borderColor: '#ccc',
            borderWidth: 1,
            marginTop: '1%',
            marginBottom: 10,
        },

        registerInputBox: {
            height: 40,
            width: '100%',
            borderColor: '#ccc',
            borderWidth: 1.5,
            borderRadius: 8,
            marginBottom: 12,
            paddingHorizontal: 8,
            backgroundColor: '#fff',
        },

        registerLabel: {
            fontSize: 16,
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            marginBottom: 8,
            color: colors.text,
        },

        termsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },

        checkbox: {
            marginRight: 10,
        },

        termsText: {
            fontSize: 13,
            color: colors.text,
        },

        registerButton: {
            backgroundColor: colors.green,
            paddingVertical: 12,
            paddingHorizontal: 80,
            borderRadius: 8,
            marginTop: 20,
            alignItems: 'center',
        },

        registerButtonText: {
            color: colors.white,
            fontSize: 16,
            fontWeight: 'bold',
        },

        linkContainerRegister: {
            marginTop: 15,
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
        },

        linkTextRegister: {
            color: colors.text,
            fontSize: 14,
        },

        linkTextBoldRegister: {
            fontSize: 14,
            fontWeight: 'bold',
            textDecorationLine: 'underline',
            marginVertical: 5, // Adds vertical space between links
            color: colors.text,
            textAlign: 'center',
        },

        termsLinkTextRegister: {
            color: colors.text,
            fontSize: 12,
            textDecorationLine: 'underline',
            marginTop: 10,
            textAlign: 'center',
        },
        
        // Forgot password page style
        formContainerForgotPassword: {
            width: '85%',
            padding: 20,
            borderRadius: 10,
            borderColor: '#e9ecef', 
            borderWidth: 1,
            alignItems: 'center',
            shadowOffset: { width: 0, height: 2 },
            elevation: 5,
        },
        
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 10,
            paddingHorizontal: 3,
        },
        
        cancelButton: {
            flex: 1,
            backgroundColor: 'red',
            paddingVertical: 12,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
        },

        resetButton: {
            flex: 1,
            backgroundColor: 'green',
            paddingVertical: 12,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
        },
        
        errorText: {
            color: 'red',          
            fontSize: 14,          
            marginTop: 10,        
            textAlign: 'center',  
        },

        loadingOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },

        disabledButton: {
            backgroundColor: '#cccccc', 
        },

        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        alertModal: {
            width: '90%',
            padding: 20,
            backgroundColor: colors.background,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        alertContent: {
            alignItems: 'center',
        },
        alertHeader: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            marginBottom: 10,
        },
        alertTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            color: theme.colors.text,  
            marginLeft: 10,  
        },
        alertDescription: {
            fontSize: 16,
            textAlign: 'center',
            color: colors.text,
            marginBottom: 20,
        },
        checkInButton: {
            flex: 1,
            backgroundColor: theme.colors.green,  
            paddingVertical: 12,
            borderRadius: 7,
            alignItems: 'center',
            marginRight: 10,  
        },
        viewNotificationButton: {
            flex: 1,
            backgroundColor: theme.colors.blue,  
            paddingVertical: 12,
            borderRadius: 7,
            alignItems: 'center',
            marginLeft: 10,
        },
        alertButton: {
            width: '100%',
            paddingVertical: 12,
            backgroundColor: colors.red, 
            borderRadius: 7,
            alignItems: 'center',
        },
        alertButtonText: {
            color: colors.white,
            fontSize: 16,
            fontWeight: 'bold',
        },
        scrollContainer: {
            paddingBottom: 20, 
            paddingHorizontal: 10, 
        },
        cardsContainer: {
            width: '100%', 
            alignItems: 'center',
        },
        cardWrapper: {
            width: '100%', 
            marginVertical: 10, 
        },
        successText: colors.text


    });
};

export default useStyles;
