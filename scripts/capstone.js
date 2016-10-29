'use strict';

$(function() {
    // Fix geolocation bug in Chrome.
    checkChrome();

    // The entry modal asking for the user's location.
    $('#locationModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: false
    });

    // Handle zip code insertion from the user.
    $('#manual-location').submit(function(e) {
        e.preventDefault();
        areaCode = $('#area-code').val();
        initMap();
        getMovies();
        $('#locationModal').modal('hide');
    });

    // Handle geocode insertion from the user.
    $('#auto-location').click(function(e) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getAreaCode);
            $('#locationModal').modal('hide');
        }
    });

    // Put a listener on all the cards on the page.
    $('#movies-list').on('click', 'li', function() {
        placeMarkers($(this).data('index'));
        $('#maps-movie-title').text($(this).find('.movie-title').text());
        renderTheatreData($(this).data('index'));
        $('#mapsModal').modal('show');
    });

    // When the maps modal fully loads, resize the map to fit.
    $('#mapsModal').on('shown.bs.modal', function () {
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

    // Geolocation isn't supported in Chrome,
    // so turn that off if we're using it.
    if(isIOSChrome || isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
        $('#auto-location-container').hide();
    }
}
