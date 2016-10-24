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

function placeMarkers(index) {
    clearMarkers();

    for (var i = 0; i < movies[index].showtimes.length; i++) {
        if (theatres[movies[index].showtimes[i].theatre.id]) {
            createMarker(theatres[movies[index].showtimes[i].theatre.id], movies[index].showtimes[i].theatre.name);
        }
    }
}

function clearMarkers() {
    for (var i = 0; i < markersArray.length; i++ ) {
        markersArray[i].setMap(null);
    }
    markersArray.length = 0;
}

function createMarker(position, name) {
    var marker = new google.maps.Marker({
        map: map,
        position: position
    });

    markersArray.push(marker);

    // Extend the map to include the marker.
    bounds.extend(marker.getPosition());

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(name);
        infowindow.open(map, this);
    });
}
