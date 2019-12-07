const MOVIES_COUNT = 15;
const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;

import {createBoardTemplate} from './components/board.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createUserProfileTemplate} from './components/user-profile.js';
import {createFilmDetailsTemplate} from './components/film-details.js';
import {generateMovies} from './mock/movie.js';
import {movieCount} from './mock/user-profile.js';
import {generateFilters} from './mock/menu.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createUserProfileTemplate(movieCount), `beforeend`);

const movies = generateMovies(MOVIES_COUNT);
const filters = generateFilters(movies);
render(siteMainElement, createSiteMenuTemplate(filters), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const footerStatistics = document.querySelector(`.footer__statistics`);
footerStatistics.querySelector(`p`).textContent = `${movies.length} movies inside`;

const filmsListElement = siteMainElement.querySelector(`.films-list__container`);

let showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;
for (let i = 0; i < showingMoviesCount; i++) {
  render(filmsListElement, createFilmCardTemplate(movies[i]), `beforeend`);
}

render(filmsListElement, createShowMoreButtonTemplate(), `afterend`);


const showMoreButton = siteMainElement.querySelector(`.films-list__show-more`);
showMoreButton.addEventListener(`click`, () => {
  const prevMoviesCount = showingMoviesCount;
  showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

  if (showingMoviesCount >= movies.length) {
    showingMoviesCount = movies.length;
    showMoreButton.remove();
  }

  for (let i = prevMoviesCount; i < showingMoviesCount; i++) {
    render(filmsListElement, createFilmCardTemplate(movies[i]), `beforeend`);
  }
});

const filmsListExtraElements = siteMainElement.querySelectorAll(`.films-list--extra`);
const topRatedFilmsListElement = filmsListExtraElements[0].querySelector(`.films-list__container`);
const mostCommentedFilmsListElement = filmsListExtraElements[1].querySelector(`.films-list__container`);

const topRatedMovies = movies[0].rating < movies[1].rating ? [movies[0], movies[1]] : [movies[1], movies[0]];
movies.slice(2).forEach((movie) => {
  if (movie.rating > topRatedMovies[0].rating) {
    if (movie.rating > topRatedMovies[1].rating) {
      topRatedMovies[0] = topRatedMovies[1];
      topRatedMovies[1] = movie;
    } else {
      topRatedMovies[0] = movie;
    }
  }
});

if (topRatedMovies[1].rating !== 0) {
  topRatedMovies.forEach(
      (movie) => render(topRatedFilmsListElement, createFilmCardTemplate(movie), `beforeend`)
  );
}

const mostCommentedMovies = movies[0].comments.length < movies[1].comments.length ? [movies[0], movies[1]] : [movies[1], movies[0]];
movies.slice(2).forEach((movie) => {
  if (movie.comments.length > mostCommentedMovies[0].comments.length) {
    if (movie.comments.length > mostCommentedMovies[1].comments.length) {
      mostCommentedMovies[0] = mostCommentedMovies[1];
      mostCommentedMovies[1] = movie;
    } else {
      mostCommentedMovies[0] = movie;
    }
  }
});

if (topRatedMovies[1].comments.length !== 0) {
  mostCommentedMovies.forEach(
      (movie) => render(mostCommentedFilmsListElement, createFilmCardTemplate(movie), `beforeend`)
  );
}

render(document.body, createFilmDetailsTemplate(movies[0]), `beforeend`);


