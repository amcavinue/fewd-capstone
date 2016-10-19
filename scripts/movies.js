'use strict';

function moviesHandler(data) {
    console.log(data);

    $(document.body).append('<p>Found ' + data.length + ' movies showing within 5 miles of ' + areaCode +':</p>');
    var movies = data.hits;

    $.each(data, function(index, movie) {
        var movieData = '',
            imageUrl = '';

        $.ajax({
            url: "http://www.omdbapi.com/",
            async: false,
            data: {
                t: movie.title
            }
        }).done(function(data) {
            imageUrl = data.Poster;
        });

        movieData = '<li class="tile">'+
            '<a href="#">'+
                '<img src="' + imageUrl + '"/>' +
                '<br/>' +
                movie.title +
            '</a>';

        if (movie.ratings) {
            movieData += ' (' + movie.ratings[0].code + ') </li>'
        } else {
            movieData += '</li>';
        }

        $('#movies-list').append(movieData);
    });
}
