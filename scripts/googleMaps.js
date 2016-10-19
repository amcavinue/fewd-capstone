'use strict';

var map;
var infowindow;
var apiKeyGm = 'AIzaSyDo5LxyVUv5EwGQBwaveIF4d0MaIVD_Dd8';

function initMap(userLocation, areaCode) {
    var pyrmont = {lat: -33.867, lng: 151.195};

    if (userLocation === undefined) {
        userLocation = codeAddress(areaCode);
    }

    map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    /*service.nearbySearch({
        location: userLocation,
        radius: 500,
        type: ['store']
    }, callback);*/

    service.textSearch({
        location: userLocation,
        radius: '500',
        query: 'movies'
    }, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function codeAddress(zip) {
    var geocoder = new google.maps.Geocoder(),
        location;

    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json",
        async: false,
        data: {
            address: zip,
            key: apiKeyGm
        }
    }).done(function(data) {
        location = data.results[0].geometry.location;
    }).fail(function() {
        alert('failed');
    });

    return location;
}
