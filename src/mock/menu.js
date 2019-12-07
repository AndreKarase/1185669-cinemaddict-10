const filters = [
  `All movies`,
  `Watchlist`,
  `History`,
  `Favorites`
];

const generateFilters = (movies) => {
  const getCounts = () => {
    const result = {
      'All movies': movies.length,
      'Watchlist': 0,
      'History': 0,
      'Favorites': 0
    };

    movies.forEach((movie) => {
      if (movie.isWatchlist) {
        result[`Watchlist`]++;
      }
      if (movie.isHistory) {
        result[`History`]++;
      }
      if (movie.isFavorite) {
        result[`Favorites`]++;
      }
    });

    return result;
  };

  const counts = getCounts();

  return filters.map((it) => {
    return {
      name: it,
      count: counts[it]
    };
  });
};

export {generateFilters};

