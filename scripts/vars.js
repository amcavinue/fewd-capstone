'use strict';

var userLocation,
    areaCode;
var apikey = "w95yuuq83vtgapdw6vak5nf2";
var baseUrl = "http://data.tmsapi.com/v1.1";
var showtimesUrl = baseUrl + '/movies/showings';
var d = new Date();
var today = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
var theatres = {};
var map;
var infowindow;
var apiKeyGm = 'AIzaSyDo5LxyVUv5EwGQBwaveIF4d0MaIVD_Dd8';
var bounds = new google.maps.LatLngBounds();
var radius = 15;
var markersArray = [];
