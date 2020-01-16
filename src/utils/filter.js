export const getMoviesByFilter = (movies, filterType) => {
  switch (filterType) {
    case `all`:
      return movies;
    case `watchlist`:
      return movies.filter((movie) => movie.isWatchlist);
    case `history`:
      return movies.filter((movie) => movie.isHistory);
    case `favorites`:
      return movies.filter((movie) => movie.isFavorite);
  }

  return movies;
};
