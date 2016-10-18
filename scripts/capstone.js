'use strict';

var hasLocation = false,
    mapStarted = false;

$(function() {
    $('#movies-list').on('click', 'li', function() {
        if (hasLocation) {
            $('#mapsModal').modal('show');
        } else {
            getLocation();
        }
    });

    $('#mapsModal').on('shown.bs.modal', function (e) {
        // Only start the map once, after the first modal is shown completely.
        if (!mapStarted) {
            initMap();
            mapStarted = true;
        }
    })
});

function getLocation() {
    $('#locationModal').modal('show');
    hasLocation = true;
}
