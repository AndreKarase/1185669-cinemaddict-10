import ShowMoreButtonComponent from '../components/show-more-button.js';
import {render, remove} from '../utils/render.js';
import MovieController from './movie.js';

const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;

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
    this._movies = [];
    this._topRatedMovies = [];
    this._mostCommentedMovies = [];
    this._container = container;
    this._showMoreButton = new ShowMoreButtonComponent();
    this._showedMovieControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(movies) {
    this._movies = movies;
    const container = this._container;

    const filmsListElement = container.querySelector(`.films-list__container`);
    let showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;
    for (let i = 0; i < showingMoviesCount; i++) {
      const movieController = new MovieController(filmsListElement, this._onDataChange, this._onViewChange);
      this._showedMovieControllers.push(movieController);
      movieController.render(this._movies[i]);
    }

    render(filmsListElement, this._showMoreButton, `afterend`);

    this._showMoreButton.setClickHandler(() => {
      const prevMoviesCount = showingMoviesCount;
      showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

      if (showingMoviesCount >= this._movies.length) {
        showingMoviesCount = this._movies.length;
        remove(this._showMoreButton);
      }

      for (let i = prevMoviesCount; i < showingMoviesCount; i++) {
        const movieController = new MovieController(filmsListElement, this._onDataChange, this._onViewChange);
        this._showedMovieControllers.push(movieController);
        movieController.render(this._movies[i]);
      }
    });

    const filmsListExtraElements = container.querySelectorAll(`.films-list--extra`);
    const topRatedFilmsListElement = filmsListExtraElements[0].querySelector(`.films-list__container`);
    const mostCommentedFilmsListElement = filmsListExtraElements[1].querySelector(`.films-list__container`);

    this._topRatedMovies = getTopTwoItems(this._movies, (movieA, movieB) => movieA.rating - movieB.rating);

    if (this._topRatedMovies[1].rating !== 0) {
      this._topRatedMovies.forEach((movie) => {
        const movieController = new MovieController(topRatedFilmsListElement, this._onDataChange, this._onViewChange);
        this._showedMovieControllers.push(movieController);
        movieController.render(movie);
      });
    }

    this._mostCommentedMovies = getTopTwoItems(this._movies, (movieA, movieB) => movieA.comments.length - movieB.comments.length);

    if (this._topRatedMovies[1].comments.length !== 0) {
      this._mostCommentedMovies.forEach((movie) => {
        const movieController = new MovieController(mostCommentedFilmsListElement, this._onDataChange, this._onViewChange);
        this._showedMovieControllers.push(movieController);
        movieController.render(movie);
      });
    }
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._movies.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._movies[index] = newData;
    movieController.render(newData);
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }
}
