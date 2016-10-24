'use strict';

// Google maps geocoding service.
// https://developers.google.com/maps/documentation/javascript/geocoding
function getAreaCode(position) {
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

// Get the movies from the OnConnect API.
// http://developer.tmsapi.com/io-docs
function getMovies() {
    $.ajax({
        url: showtimesUrl,
        data: {
            startDate: today,
            zip: areaCode,
            jsonp: "moviesHandler",
            radius: radius,
            api_key: apikey
        },
        dataType: "jsonp"
    });
}

// Get images from the OMDB API.
function getImage(title) {
    var imageUrl;

    $.ajax({
        url: "http://www.omdbapi.com/",
        async: false,
        data: {
            t: title
        }
    }).done(function(data) {
        imageUrl = data.Poster;
    });

    return imageUrl;
}

// Google maps API.
function codeAddress(zip) {
    var location;

    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json",
        async: false,
        data: {
            address: zip,
            key: apiKeyGm
        }
    }).done(function(data) {
        location = data.results[0].geometry.location;
    }).fail(function() {
        console.log('failed');
    });

    return location;
}



// TODO: Currently debugging.

// Google maps API.
/*function textSearch(query) {
    // TODO: This is wrong somewhere -- throwing some innerHTML error...
    var result;

    $.ajax({
        method: 'GET',
        url: "https://maps.googleapis.com/maps/api/place/textsearch/json",
        data: {
            query: query,
            key: apiKeyGm
        }
    }).done(function(data) {
        console.log(data);
        result = data;
    }).fail(function() {
        console.log('failed');
    });

    return result;
}*/

function textSearch(query) {
    var service;

    var request = {
        location: userLocation,
        query: query
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, cb);
}

function cb(results, status) {
    console.log(results);
    console.log(status);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            // createMarker(results[i]);
            console.log(place);
        }
    }
}
