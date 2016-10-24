'use strict';

function moviesHandler(data) {
    movies = data;

    $(document.body).prepend('<p>Found ' + data.length + ' movies showing within 15 miles of ' + areaCode +':</p>');

    $.each(data, function(index, movie) {
        var movieData = '',
            imageUrl = '';

        imageUrl = getImage(movie.title);

        if (imageUrl === undefined || imageUrl === 'N/A') {
            // TODO: Add placeholder image here.
            imageUrl = '';
        }

        movieData = '<li class="tile" data-index=' + index + '>'+
            '<a href="#">'+
                '<img src="' + imageUrl + '"/>' +
                '<br/>' +
                movie.title +
            '</a>';

        if (movie.ratings) {
            movieData += ' (' + movie.ratings[0].code + ') </li>';
        } else {
            movieData += '</li>';
        }

        $('#movies-list').append(movieData);
        // Get the theatre data for each movie.
        for (var i = 0; i < movie.showtimes.length; i++) {
            textSearch(movie.showtimes[i].theatre.name, movie.showtimes[i].theatre.id);
        }
    });
}
