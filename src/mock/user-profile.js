export const getMovieCount = (movies) => {
  let result = 0;

  movies.forEach((movie) => {
    if (movie.isHistory) {
      result++;
    }
  });

  return result;
};
