export const lightTheme = {
    dark: false,
    colors: {
        primary: '#262626',
        background: '#FFFFFF',
        card: '#FFFFFF',
        text: '#262626',
        tabIconDefault: '#A5A5A5',
        tint: '#262626',
        border: '#ECECEC',
        notification: 'rgb(255, 69, 58)', // #TODO Check this

        darkText: '#262626',

        white: '#FFFFFF',
        red: '#701F33',
        grey: '#ECECEC',
        green: '#72AA69',
        blue: '#444D7C'
    }

};

export const darkTheme = {
    dark: true,
    colors: {
        primary: '#FFFFFF',
        background: '#262626',
        card: '#e8e8e8',
        text: '#FFFFFF',
        tabIconDefault: '#A5A5A5',
        tint: '#FFFFFF',
        border: '#A5A5A5',
        notification: 'rgb(255, 69, 58)', // #TODO Check this

        darkText: '#262626',

        white: '#FFFFFF',
        red: '#701F33',
        grey: '#A5A5A5',
        green: '#72AA69',
        blue: '#444D7C'
    },
};


export const mapLightTheme = [
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#a7a7a7"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#737373"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#efefef"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#dadada"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#696969"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#b3b3b3"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#d6d6d6"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "weight": 1.8
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#d7d7d7"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "color": "#808080"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#ffb800"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#444d7c"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "saturation": "-7"
            },
            {
                "color": "#ececec"
            }
        ]
    }
]


export const mapDarkTheme = [{
    "featureType": "all",
    "elementType": "labels.text.fill",
    "stylers": [{"saturation": 36}, {"color": "#000000"}, {"lightness": 40}]
}, {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [{"visibility": "on"}, {"color": "#000000"}, {"lightness": 16}]
}, {
    "featureType": "all",
    "elementType": "labels.icon",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#000000"}, {"lightness": 20}]
}, {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#000000"}, {"lightness": 17}, {"weight": 1.2}]
}, {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [{"color": "#000000"}, {"lightness": 20}]
}, {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{"color": "#000000"}, {"lightness": 21}]
}, {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#000000"}, {"lightness": 17}]
}, {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#000000"}, {"lightness": 29}, {"weight": 0.2}]
}, {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{"color": "#000000"}, {"lightness": 18}]
}, {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [{"color": "#000000"}, {"lightness": 16}]
}, {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [{"color": "#000000"}, {"lightness": 19}]
}, {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{"visibility": "on"}, {"color": "#c7c9ff"}]
}, {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#2b3254"}, {"lightness": 17}]}]



