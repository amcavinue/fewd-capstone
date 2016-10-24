'use strict';

function moviesHandler(data) {
    console.log(data);

    $(document.body).prepend('<p>Found ' + data.length + ' movies showing within 15 miles of ' + areaCode +':</p>');
    var movies = data.hits;

    $.each(data, function(index, movie) {
        var movieData = '',
            imageUrl = '',
            currentMovieTheatres = {};

        imageUrl = getImage(movie.title);

        movieData = '<li class="tile">'+
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
            currentMovieTheatres[movie.showtimes[i].theatre.name] = textSearch(movie.showtimes[i].theatre.name);
        }
        theatres[movie.title] = currentMovieTheatres;
    });

    console.log(theatres);
}
