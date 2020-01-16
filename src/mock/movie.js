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
  `Stephen King, Frank Darabont`,
  `Mario Puzo, Francis Ford Coppola`,
  `Reginald Rose, Reginald Rose`,
  `Thomas Keneally, Steven Zaillian`,
  `Chuck Palahniuk, Jim Uhls`
];

const CASTS = [
  `Brad Pitt, Edward Norton, Meat Loaf`,
  `John Travolta, Uma Thurman, Samuel L. Jackson`,
  `Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page`,
  `Mark Hamill, Harrison Ford, Carrie Fisher`,
  `Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss`
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
  name: `Tim Macoveev`,
  text: `Interesting setting and a good cast`,
  time: `2019/12/31 23:59`,
  emoji: `./images/emoji/smile.png`
}, {
  name: `John Doe`,
  text: `Booooooooooring`,
  time: `2 days ago`,
  emoji: `./images/emoji/sleeping.png`
}, {
  name: `John Doe`,
  text: `Very very old. Meh`,
  time: `2 days ago`,
  emoji: `./images/emoji/puke.png`
}];

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

  return {
    id: String(new Date() + Math.random()),
    title,
    poster: `./images/posters/${getRandomArrayItem(POSTERS)}`,
    description: getDescription(),
    rating: Math.floor(Math.random() * 101) / 10.0,
    year: Math.floor(Math.random() * (2010 - 1950)) + 1950,
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    genres: getGenres(GENRES),
    isWatchlist: Math.random() < 0.5,
    isHistory: Math.random() < 0.1,
    isFavorite: Math.random() < 0.3,
    originalTitle: title,
    userRating: Math.floor(Math.random() * 11),
    director: getRandomArrayItem(DIRECTORS),
    writers: getRandomArrayItem(WRITERS),
    cast: getRandomArrayItem(CASTS),
    releaseDate: getRandomArrayItem(DATES),
    country: getRandomArrayItem(COUNTRIES),
    ageRating: getRandomArrayItem(AGE_RATINGS),
    comments: COMMENTS.slice(0, Math.floor(Math.random() * 4))
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

