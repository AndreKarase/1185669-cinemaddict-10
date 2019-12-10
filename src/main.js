const MOVIES_COUNT = 15;
const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;

import BoardComponent from './components/board.js';
import FilmCardComponent from './components/film-card.js';
import ShowMoreButtonComponent from './components/show-more-button.js';
import SiteMenuComponent from './components/site-menu.js';
import UserProfileComponent from './components/user-profile.js';
import FilmDetailsComponent from './components/film-details.js';
import {generateMovies} from './mock/movie.js';
import {getMovieCount} from './mock/user-profile.js';
import {generateFilters} from './mock/menu.js';
import {render} from './util.js';

const renderMovie = (container, movie, place) => {
  const filmCardComponent = new FilmCardComponent(movie);
  const filmDetailsComponent = new FilmDetailsComponent(movie);

  const poster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  poster.addEventListener(`click`, () => {
    render(document.body, filmDetailsComponent.getElement(), `beforeend`);
  });

  const title = filmCardComponent.getElement().querySelector(`.film-card__title`);
  title.addEventListener(`click`, () => {
    render(document.body, filmDetailsComponent.getElement(), `beforeend`);
  });

  const comments = filmCardComponent.getElement().querySelector(`.film-card__comments`);
  comments.addEventListener(`click`, () => {
    render(document.body, filmDetailsComponent.getElement(), `beforeend`);
  });

  const closeBtn = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);
  closeBtn.addEventListener(`click`, () => {
    filmDetailsComponent.getElement().remove();
  });

  render(container, filmCardComponent.getElement(), place);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const movies = generateMovies(MOVIES_COUNT);
const movieCount = getMovieCount(movies);
render(siteHeaderElement, new UserProfileComponent(movieCount).getElement(), `beforeend`);

const filters = generateFilters(movies);
render(siteMainElement, new SiteMenuComponent(filters).getElement(), `beforeend`);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), `beforeend`);

const footerStatistics = document.querySelector(`.footer__statistics`);
footerStatistics.querySelector(`p`).textContent = `${movies.length} movies inside`;

const filmsListElement = boardComponent.getElement().querySelector(`.films-list__container`);
let showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;
for (let i = 0; i < showingMoviesCount; i++) {
  renderMovie(filmsListElement, movies[i], `beforeend`);
}

const showMoreButton = new ShowMoreButtonComponent();
render(filmsListElement, showMoreButton.getElement(), `afterend`);

showMoreButton.getElement().addEventListener(`click`, () => {
  const prevMoviesCount = showingMoviesCount;
  showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

  if (showingMoviesCount >= movies.length) {
    showingMoviesCount = movies.length;
    showMoreButton.getElement().remove();
    showMoreButton.removeElement();
  }

  for (let i = prevMoviesCount; i < showingMoviesCount; i++) {
    renderMovie(filmsListElement, movies[i], `beforeend`);
  }
});

const filmsListExtraElements = boardComponent.getElement().querySelectorAll(`.films-list--extra`);
const topRatedFilmsListElement = filmsListExtraElements[0].querySelector(`.films-list__container`);
const mostCommentedFilmsListElement = filmsListExtraElements[1].querySelector(`.films-list__container`);

const getTopTwoItems = (arr, getDiff) => {
  const top = getDiff(arr[0], arr[1]) < 0 ? [arr[0], arr[1]] : [arr[1], arr[0]];

  for (let i = 2; i < arr.length; i++) {
    if (getDiff(arr[i], top[0]) > 0) {
      if (getDiff(arr[i], top[1]) > 0) {
        top[0] = top[1];
        top[1] = arr[i];
      } else {
        top[0] = arr[i];
      }
    }
  }

  return top;
};

const topRatedMovies = getTopTwoItems(movies, (movieA, movieB) => movieA.rating - movieB.rating);

if (topRatedMovies[1].rating !== 0) {
  topRatedMovies.forEach(
      (movie) => renderMovie(topRatedFilmsListElement, movie, `beforeend`)
  );
}

const mostCommentedMovies = getTopTwoItems(movies, (movieA, movieB) => movieA.comments.length - movieB.comments.length);

if (topRatedMovies[1].comments.length !== 0) {
  mostCommentedMovies.forEach(
      (movie) => renderMovie(mostCommentedFilmsListElement, movie, `beforeend`)
  );
}


