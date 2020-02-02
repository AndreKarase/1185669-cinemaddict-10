const TITLES = [
  `The Shawshank Redemption`,
  `The Godfather`,
  `The Dark Knight`,
  `The Lord of the Rings`,
  `Pulp Fiction`,
  `Schindler's List`,
  `12 Angry Men`,
  `Inception`,
  `Fight Club`,
  `Forrest Gump`,
  `Joker`,
  `The Matrix`,
  `Goodfellas`,
  `Star Wars`,
  `One Flew Over the Cuckoo's Nest`
];

const POSTERS = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const GENRES = [
  `Action`,
  `Animation`,
  `Comedy`,
  `Crime`,
  `Drama`
];

const DIRECTORS = [
  `David Lynch`,
  `Martin Scorsese`,
  `Steven Soderbergh`,
  `Terrence Malick`,
  `Abbas Kiarostami`
];

const WRITERS = [
  `Stephen King`,
  `Mario Puzo`,
  `Reginald Rose`,
  `Thomas Keneally`,
  `Chuck Palahniuk`
];

const CASTS = [
  `Brad Pitt`,
  `John Travolta`,
  `Leonardo DiCaprio`,
  `Mark Hamill`,
  `Keanu Reeves`
];

const DATES = [
  `30 March 1945`,
  `5 September 1978`,
  `15 November 1991`,
  `14 March 1999`,
  `25 August 2007 `
];

const COUNTRIES = [
  `United States`,
  `Great Britain`,
  `Italy`,
  `Germany`,
  `France`
];

const AGE_RATINGS = [
  `0+`,
  `12+`,
  `16+`,
  `18+`
];

const COMMENTS = [{
  id: `1`,
  name: `Tim Macoveev`,
  text: `Interesting setting and a good cast`,
  time: `2019/12/31 23:59`,
  emoji: `./images/emoji/smile.png`
}, {
  id: `2`,
  name: `John Doe`,
  text: `Booooooooooring`,
  time: `2 days ago`,
  emoji: `./images/emoji/sleeping.png`
}, {
  id: `3`,
  name: `John Doe`,
  text: `Very very old. Meh`,
  time: `2 days ago`,
  emoji: `./images/emoji/puke.png`
}];

const DATES_WATCH = [
  new Date(2020, 0, 28, 4),
  new Date(2020, 0, 27),
  new Date(2020, 0, 5),
  new Date(2019, 5, 25),
  new Date(2005, 4, 8),
];

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
const sentenses = text.split(`. `);

const getRandomArrayItem = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);

  return array[randomIndex];
};

const getDescription = () => {
  let randomSentenses = [];
  const sentensesCount = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < sentensesCount; i++) {
    randomSentenses.push(getRandomArrayItem(sentenses));
  }

  return randomSentenses.join(`. `);
};

const getGenres = (genres) => {
  const result = [];

  for (let i = 0; i < 3; i++) {
    result.push(getRandomArrayItem(genres));
  }

  return result;
};

const generateMovie = () => {
  const title = getRandomArrayItem(TITLES);
  const isHistory = Math.random() < 0.3;

  return {
    id: String(new Date() + Math.random()),
    title,
    poster: `./images/posters/${getRandomArrayItem(POSTERS)}`,
    description: getDescription(),
    rating: Math.floor(Math.random() * 101) / 10.0,
    runtime: Math.floor(Math.random() * 100) + 80,
    genres: getGenres(GENRES),
    isWatchlist: Math.random() < 0.5,
    isHistory,
    isFavorite: Math.random() < 0.3,
    originalTitle: title,
    userRating: Math.random() < 0.9 ? null : 8,
    director: getRandomArrayItem(DIRECTORS),
    writers: WRITERS,
    cast: CASTS,
    releaseDate: new Date(getRandomArrayItem(DATES)),
    country: getRandomArrayItem(COUNTRIES),
    ageRating: 18,
    comments: COMMENTS.slice(0, Math.floor(Math.random() * 4)),
    watchingDate: isHistory ? getRandomArrayItem(DATES_WATCH) : null
  };
};

const generateMovies = (count) => {
  const movies = [];

  for (let i = 0; i < count; i++) {
    movies.push(generateMovie());
  }

  return movies;
};

export {generateMovies};

