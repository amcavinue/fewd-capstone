'use strict';

var userLocation,
    areaCode,
    map,
    infowindow,
    apiKeyGm = 'AIzaSyCfM51UK_YjLx3blEDKpecD6YA0z_Tmlkw',
    bounds = new google.maps.LatLngBounds(),
    radius = 15,
    markersArray = [];

// Variables that hold movie data.
var movies,
    theatres = {};
