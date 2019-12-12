import FilmCardComponent from '../components/film-card.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import FilmDetailsComponent from '../components/film-details.js';
import {render, erase, remove} from '../utils/render.js';

const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;

const renderMovie = (container, movie, place) => {
  const filmCardComponent = new FilmCardComponent(movie);
  const filmDetailsComponent = new FilmDetailsComponent(movie);

  filmCardComponent.setPosterClickHandler(() => {
    render(document.body, filmDetailsComponent, `beforeend`);
  });

  filmCardComponent.setTitleClickHandler(() => {
    render(document.body, filmDetailsComponent, `beforeend`);
  });

  filmCardComponent.setCommentsClickHandler(() => {
    render(document.body, filmDetailsComponent, `beforeend`);
  });

  filmDetailsComponent.setCloseBtnClickHandler(() => {
    erase(filmDetailsComponent);
  });

  render(container, filmCardComponent, place);
};

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

export default class PageController {
  constructor(container) {
    this._container = container;
    this._showMoreButton = new ShowMoreButtonComponent();
  }

  render(movies) {
    const container = this._container;

    const filmsListElement = container.querySelector(`.films-list__container`);
    let showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;
    for (let i = 0; i < showingMoviesCount; i++) {
      renderMovie(filmsListElement, movies[i], `beforeend`);
    }

    render(filmsListElement, this._showMoreButton, `afterend`);

    this._showMoreButton.setClickHandler(() => {
      const prevMoviesCount = showingMoviesCount;
      showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

      if (showingMoviesCount >= movies.length) {
        showingMoviesCount = movies.length;
        remove(this._showMoreButton);
      }

      for (let i = prevMoviesCount; i < showingMoviesCount; i++) {
        renderMovie(filmsListElement, movies[i], `beforeend`);
      }
    });

    const filmsListExtraElements = container.querySelectorAll(`.films-list--extra`);
    const topRatedFilmsListElement = filmsListExtraElements[0].querySelector(`.films-list__container`);
    const mostCommentedFilmsListElement = filmsListExtraElements[1].querySelector(`.films-list__container`);

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
  }
}
