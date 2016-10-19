'use strict';

var hasLocation = false,
    mapStarted = false,
    userLocation,
    areaCode;

$(function() {
    $('#movies-list').on('click', 'li', function() {
        if (hasLocation) {
            $('#mapsModal').modal('show');
        } else {
            $('#locationModal').modal('show');
            hasLocation = true;
        }
    });

    $('#mapsModal').on('shown.bs.modal', function (e) {
        // Only start the map once, after the first modal is shown completely.
        if (!mapStarted) {
            initMap(userLocation, areaCode);
            mapStarted = true;
        }
    });

    $('#manual-location').submit(function(e) {
        e.preventDefault();
        areaCode = $('#area-code').val();
        $('#locationModal').modal('hide');
    });

    $('#auto-location').click(function(e) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handlePosition);
        }
    });
});

function handlePosition(position) {
    userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
}
