'use strict';

function moviesHandler(data) {
    movies = data;

    $(document.body).prepend('<h2>Found ' + data.length + ' movies showing within 15 miles of ' + areaCode +'</h2>');

    $.each(data, function(index, movie) {
        var imageUrl = getImage(movie.title);;

        renderCard(index, movie, imageUrl);

        // Get the theatre data for each movie.
        for (var i = 0; i < movie.showtimes.length; i++) {
            textSearch(movie.showtimes[i].theatre.name, movie.showtimes[i].theatre.id);
        }
    });

    // Clamp the titles and descriptions so they don't overflow the card.
    $('.movie-title').succinct({
        size: 64
    });

    $('.movie-description').succinct({
        size: 64
    });
}

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
