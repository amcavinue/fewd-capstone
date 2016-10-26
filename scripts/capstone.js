'use strict';

$(function() {
    checkChrome();

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
        $('#maps-movie-title').text($(this).find('.movie-title').text());
        $('#mapsModal').modal('show');
    });

    $('#mapsModal').on('shown.bs.modal', function (e) {
        google.maps.event.trigger(map, 'resize');
        map.fitBounds(bounds);
    });
});

// Check if the browser is a verion of Google Chrome.
// http://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome
function checkChrome() {
    var isChromium = window.chrome,
        winNav = window.navigator,
        vendorName = winNav.vendor,
        isOpera = winNav.userAgent.indexOf("OPR") > -1,
        isIEedge = winNav.userAgent.indexOf("Edge") > -1,
        isIOSChrome = winNav.userAgent.match("CriOS");

    if(isIOSChrome || isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
        $('#auto-location-container').hide();
    }
}
