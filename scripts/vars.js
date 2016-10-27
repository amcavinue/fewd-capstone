'use strict';

var userLocation,
    areaCode,
    map,
    infowindow,
    apiKeyGm = 'AIzaSyDo5LxyVUv5EwGQBwaveIF4d0MaIVD_Dd8',
    bounds = new google.maps.LatLngBounds(),
    radius = 15,
    markersArray = [],
    delay = 10,
    theatreRequests = [];

// Variables that hold movie data.
var movies,
    theatres = {};
