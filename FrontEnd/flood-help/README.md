# Front End Docs

# Hi-Fidelity Prototype: 
- **Figma Link:** https://www.figma.com/design/L2T1b2bqz5sFVOV0v0tAuG/Prototype?node-id=0-1&t=YrOXl0Z4KgqZF7qr-1
- **View-Access password:** amber-cloudy-foam-detach
- **PowerPoint Link:** https://www.canva.com/design/DAGOlT_KycE/ikoF0-7dEFMcLY00ujxmTg/edit

# Technologies Used

- **React Native:** A framework for building cross-platform mobile apps using JavaScript.
- **Expo:** A platform for building React Native applications faster, with managed workflow for easier access to native APIs.
- **Google Maps API:** For interactive mapping and geolocation services.
- **Expo Location:** For accessing the user's location in real-time.
- **React Navigation:** For handling screen navigation.

# Prerequisites

To run this project, you need the following tools installed:

Node.js: Download and install from Node.js Official Website.

After installation, you can verify that Node.js and npm were installed successfully by running the following commands in your terminal or command prompt:

``` bash
# Verify Node.js installation
node -v
```

``` bash
# Verify npm installation
npm -v
```

Expo CLI: You can install Expo CLI globally using npm

``` bash
npm install -g expo-cli
```

# Installation

## 0. Updating API endpoint (optional)
If you are running our api server yourself (see /Backend/ReadMe.md for details on how to setup) and want the app to use it (this will be required once we stop the aws instance that is running the public api server next year) you will need to change some configs in the code. 
#### update endpoint in code
open FrontEnd/flood-help/hooks/useAPI.js and change 'http://54.206.190.121:5000 on line 5 to the address of your running API serve

## 1. Navigate to the project directory:

``` bash
cd FrontEnd/flood-help
```

## 2. Install dependencies: The project uses npm or yarn to manage dependencies. You can install all dependencies using:

``` bash
npm install
```

or if you're using yarn:

``` bash
yarn install
```

# Running the app

## 1. Start the Expo Development Server:

``` bash
npx expo start
```

## 2. Run on your mobile device:

Download Expo Go from the App Store or Google Play.

Scan the QR code provided by Expo after running the expo start command. Note the current version of the app was built to be fully functional for andriod devices only at the moment.

Please note that development has been done primarily for Android - while most features will work on IOS you may experience some bugs relating to formatting and styling of screens. 

# API Integration

This project consumes several backend API endpoints to fetch flood reports, real-time alerts, and historical flood data, etc. 

## Example API call:

``` javascript
const response = await fetch(`http://54.206.190.121:5000/externalData/get_alerts`, {
    method: 'GET',
});
```
