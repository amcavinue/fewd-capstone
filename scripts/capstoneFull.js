'use strict';

/****************
globals
****************/

var userLocation,
    areaCode,
    map,
    infowindow,
    apiKeyGm = 'AIzaSyDo5LxyVUv5EwGQBwaveIF4d0MaIVD_Dd8',
    bounds = new google.maps.LatLngBounds(),
    radius = 15,
    markersArray = [],
    delay = 200,
    theatreRequests = {};

// Variables that hold movie data.
var movies,
    theatres = {};


/****************
functions
****************/

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

// Google maps API.
// Gets the latlng object from an address or zip code.
function codeAddress(address) {
    var location;

    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json",
        async: false,
        data: {
            address: address,
            key: apiKeyGm
        }
    }).done(function(data) {
        location = data.results[0].geometry.location;
    })
        .fail(function (jqXHR, error, errorThrown) {
//        console.log(jqXHR);
//        console.log(error);
//        console.log(errorThrown);
    });

    return location;
}

// Get the local movies from the OnConnect API.
// http://developer.tmsapi.com/io-docs
function getMovies() {
    var d = new Date(),
        today = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();

    $.ajax({
        url: 'http://data.tmsapi.com/v1.1/movies/showings',
        data: {
            startDate: today,
            zip: areaCode,
            dataType: 'jsonp',
            jsonp: "moviesHandler", // This is the callback.
            radius: radius,
            api_key: "hptve64cy9g4cqudvw9vrnyv"
        },
        dataType: "jsonp"
    })
        .fail(function (jqXHR, error, errorThrown) {
//        console.log(jqXHR);
//        console.log(error);
//        console.log(errorThrown);
    });
}

// Use the movie data to create and format the cards for the DOM.
function moviesHandler(data) {
    movies = data;

    $(document.body).prepend('<h2>Found ' + data.length + ' movies showing within 15 miles of ' + areaCode +'</h2>');

    $.each(data, function(index, movie) {
        var imageUrl = getImage(movie.title);

        renderCard(index, movie, imageUrl);

        // Get the theatre data for each movie.
        for (var i = 0; i < movie.showtimes.length; i++) {
            textSearch(movie.showtimes[i].theatre.name, movie.showtimes[i].theatre.id);
        }
    });

    // Clamp the titles and descriptions so they don't overflow the card.
    $('.movie-title').succinct({
        size: 48
    });

    $('.movie-description').succinct({
        size: 64
    });
}

// Get images from the OMDB API.
// http://omdbapi.com/
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

// Use the movie data to create the html for the cards.
function renderCard(index, movie, imageUrl) {
    var movieData = '<li class="tile" data-index=' + index + '>'+
        '<div class="poster-container">'+
        '<span class="img-helper"></span>';

    if (imageUrl === undefined || imageUrl === 'N/A') {
        movieData += '<span class="no-image">No Image</span>';
    } else {
        movieData += '<img src="' + imageUrl + '"/>';
    }

    movieData += '</div>'+
        '<br/>' +
        '<p class="movie-title">' + movie.title + '</p>'+
        '<hr/>';

    if (movie.ratings) {
        movieData += '<span class="rating">Rating</span>' + movie.ratings[0].code;
    } else {
        movieData += '<span class="rating">Rating</span>N/A';
    }

    if (movie.longDescription) {
        movieData += '<p class="movie-description">' + movie.longDescription + '</p>';
    } else {
        movieData += '<p class="movie-description"></p>';
    }

    movieData += '</li>';

    $('#movies-list').append(movieData);
}

// Google maps API.
// Gets the addresses for movie theatres from Google.
function textSearch(query, id) {
    var service;

    // SetTimeout is needed here to keep from hitting
    // the 5 requests per second limit from Google.
    setTimeout(function() {
        service = new google.maps.places.PlacesService(map);

        var request = {
            location: userLocation,
            query: query
        };

        // Only look for theatres we haven't requested yet.
        if (!theatreRequests[id]) {
            theatreRequests[id] = true;
            service.textSearch(request, function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        // Store the data under the theatre id.
                        theatres[id] = results[i];
                        getPlaceDetails(results[i].place_id, id);
                    }
                } else {
//                    console.log(status);
                }
            });
        }
    }, delay);

    delay += 200;
}

// Google maps place details.
// https://developers.google.com/maps/documentation/javascript/places?csw=1#place_details_requests
function getPlaceDetails(placeId, theatreId) {
    var service;

    // SetTimeout is needed here to keep from hitting
    // the 5 requests per second limit from Google.
    setTimeout(function() {
        service = new google.maps.places.PlacesService(map);

        var request = {
            placeId: placeId
        };

        service.getDetails(request, function(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                theatres[theatreId].details = place;

                // The last major ajax call has finished,
                // so turn off the loading dialog.
                waitingDialog.hide();
            } else {
//                console.log(status);
            }
        });
    }, delay);

    delay += 200;
}

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
                for(var i=0; i<results[0].address_components.length; i++)
                {
                    if (results[0].address_components[i].types[0] === "postal_code") {
                        areaCode = results[0].address_components[i].short_name;
                        initMap(userLocation, areaCode);
                        getMovies();
                    }
                }
            }
        } else {
//            console.log(status);
        }
    });
}

function placeMarkers(index) {
    // Clear the existing markers.
    for (var i = 0; i < markersArray.length; i++ ) {
        markersArray[i].setMap(null);
    }
    markersArray.length = 0;

    // Place the markers on the map.
    for (var i = 0; i < movies[index].showtimes.length; i++) {
        if (theatres[movies[index].showtimes[i].theatre.id]) {
            createMarker(theatres[movies[index].showtimes[i].theatre.id].geometry.location, movies[index].showtimes[i].theatre.name);
        }
    }
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

// Use the theatre data to create the html for the showtimes & locations.
function renderTheatreData(index) {
    var currentTheatres = {},
        details = '';

    for (var i = 0; i < movies[index].showtimes.length; i++) {
        var theatreId = movies[index].showtimes[i].theatre.id;

        if (!currentTheatres[theatreId]) {
            currentTheatres[theatreId] = {
                theatreId: theatreId,
                name: movies[index].showtimes[i].theatre.name,
                times: [movies[index].showtimes[i].dateTime]
            };
        } else {
            currentTheatres[theatreId].times.push(movies[index].showtimes[i].dateTime);
        }
    }

    for (var theatre in currentTheatres) {
        details += '<div class="movie"><div class="theatre-details"><h5>'+
            currentTheatres[theatre].name;
        details += '</h5>' +
            theatres[theatre].formatted_address;
        details += '<br />' +
            theatres[theatre].details.formatted_phone_number;
        details += '<br />' +
            '<a href="' + theatres[theatre].details.website + '">' + theatres[theatre].details.website + '</a>';
        details += '</div><hr /><p class="showtimes">';

        for (var i = 0; i < currentTheatres[theatre].times.length; i++) {
            var formattedTime = moment(currentTheatres[theatre].times[i]).calendar();
            details +=  formattedTime + '<br />';
        }

        details += '</p></div>';
    }

    $('#movie-details').empty().html(details);
}


/****************
document ready
****************/

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
        waitingDialog.show();
        areaCode = $('#area-code').val();
        initMap(userLocation, areaCode);
        getMovies();
        $('#locationModal').modal('hide');
    });

    // Handle geocode insertion from the user.
    $('#auto-location').click(function(e) {
        if (navigator.geolocation) {
            waitingDialog.show();
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
