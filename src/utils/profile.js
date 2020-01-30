export const getUserLevel = (movies) => {
  const movieCount = movies.filter((movie) => {
    return movie.isHistory;
  }).length;

  if (movieCount > 0 && movieCount <= 10) {
    return `Novice`;
  }
  if (movieCount > 10 && movieCount <= 20) {
    return `Fan`;
  }
  if (movieCount > 20) {
    return `Movie Buff`;
  }

  return null;
};
