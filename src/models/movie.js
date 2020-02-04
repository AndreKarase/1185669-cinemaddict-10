const DATE_BLANK = new Date(0);

export default class Movie {
  constructor(film) {
    this.id = film[`id`];
    this.comments = film[`comments`].map((id) => {

      return {
        id,
        name: ``,
        text: ``,
        time: ``,
        emoji: ``
      };
    });
    this.title = film[`film_info`][`title`];
    this.originalTitle = film[`film_info`][`alternative_title`];
    this.rating = film[`film_info`][`total_rating`];
    this.poster = film[`film_info`][`poster`];
    this.ageRating = film[`film_info`][`age_rating`];
    this.director = film[`film_info`][`director`];
    this.writers = film[`film_info`][`writers`];
    this.cast = film[`film_info`][`actors`];
    this.releaseDate = new Date(film[`film_info`][`release`][`date`]);
    this.country = film[`film_info`][`release`][`release_country`] || ``;
    this.runtime = film[`film_info`][`runtime`];
    this.genres = film[`film_info`][`genre`] || [];
    this.description = film[`film_info`][`description`];
    this.userRating = film[`user_details`][`personal_rating`] || null;
    this.isWatchlist = Boolean(film[`user_details`][`watchlist`]);
    this.isHistory = film[`user_details`][`watching_date`] ?
      Boolean(film[`user_details`][`already_watched`]) : false;
    this.watchingDate = film[`user_details`][`watching_date`] ?
      new Date(film[`user_details`][`watching_date`]) : DATE_BLANK;
    this.isFavorite = Boolean(film[`user_details`][`favorite`]);
  }

  toRaw() {
    return {
      'id': this.id,
      'comments': this.comments.map((comment) => comment.id),
      'film_info': {
        'title': this.title,
        'alternative_title': this.originalTitle,
        'total_rating': this.rating,
        'poster': this.poster,
        'age_rating': this.ageRating,
        'director': this.director,
        'writers': this.writers,
        'actors': this.cast,
        'release': {
          'date': this.releaseDate.toISOString(),
          'release_country': this.country
        },
        'runtime': this.runtime,
        'genre': this.genres,
        'description': this.description,
      },
      'user_details': {
        'personal_rating': this.userRating || 0,
        'watchlist': this.isWatchlist,
        'already_watched': this.isHistory,
        'watching_date': this.watchingDate ? this.watchingDate.toISOString() : null,
        'favorite': this.isFavorite
      }
    };
  }

  static parseMovie(film) {
    return new Movie(film);
  }

  static parseMovies(film) {
    return film.map(Movie.parseMovie);
  }

  static clone(film) {
    return new Movie(film.toRaw());
  }
}
