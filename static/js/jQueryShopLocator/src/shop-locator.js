/*------------------------------------------------------------------
 Project:	ShopLocator
 Version:	1.1
 Last change:	28 May 2015
 -------------------------------------------------------------------*/


// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once

    var pluginName = "ShopLocator",
        defaults = {
            pluginStyle: "lollipop",
            paginationStyle: 1,
            preloader: false,
            json: null,
            map:{
                center: [52.2296760, 21.0122290],
                MapType: google.maps.MapTypeId.ROADMAP, //MapTypeId.ROADMAP, MapTypeId.SATELLITE, MapTypeId.HYBRID, MapTypeId.TERRAIN
                disableDefaultUI: false,
                mapStyle: [],
                draggable: true,
                disableDoubleClickZoom: false,
                maxZoom: "",
                minZoom: "",
                scrollwheel: true,
                zoom: 10,
                allMarkersInViewport: true
            },
            infoBubble:{
                visible: false,
                padding: 0,
                borderRadius: 4,
                borderWidth: 0,
                borderColor: "#fff",
                backgroundColor: "#fff",
                shadowStyle: 0,
                minHeight: null,
                maxHeight: 135,
                minWidth: 200,
                maxWidth: null,
                arrowStyle: 0,
                arrowSize: 20,
                arrowPosition: 50,
                hideCloseButton: false,
                closeSrc: "assets/js/jQueryShopLocator/src/style/closeButton.svg",
                offsetTop: 10,
                offsetRight: 10,
                disableAutoPan: false,
                getDirectionsButton: true,
                getDirectionsButtonName: "Get Directions",
                directionsUseGeolocation: true
            },
            markersIcon: "assets/js/jQueryShopLocator/src/style/lollipop/images/marker.png",
            marker: {
                latlng: [52.2296760, 21.0122290],
                animation: false, //google.maps.Animation.DROP, google.maps.Animation.BOUNCE
                title: "CreateIT",
                street: "",
                zip: "",
                city: ""
            },
            cluster:{
                enable: false,
                clusterClass: "cluster",
                gridSize: 50,
                maxZoom: 11,
                style:{
                    anchorIcon: [0,0],
                    anchorText: [0,0],
                    backgroundPosition: "0 0",
                    fontFamily: 'Arial,sans-serif',
                    fontStyle: 'normal',
                    textColor: 'white',
                    fontWeight: 'bold',
                    textSize: 18,
                    heightSM: 60,
                    widthSM: 54,
                    heightMD: 60,
                    widthMD: 54,
                    heightBIG: 60,
                    widthBIG: 54,
                    iconSmall: "assets/js/jQueryShopLocator/src/style/lollipop/images/clusterSmall.png",
                    iconMedium: "assets/js/jQueryShopLocator/src/style/lollipop/images/clusterMedium.png",
                    iconBig: "assets/js/jQueryShopLocator/src/style/lollipop/images/clusterBig.png"
                }
            },
            sidebar:{
                visible: false,
                units: "km",
                selectSection:{
                    visible: false,
                    pathToJSONDirectory: "assets/js/jQueryShopLocator/src/json/",
                    difFiles: [["First Region", "markers"], ["Second Region", "diffmarkers"]],
                    fileTypes: "json"
                },
                searchBox: {
                    visible: false,
                    findPlaceBy: "cities",
                    searchByCountry: [false, "us"],
                    search: false,
                    searchRadius: 20
                },
                results:{
                    visibleInFirstPage: true,
                    pageSize: 10,
                    currentPage: 1,
                    paginationItems: 5
                }
            }
        };

    var openInfoWindow;

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend(true, {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.settings).
            this.loadDependences(this, this.element, this.settings);
            this.setUpScriptBody(this.element, this.settings);
            this.setUpMap(this.element, this.settings);

        },
        //Load important scripts:
        //    - markerclusterer.js https://github.com/mahnunchik/markerclustererplus
        //    - infobubble.js https://github.com/googlemaps/js-info-bubble
        loadDependences: function ( constructor, element, settings) {
            if($('#markerclusterer').length === 0){
                var src="assets/js/jQueryShopLocator/src/dependences/markerclusterer.js";
                var sdk = $('<script id="markerclusterer" type="text/javascript"></script>');
                sdk.attr("src", src);
                sdk.appendTo($('head'));
            }
            if($('#infobubble').length === 0){
                var src2="assets/js/jQueryShopLocator/src/dependences/infobubble.js";
                var sdk2 = $('<script id="infobubble" type="text/javascript"></script>');
                sdk2.attr("src", src2);
                sdk2.appendTo($('head'));
            }
        },
        //Prepares DOM body for plugin elements
        setUpScriptBody: function (element, settings) {
            var sidebarBody;
            $(element).addClass(settings.pluginStyle);
            if(settings.sidebar.visible == true){
                element.innerHTML = "<div class='row'>"+"<div class='ct-googleMap--SidebarCol'>"+"<div class='ct-googleMap--sidebar'></div>"+"</div>"+"<div class='ct-googleMap--MapCol'>"+"<div class='ct-googleMap ct-js-googleMap' id='map_canvas'></div>"+"</div>"+"</div>";
                sidebarBody = $(element).find('.ct-googleMap--sidebar');
                if(settings.sidebar.selectSection.visible == true){
                    sidebarBody.append("<div class='ct-googleMap--selectContainer'>"+"<select class='ct-googleMap--select'></select>"+"</div>");
                    this.createSelectSection(element, settings);
                }
                if(settings.sidebar.searchBox.visible == true || settings.sidebar.searchBox.search == true){
                    sidebarBody.append("<div class='ct-googleMap--searchContainer'>"+"<input type='text' class='ct-googleMap--search' id='searchGmaps' placeholder='Code or city'>"+"</div>");
                    if(settings.sidebar.searchBox.search == true){
                        sidebarBody.append("<div class='ct-googleMap--resultsCounter'></div>"+"<div class='ct-googleMap--results'></div>");
                    }else if(settings.sidebar.results.visibleInFirstPage == true){
                        sidebarBody.append("<div class='ct-googleMap--results'></div>")
                    }
                }
                if(settings.preloader == true){
                    $(element).append("<div class='ct-preloader'><div class='ct-preloaderCenter'><div class='ct-preloader-content'><span></span><span></span><span></span><span></span><span></span></div></div> </div>");
                }
            }else{
                element.innerHTML = "<div class='ct-googleMap ct-js-googleMap' id='map_canvas'></div>";
            }
        },
        //Create map with added options, call marker function
        setUpMap: function (element, settings) {
            var selectorMap = $(element).find('.ct-js-googleMap');
            var infoWindow, mapCanvas, bounds, draggable;
            if(window.screen.width < 998){
                draggable = false
            }else{
                draggable = settings.map.draggable
            }
            mapCanvas = new google.maps.Map(selectorMap[0], {
                center: new google.maps.LatLng(settings.map.center[0], settings.map.center[1]),
                mapTypeId: settings.map.MapType,
                styles: settings.map.mapStyle,
                disableDefaultUI: settings.map.disableDefaultUI,
                draggable: draggable,
                disableDoubleClickZoom: settings.map.disableDoubleClickZoom,
                maxZoom: settings.map.maxZoom,
                minZoom: settings.map.minZoom,
                scrollwheel: settings.map.scrollwheel,
                zoom: settings.map.zoom
            });
            if(settings.infoBubble.visible == true){
                ////Creates a infowindow object.
                infoWindow = new google.maps.InfoWindow();
            }
            //Mapping markers on the map
            bounds = new google.maps.LatLngBounds();

            //Fits the map bounds
            //mapCanvas.fitBounds(bounds);

            this.displayMarkers(this, element, mapCanvas, bounds, settings);
        },
        //JSon function for different files
        JSonMainFunction: function (constructor, searchBox, data, arrayMarker, element, map, bounds, settings) {
            var clearClusterer;
            var dataMarkers, marker, cluster, clusterStyles, clusterOptions;
            //var gmarkers = [];
            clusterStyles = [
                {
                    anchorIcon: settings.cluster.style.anchorIcon,
                    anchorText: settings.cluster.style.anchorText,
                    backgroundPosition: settings.cluster.style.backgroundPosition,
                    fontFamily: settings.cluster.style.fontFamily,
                    fontStyle: settings.cluster.style.fontStyle,
                    textColor: settings.cluster.style.textColor,
                    fontWeight: settings.cluster.style.fontWeight,
                    textSize: settings.cluster.style.textSize,
                    url: settings.cluster.style.iconSmall,
                    height: settings.cluster.style.heightSM,
                    width: settings.cluster.style.widthSM
                },
                {
                    anchorIcon: settings.cluster.style.anchorIcon,
                    anchorText: settings.cluster.style.anchorText,
                    backgroundPosition: settings.cluster.style.backgroundPosition,
                    fontFamily: settings.cluster.style.fontFamily,
                    fontStyle: settings.cluster.style.fontStyle,
                    textColor: settings.cluster.style.textColor,
                    fontWeight: settings.cluster.style.fontWeight,
                    textSize: settings.cluster.style.textSize,
                    url: settings.cluster.style.iconMedium,
                    height: settings.cluster.style.heightMD,
                    width: settings.cluster.style.widthMD
                },
                {
                    anchorIcon: settings.cluster.style.anchorIcon,
                    anchorText: settings.cluster.style.anchorText,
                    backgroundPosition: settings.cluster.style.backgroundPosition,
                    fontFamily: settings.cluster.style.fontFamily,
                    fontStyle: settings.cluster.style.fontStyle,
                    textColor: settings.cluster.style.textColor,
                    fontWeight: settings.cluster.style.fontWeight,
                    textSize: settings.cluster.style.textSize,
                    url: settings.cluster.style.iconBig,
                    height: settings.cluster.style.heightBIG,
                    width: settings.cluster.style.widthBIG
                }
            ];
            clusterOptions = {
                clusterClass: settings.cluster.clusterClass,
                gridSize: settings.cluster.gridSize,
                maxZoom: settings.cluster.maxZoom,
                styles: clusterStyles
            };

            $(element).find('.ct-googleMap--search').val('');
            arrayMarker = [];
            dataMarkers = data;
            dataMarkers.sort(function(a, b){
                var a1= a.title, b1= b.title;
                if(a1== b1) return 0;
                return a1> b1? 1: -1;
            });
            bounds = new google.maps.LatLngBounds(null);
            for(var i = 0; dataMarkers.length > i; i++){
                marker = constructor.createMarkers(map, searchBox, dataMarkers[i], settings);
                bounds.extend (marker.position);
                arrayMarker.push(marker);
                if(settings.sidebar.visible == true && settings.sidebar.results.visibleInFirstPage == true){
                    constructor.createSidebarButtons(map, marker, element, settings);
                }
            }
            constructor.resultsInPage(constructor, element, settings);
            if(settings.cluster.enable == true){
                clearClusterer = true;
                cluster = new MarkerClusterer(map, arrayMarker, clusterOptions);
            }
            // some logic
            if(settings.map.allMarkersInViewport == true){
                map.fitBounds (bounds);
            }
            if(settings.sidebar.searchBox.visible == true || settings.sidebar.searchBox.search == true){
                constructor.searchPlace(constructor, searchBox, map, arrayMarker, element, settings);
            }
            return cluster
        },
        //Add markers to map
        displayMarkers: function (constructor, element, map, bounds, settings) {
            var gmarkers = [];
            var selectDOM, sidebarItem, selectValue, marker, cluster, clearClusterer, searchBox, optionsSearchBox;
            selectDOM = $(element).find('.ct-googleMap--select');
            if(settings.preloader == true){
                var $preloader = $(element).find('.ct-preloader');
            }
            if(settings.sidebar.searchBox.visible == true || settings.sidebar.searchBox.search == true){
                if(settings.sidebar.searchBox.searchByCountry[0] == true){
                    optionsSearchBox = {
                        types: ["("+settings.sidebar.searchBox.findPlaceBy+")"],
                        componentRestrictions: {country: settings.sidebar.searchBox.searchByCountry[1]}
                    };
                }else{
                    optionsSearchBox = {
                        types: ["("+settings.sidebar.searchBox.findPlaceBy+")"]
                    };
                }
                // Create the search box and link it to the UI element.
                var input = $(element).find('.ct-googleMap--search');
                //var myPosition = [];

                searchBox = new google.maps.places.Autocomplete(
                    /** @type {HTMLInputElement} */(input[0]), optionsSearchBox);
            }
            if(settings.sidebar.selectSection.visible == true && settings.sidebar.visible == true){
                $( selectDOM )
                    .change(function() {
                        $(this).find('option:selected').each(function () {
                            sidebarItem = $(element).find('.ct-googleMap--sidebarItem');
                            sidebarItem.remove();
                            selectValue = selectDOM.val();
                            $(element).find('.ct-googleMap--resultsCounter').html('');
                            if(settings.preloader == true){
                                $preloader.removeClass('make-hidden');
                            }
                            $.ajax({
                                url: settings.sidebar.selectSection.pathToJSONDirectory+selectValue+"."+settings.sidebar.selectSection.fileTypes,
                                dataType: 'json',
                                success: function(data) {
                                    if(clearClusterer == true){
                                        cluster.clearMarkers();
                                        clearClusterer = false;
                                    }
                                    cluster =  constructor.JSonMainFunction(constructor,searchBox, data, gmarkers, element, map, bounds, settings);
                                    clearClusterer = true;
                                    if(settings.preloader == true){
                                        $preloader.addClass('make-hidden');
                                    }
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    console.log('ERROR', textStatus, errorThrown);
                                }
                            });
                        })
                    })
                    .trigger( "change" );
            }else{
                if(settings.json == null){
                    var singleMarker = [
                        {"lat":settings.marker.latlng[0], "lng":settings.marker.latlng[1], "title":settings.marker.title, "street":settings.marker.street, "city":settings.marker.city, "zip":settings.marker.zip},
                    ];
                    marker = constructor.createMarkers(map, searchBox, singleMarker[0], settings);
                    gmarkers.push(marker);
                    if(settings.map.allMarkersInViewport == true){
                        bounds.extend (marker.position);
                        map.fitBounds (bounds);
                    }
                    if(settings.sidebar.visible == true && settings.sidebar.searchBox.visible == true || settings.sidebar.searchBox.search == true){
                        constructor.searchPlace(constructor, searchBox, map, gmarkers, element, settings);
                    }
                }else{
                    $.ajax({
                        url: settings.json,
                        dataType: 'json',
                        success: function(data) {
                            if(clearClusterer == true){
                                cluster.clearMarkers();
                                clearClusterer = false;
                            }
                            cluster =  constructor.JSonMainFunction(constructor, searchBox, data, gmarkers, element, map, bounds, settings);
                            clearClusterer = true;
                            if(settings.preloader == true){
                                $preloader.addClass('make-hidden');
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log('ERROR', textStatus, errorThrown);
                        }
                    });
                }
            }
        },
        //Extend displayMarkers function, full setup of marker
        createMarkers: function(map, searchBox, markerTable, settings){
            var getDirectinButton = "";
            var marker = new google.maps.Marker({
                position : new google.maps.LatLng(markerTable.lat, markerTable.lng),
                animation: settings.marker.animation,
                map : map,
                title: markerTable.title,
                icon: new google.maps.MarkerImage(settings.markersIcon)
            });
            var markerPosition = marker.getPosition();
            if(settings.infoBubble.getDirectionsButton == true){
                getDirectinButton = "<a class='ct-button--direction make-hidden' href='' target='_blank'>"+settings.infoBubble.getDirectionsButtonName+"</a>";
            }
            if(settings.infoBubble.visible == true) {
                var infoBubble = new InfoBubble({
                    visible: settings.infoBubble.visible,
                    content: "<div class = 'ct-googleMap--InfoWindowBody' style='text-align: center;'>"+
                    "<h4>"+markerTable.title+"</h4>"+
                    "<span>"+markerTable.street+"</span>"+
                    "<span>"+markerTable.zip+" - "+markerTable.city+"</span>"+
                    getDirectinButton+
                    "</div>",
                    backgroundClassName: 'ct-googleMap--customInfoWindow',
                    padding: settings.infoBubble.padding,
                    borderRadius: settings.infoBubble.borderRadius,
                    borderWidth: settings.infoBubble.borderWidth,
                    borderColor: settings.infoBubble.borderColor,
                    backgroundColor: settings.infoBubble.backgroundColor,
                    shadowStyle: settings.infoBubble.shadowStyle,
                    minHeight: settings.infoBubble.minHeight,
                    maxHeight: settings.infoBubble.maxHeight,
                    minWidth: settings.infoBubble.minWidth,
                    maxWidth: settings.infoBubble.maxWidth,
                    arrowStyle: settings.infoBubble.arrowStyle,
                    arrowSize: settings.infoBubble.arrowSize,
                    arrowPosition: settings.infoBubble.arrowPosition,
                    hideCloseButton: settings.infoBubble.hideCloseButton,
                    closeSrc: settings.infoBubble.closeSrc,
                    offsetTop: settings.infoBubble.offsetTop,
                    offsetRight: settings.infoBubble.offsetRight,
                    disableAutoPan: settings.infoBubble.disableAutoPan
                });

                google.maps.event.addListener(marker, "click", function () {
                    if(openInfoWindow){
                        openInfoWindow.close()
                    }
                    infoBubble.open(map, marker);
                    openInfoWindow = infoBubble;
                });
                if(settings.infoBubble.getDirectionsButton == true){
                    if(settings.infoBubble.directionsUseGeolocation == false && settings.sidebar.searchBox.visible == true && settings.sidebar.visible == true){
                        var place, directionsLat, directionsLng;
                        var makeVis = false;
                        google.maps.event.addListener(searchBox, 'places_changed', function() {
                            place = searchBox.getPlace();
                            directionsLat = place.geometry.location.lat();
                            directionsLng = place.geometry.location.lng();
                            makeVis = true
                        });
                    }

                    google.maps.event.addListener(infoBubble, "domready", function () {
                        var directionButton = $('a.ct-button--direction');
                        if(settings.infoBubble.directionsUseGeolocation == true || settings.sidebar.visible == false){
                            directionButton.removeClass('make-hidden');
                            // Try HTML5 geolocation
                            if(navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(function(position) {
                                    directionButton.each(function(){
                                        $(this).attr("href", "");
                                        $(this).attr("href",'http://maps.google.com/maps?saddr='+position.coords.latitude+","+position.coords.longitude+',&daddr='+markerPosition.lat()+","+markerPosition.lng());
                                    });
                                }, function() {
                                    console.log("Error: The Geolocation service failed.")
                                });
                            } else {
                                // Browser doesn't support Geolocation
                                console.log("Error: Your browser doesn't support geolocation.")
                            }
                        }else{
                            directionButton.each(function(){
                                $(this).attr("href", "");
                                $(this).attr("href",'http://maps.google.com/maps?saddr='+directionsLat+","+directionsLng+',&daddr='+markerPosition.lat()+","+markerPosition.lng());
                            });
                            if(makeVis == true ){
                                directionButton.removeClass('make-hidden')
                            }
                        }
                    });
                }
            }
            google.maps.event.addDomListener(marker, "click", function(){
                map.setCenter(markerPosition);
            });

            return marker;
        },
        //Sidebar buttons of map markers
        createSidebarButtons: function (map, marker, element, settings){
            //Creates a sidebar button
            var ul = $(element).find('.ct-googleMap--results');
            var li = document.createElement("div");
            li.className = "ct-googleMap--sidebarItem";
            google.maps.event.clearListeners(li, 'click');
            li.innerHTML = "<span class='ct-googleMap--sidebarItemTitle'>"+marker.getTitle()+"</span>";
            ul.append(li);

            //Trigger a click event to marker when the button is clicked.
            google.maps.event.addDomListener(li, "click", function(){
                google.maps.event.trigger(marker, "click");
                map.setZoom(12);
                map.setCenter(marker.getPosition());
            });
        },
        //Google map search function.
        searchPlace: function (constructor, searchBox, map, markerTable, element, settings) {
            var locations = [];

            // Listen for the event fired when the user selects an item from the
            // pick list. Retrieve the matching places for that item.

            google.maps.event.addListener(searchBox, 'place_changed', function() {
                //places = null;

                var place = searchBox.getPlace();
                var searchLocationPosition = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());

                if(settings.sidebar.searchBox.search == true){
                    constructor.displaySearchResults(constructor, map, markerTable, searchLocationPosition, element, settings);
                }

                map.setCenter(place.geometry.location);
                if (place.length == 0) {
                    return;
                }
                map.setZoom(11);
            });
        },
        //Display results
        displaySearchResults: function(constructor, map, markerTable, position, element, settings){
            var sidebarItem, units, unitsLabel;
            var searchDistance = [];
            var resultsCounter = $(element).find('.ct-googleMap--resultsCounter');
            if(settings.sidebar.units == "km"){
                units = 1000;
                unitsLabel = "km"
            }else{
                units = 1609;
                unitsLabel = "mile"
            }
            sidebarItem = $(element).find('.ct-googleMap--sidebarItem');
            sidebarItem.remove();

            for(var i=0; markerTable.length > i; i++ ){

                var lat = markerTable[i].getPosition().lat();
                var lng = markerTable[i].getPosition().lng();

                var latlng = new google.maps.LatLng(lat,lng);
                var itemDistance = google.maps.geometry.spherical.computeDistanceBetween(position, latlng)/units;
                if( itemDistance < settings.sidebar.searchBox.searchRadius){
                    markerTable[i].distance = itemDistance.toFixed(2);
                    searchDistance.push(markerTable[i]);
                }
            }
            searchDistance.sort(function(a, b){
                var a1= parseFloat(a.distance, 10), b1= parseFloat(b.distance, 10);
                { return a1 - b1; }
            });
            for(var j=0; searchDistance.length > j; j++ ){
                constructor.createSidebarButtons(map, searchDistance[j], element, settings);
                $(element).find(".ct-googleMap--sidebarItem:nth-child("+(j+1)+")").append("<span class='ct-googleMap--sidebarItemDistance'>"+searchDistance[j].distance+" "+unitsLabel+"</span>");
            }
            resultsCounter.html('');
            resultsCounter.append("Items"+"<span class='ct-googleMap--itemCounter'>"+searchDistance.length+"</span>");
            constructor.resultsInPage(constructor, element, settings);
        },
        //This function makes all pages of results with pagination, extends displaySearchResults function.
        resultsInPage: function(constructor, element, settings){
            var pageSize = settings.sidebar.results.pageSize;
            var currentPage = settings.sidebar.results.currentPage;
            var pageCounter = 1;
            var sidebarResults = $(element).find('.ct-googleMap--results');
            var pageNav = "<ul class='Navigation'>";
            var pageNavPages = "<li class='paginationCounter'>";

            constructor.sidebarClear(pageCounter, element);

            if(settings.paginationStyle != 1){
                pageNavPages += "</li>";
            }else{
                pageNavPages += "<a rel='1' class='NavPage'>"+1+"</a>";
            }

            sidebarResults.children().each(function(i){
                if(i < pageCounter*pageSize && i >= (pageCounter-1)*pageSize) {
                    $(this).addClass("page"+pageCounter);
                }
                else {
                    $(this).addClass("page"+(pageCounter+1));
                    if(settings.paginationStyle == 1){
                        pageNavPages += "<a rel='"+(pageCounter+1)+"' class='NavPage'>"+(pageCounter+1)+"</a>";
                    }
                    pageCounter ++;
                }
            });
            if(settings.paginationStyle == 1){
                pageNavPages += "</li>";
            }

            // show/hide the appropriate regions
            sidebarResults.children().hide();
            sidebarResults.children(".page"+currentPage).show();

            if(pageCounter <= 1) {
                return;
            }

            //Build pager navigation

            var i = 1;

            pageNav += "<li class='NavigationPrev NavigationDisable Navigation"+i+"'><a rel='"+i+"'>"+"</a></li>";
            pageNav += pageNavPages;
            pageNav += "<li class='NavigationNext Navigation"+(i+1)+"'><a rel='"+(i+1)+"' >"+"</a></li>";
            pageNav += "</ul>";

            $(element).find('.ct-googleMap--sidebar').append(pageNav);

            constructor.pagination(constructor, sidebarResults, pageCounter, pageSize, currentPage, element, settings);
        },
        //Create pagination, extends resultsInPage function
        pagination: function(constructor, sidebarResults, pageCounter, pageSize, currentPage, element, settings){
            var i = 1;
            var k = 1;
            var goToPage;
            var paginationCounter = 1;
            var paginationCounterElement = $(element).find('.paginationCounter');
            var NavigationPrev = $(element).find('.NavigationPrev');
            var NavigationNext = $(element).find('.NavigationNext');

            if(settings.paginationStyle == 2){
                constructor.counterElements(sidebarResults, paginationCounterElement, pageCounter, pageSize, currentPage, element);
            }

            if(settings.paginationStyle == 1){
                paginationCounterElement.children().each(function(i){
                    if(i < paginationCounter*settings.sidebar.results.paginationItems && i >= (paginationCounter-1)*settings.sidebar.results.paginationItems){
                        $(this).addClass("paginationPage"+paginationCounter);
                    }else{
                        $(this).addClass("paginationPage"+(paginationCounter+1));
                        paginationCounter = paginationCounter + 1;
                    }
                });
                paginationCounterElement.children().hide();
                paginationCounterElement.children(".paginationPage"+currentPage).show();
                $(element).find(".NavPage[rel='"+currentPage+"']").addClass('active');

                $(element).find('.NavPage').on("click", function(){
                    var whatPage = $(this).attr('rel');
                    $(this).addClass('active').siblings().removeClass('active');
                    goToPage = true;
                    if(whatPage < i){
                        i = whatPage;
                        NavigationPrev.trigger("click");
                    }else{
                        i = whatPage;
                        NavigationNext.trigger("click");
                    }
                });
            }

            $(element).find('.NavigationPrev').on("click", function(){
                if(goToPage == true){
                    sidebarResults.children().hide();
                    sidebarResults.find(".page"+i).show();
                    if(i==1){
                        $(this).addClass('NavigationDisable');
                    }
                    NavigationNext.removeClass('NavigationDisable');
                    goToPage = false
                }else{
                    if(i == 1){
                        i = 1;
                        sidebarResults.children().hide();
                        sidebarResults.find(".page"+i).show();
                    }else{
                        if(i==2){
                            $(this).addClass('NavigationDisable');
                        }
                        NavigationNext.removeClass('NavigationDisable');
                        i = i-1;
                        sidebarResults.children().hide();
                        sidebarResults.find(".page"+i).show();
                    }
                    if(settings.paginationStyle != 1){
                        paginationCounterElement.children().hide();
                        paginationCounterElement.children(".paginationCount"+i).show();
                    }else{
                        if(i<k*settings.sidebar.results.paginationItems && i == (k-1)*settings.sidebar.results.paginationItems){
                            k=k-1;
                            paginationCounterElement.children().hide();
                            paginationCounterElement.children(".paginationPage"+k).show();
                        }else{
                            if(i<k*settings.sidebar.results.paginationItems && i >= (k-1)*settings.sidebar.results.paginationItems){
                                paginationCounterElement.children().hide();
                                paginationCounterElement.children(".paginationPage"+k).show();
                            }else{
                                k=k-1;
                                paginationCounterElement.children().hide();
                                paginationCounterElement.children(".paginationPage"+k).show();
                            }
                        }
                        $(element).find(".NavPage[rel='"+i+"']").addClass('active').siblings().removeClass('active');
                    }
                }
            });
            $(element).find('.NavigationNext').on("click", function(){
                if(goToPage == true){
                    sidebarResults.children().hide();
                    sidebarResults.find(".page"+i).show();
                    if(i==pageCounter){
                        $(this).addClass('NavigationDisable');
                    }
                    NavigationPrev.removeClass('NavigationDisable');
                    goToPage = false
                }else{
                    if(i==pageCounter){
                        i = pageCounter;
                        sidebarResults.children().hide();
                        sidebarResults.find(".page"+i).show();
                    }
                    else{
                        if(i==pageCounter-1){
                            $(this).addClass('NavigationDisable');
                        }
                        NavigationPrev.removeClass('NavigationDisable');
                        i= parseInt((i), 10)+1;
                        sidebarResults.children().hide();
                        sidebarResults.find(".page"+i).show();
                    }
                    if(settings.paginationStyle != 1){
                        paginationCounterElement.children().hide();
                        paginationCounterElement.children(".paginationCount"+i).show();
                    }else{
                        if(i<k*settings.sidebar.results.paginationItems && i >= (k-1)*settings.sidebar.results.paginationItems || i==k*settings.sidebar.results.paginationItems){
                            paginationCounterElement.children().hide();
                            paginationCounterElement.children(".paginationPage"+k).show();
                        }else{
                            k ++;
                            paginationCounterElement.children().hide();
                            paginationCounterElement.children(".paginationPage"+k).show();
                        }
                        $(element).find(".NavPage[rel='"+i+"']").addClass('active').siblings().removeClass('active');
                    }
                }
            })

        },
        //Count how much items is found, extends pagination function
        counterElements: function(sidebarResults, paginationCounterElement, pageCounter, pageSize, currentPage, element){
            var tableResults = [];

            for(var j = 0; pageCounter > j ; j++){
                tableResults.push($(element).find('.page'+(1+j)).length);
                if(tableResults[j]>1){
                    paginationCounterElement.append("<span class='paginationCount"+(j+1)+"'>"+(1+j*pageSize)+" - "+ (tableResults[j]+j*pageSize)+" of "+sidebarResults.children().length+"</span>");
                }
                else {
                    paginationCounterElement.append("<span class='paginationCount"+(j+1)+"'>"+(tableResults[j]+j*pageSize)+" of "+sidebarResults.children().length+"</span>");
                }
            }
            paginationCounterElement.children().hide();
            $(element).find(".paginationCount"+currentPage).show();
        },
        //Create select with multiple json files
        createSelectSection: function(element, settings){
            var difFiles = settings.sidebar.selectSection.difFiles;
            var sidebarSelect = $(element).find('.ct-googleMap--select');
            for(var k = 0; difFiles.length > k; k++){
                sidebarSelect.append("<option value='"+difFiles[k][1]+"'>"+difFiles[k][0]+"</option>")
            }
        },
        //Clear sidebar
        sidebarClear: function(pageCounter, element){
            $(element).find('.Navigation').remove();
            pageCounter = 1;
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };


})( jQuery, window, document );