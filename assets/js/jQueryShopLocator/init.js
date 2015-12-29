(function ($) {
    "use strict";

    $(document).ready(function () {

        //init map

        $(".ct-js-googleMap").ShopLocator({
            map: {
                center: [40.712784, -74.005941],
                zoom: 15,
                allMarkersInViewport: false,
                scrollwheel: false,
                mapStyle: [{
                    "featureType": "landscape",
                    "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]
                }, {
                    "featureType": "poi",
                    "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]
                }, {
                    "featureType": "road.highway",
                    "stylers": [{"saturation": -100}, {"visibility": "simplified"}]
                }, {
                    "featureType": "road.arterial",
                    "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]
                }, {
                    "featureType": "road.local",
                    "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]
                }, {
                    "featureType": "transit",
                    "stylers": [{"saturation": -100}, {"visibility": "simplified"}]
                }, {
                    "featureType": "administrative.province",
                    "stylers": [{"visibility": "off"}]
                }, {
                    "featureType": "water",
                    "elementType": "labels",
                    "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]
                }, {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]
                }]
            },
            markersIcon: "assets/images/marker.png",
            marker: {
                latlng: [40.712784, -74.005941]
            }
        });
        $(".ct-js-googleMap--search").ShopLocator({
            pluginStyle: "material",
            map: {
                scrollwheel: false,
                mapStyle: [{
                    "featureType": "landscape",
                    "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]
                }, {
                    "featureType": "poi",
                    "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]
                }, {
                    "featureType": "road.highway",
                    "stylers": [{"saturation": -100}, {"visibility": "simplified"}]
                }, {
                    "featureType": "road.arterial",
                    "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]
                }, {
                    "featureType": "road.local",
                    "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]
                }, {
                    "featureType": "transit",
                    "stylers": [{"saturation": -100}, {"visibility": "simplified"}]
                }, {
                    "featureType": "administrative.province",
                    "stylers": [{"visibility": "off"}]
                }, {
                    "featureType": "water",
                    "elementType": "labels",
                    "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]
                }, {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]
                }]
            },
            markersIcon: "assets/images/marker.png",
            infoBubble: {
                visible: true,
                arrowPosition: 50,
                minHeight: 135,
                maxHeight: null,
                minWidth: 170,
                maxWidth: 250
            },
            cluster:{
                enable: true,
                gridSize: 50,
                style:{
                    textColor: '#4757a3',
                    textSize: 18,
                    heightSM: 42,
                    widthSM: 42,
                    heightMD: 56,
                    widthMD: 56,
                    heightBIG: 75,
                    widthBIG: 75,
                    iconSmall: "assets/js/jQueryShopLocator/src/style/cosmic/images/clusterSmall.png",
                    iconMedium: "assets/js/jQueryShopLocator/src/style/cosmic/images/clusterMedium.png",
                    iconBig: "assets/js/jQueryShopLocator/src/style/cosmic/images/clusterBig.png"
                }
            },
            sidebar: {
                visible: true,
                selectSection:{
                    visible: true
                },
                searchBox: {
                    visible: true,
                    search: true
                },
                results:{
                    pageSize: 8
                }
            }
        });
    });
})(jQuery);