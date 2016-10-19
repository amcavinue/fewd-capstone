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
        hasLocation = true;
        $('#locationModal').modal('hide');
    });

    $('#auto-location').click(function(e) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handlePosition);
            hasLocation = true;
            $('#locationModal').modal('hide');
        }
    });

    $.ajax({
        url: showtimesUrl,
        data: {
            startDate: today,
            zip: zipCode,
            jsonp: "dataHandler",
            api_key: apikey
        },
        dataType: "jsonp",
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

    // Use the lattitude and longitude from the browser
    // to get the areacode from google.
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                console.log(results);
                for(var i=0; i<results[0].address_components.length; i++)
                {
                    if (results[0].address_components[i].types[0] === "postal_code") {
                        areaCode = results[0].address_components[i].short_name;
                        alert(areaCode);
                    }
                }
            }
        }
    });
}
