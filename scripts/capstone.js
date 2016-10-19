'use strict';

var mapStarted = false,
    userLocation,
    areaCode;
var apikey = "hptve64cy9g4cqudvw9vrnyv";
var baseUrl = "http://data.tmsapi.com/v1.1";
var showtimesUrl = baseUrl + '/movies/showings';
var d = new Date();
var today = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();

$(function() {
    $('#locationModal').modal('show');

    $('#movies-list').on('click', 'li', function() {
        $('#mapsModal').modal('show');
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
        getMovies();
        $('#locationModal').modal('hide');
    });

    $('#auto-location').click(function(e) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handlePosition);
            $('#locationModal').modal('hide');
        }
    });
});

function handlePosition(position) {
    var lat = position.coords.latitude,
        lng = position.coords.longitude,
        latlng = new google.maps.LatLng(lat, lng),
        geocoder = new google.maps.Geocoder();

    userLocation = {
        lat: lat,
        lng: lng
    };

    // Use the lattitude and longitude from the
    // browser to get the areacode from google.
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                console.log(results);
                for(var i=0; i<results[0].address_components.length; i++)
                {
                    if (results[0].address_components[i].types[0] === "postal_code") {
                        areaCode = results[0].address_components[i].short_name;
                        getMovies();
                    }
                }
            }
        }
    });
}

function getMovies() {
    $.ajax({
        url: showtimesUrl,
        data: {
            startDate: today,
            zip: areaCode,
            jsonp: "moviesHandler",
            api_key: apikey
        },
        dataType: "jsonp"
    });
}
