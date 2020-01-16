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
  constructor(container, moviesModel) {
    this._moviesModel = moviesModel;
    this._topRatedMovies = [];
    this._mostCommentedMovies = [];
    this._container = container;
    this._showMoreButton = new ShowMoreButtonComponent();
    this._showedMovieControllers = [];
    this._showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const movies = this._moviesModel.getMovies();
    const container = this._container;

    this._showingMoviesCount = Math.min(SHOWING_MOVIES_COUNT_ON_START, movies.length);

    const filmsListElement = container.querySelector(`.films-list__container`);
    for (let i = 0; i < this._showingMoviesCount; i++) {
      const movieController = new MovieController(filmsListElement, this._moviesModel, this._onDataChange, this._onViewChange);
      this._showedMovieControllers.push(movieController);
      movieController.render(movies[i]);
    }

    remove(this._showMoreButton);

    if (this._showingMoviesCount < movies.length) {
      render(filmsListElement, this._showMoreButton, `afterend`);
      this._showMoreButton.setClickHandler(this._onShowMoreButtonClick);
    }

    const filmsListExtraElements = container.querySelectorAll(`.films-list--extra`);
    const topRatedFilmsListElement = filmsListExtraElements[0].querySelector(`.films-list__container`);
    const mostCommentedFilmsListElement = filmsListExtraElements[1].querySelector(`.films-list__container`);

    this._topRatedMovies = getTopTwoItems(movies, (movieA, movieB) => movieA.rating - movieB.rating);

    if (this._topRatedMovies[1].rating !== 0) {
      this._topRatedMovies.forEach((movie) => {
        const movieController = new MovieController(topRatedFilmsListElement, this._moviesModel, this._onDataChange, this._onViewChange);
        this._showedMovieControllers.push(movieController);
        movieController.render(movie);
      });
    }

    this._mostCommentedMovies = getTopTwoItems(movies, (movieA, movieB) => movieA.comments.length - movieB.comments.length);

    if (this._topRatedMovies[1].comments.length !== 0) {
      this._mostCommentedMovies.forEach((movie) => {
        const movieController = new MovieController(mostCommentedFilmsListElement, this._moviesModel, this._onDataChange, this._onViewChange);
        this._showedMovieControllers.push(movieController);
        movieController.render(movie);
      });
    }
  }

  _onShowMoreButtonClick() {
    const movies = this._moviesModel.getMovies();
    const filmsListElement = this._container.querySelector(`.films-list__container`);

    const prevMoviesCount = this._showingMoviesCount;
    this._showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

    if (this._showingMoviesCount >= movies.length) {
      this._showingMoviesCount = movies.length;
      remove(this._showMoreButton);
    }

    for (let i = prevMoviesCount; i < this._showingMoviesCount; i++) {
      const movieController = new MovieController(filmsListElement, this._moviesModel, this._onDataChange, this._onViewChange);
      this._showedMovieControllers.push(movieController);
      movieController.render(movies[i]);
    }
  }

  _removeMovies() {
    const filmsListElement = this._container.querySelector(`.films-list__container`);
    filmsListElement.innerHTML = ``;

    const filmsListExtraElements = this._container.querySelectorAll(`.films-list--extra`);
    filmsListExtraElements.innerHTML = ``;

    this._showedMovieControllers = [];
  }

  _onDataChange(movieController, oldData, newData) {
    if (this._moviesModel.updateMovies(oldData.id, newData)) {
      movieController.render(newData);
    }
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._removeMovies();
    this.render();
  }
}
