'use strict';

$(function() {
    $('#locationModal').modal('show');

    $('#manual-location').submit(function(e) {
        e.preventDefault();
        areaCode = $('#area-code').val();
        // TODO: Remove/handle initMap here.
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
        $('#mapsModal').modal('show');
    });

    $('#mapsModal').on('shown.bs.modal', function (e) {
        // Only start the map once, after the first modal is shown completely.
        initMap(userLocation, areaCode);
        $('#mapsModal').off('shown.bs.modal');
    });
});
