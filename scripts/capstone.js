'use strict';

$(function() {
    $('#locationModal').modal('show');

    $('#manual-location').submit(function(e) {
        e.preventDefault();
        areaCode = $('#area-code').val();
        // Initialize the maps modal.
        initMap();
        getMovies();
        $('#locationModal').modal('hide');
    });

    $('#auto-location').click(function(e) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getAreaCode);
            $('#locationModal').modal('hide');
        }
    });

    $('#movies-list').on('click', 'li', function() {
        placeMarkers($(this).data('index'));
        $('#mapsModal').modal('show');
    });

    $('#mapsModal').on('shown.bs.modal', function (e) {
        google.maps.event.trigger(map, 'resize');
        map.fitBounds(bounds);
    });
});
