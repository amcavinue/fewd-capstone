'use strict';

function initMap(userLocation, areaCode) {
    if (userLocation === undefined) {
        userLocation = codeAddress(areaCode);
    }

    map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: radius
    });

    infowindow = new google.maps.InfoWindow();
}

function placeMarkers(title) {
    clearMarkers();

    for (var key in theatres[title]) {
        createMarker(theatres[title][key]);
    }

    map.fitBounds(bounds);
}

function clearMarkers() {
    for (var i = 0; i < markersArray.length; i++ ) {
        markersArray[i].setMap(null);
    }
    markersArray.length = 0;
}

function createMarker(position) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location // TODO: position
    });

    markersArray.push(marker);

    // Extend the map to include the marker.
    bounds.extend(marker.getPosition());

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}
