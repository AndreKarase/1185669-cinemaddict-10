import SortComponent from '../components/sort.js';
import FilmsComponent from '../components/films.js';
import NoFilmsComponent from '../components/no-films.js';
import FilmsExtraComponent from '../components/films-extra.js';
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

const getViewedRating = (movie) => {
  return movie.userRating || movie.rating;
};

export default class PageController {
  constructor(container, moviesModel, api) {
    this._api = api;
    this._moviesModel = moviesModel;
    this._topRatedMovies = [];
    this._mostCommentedMovies = [];
    this._container = container;
    this._sortComponent = new SortComponent();
    this._filmsComponent = new FilmsComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButton = new ShowMoreButtonComponent();
    this._filmsExtraComponent = new FilmsExtraComponent(`Top Rated`);
    this._filmsExtraCommentComponent = new FilmsExtraComponent(`Most Commented`);
    this._showedMovieControllers = [];
    this._showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  show() {
    this._container.show();
  }

  hide() {
    this._container.hide();
  }

  render() {
    let movies = this._moviesModel.getMovies();

    const container = this._container.getElement();

    if (movies.length === 0) {
      render(container, this._noFilmsComponent, `beforeend`);
      return;
    }

    render(container, this._sortComponent, `beforeend`);
    render(container, this._filmsComponent, `beforeend`);
    if (movies.some((movie) => movie.rating !== 0)) {
      render(this._filmsComponent.getElement(), this._filmsExtraComponent, `beforeend`);
    }

    if (movies.some((movie) => movie.comments.length !== 0)) {
      render(this._filmsComponent.getElement(), this._filmsExtraCommentComponent, `beforeend`);
    }

    this._showingMoviesCount = Math.min(SHOWING_MOVIES_COUNT_ON_START, movies.length);

    this._renderMovies(movies, 0);

    this._renderShowMoreButton();

    this._renderExtraMovies();
    this._renderExtraCommentMovies();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedMovies = [];

      switch (sortType) {
        case `date`:
          sortedMovies = this._moviesModel.getMovies()
            .slice(0, this._showingMoviesCount)
            .sort((a, b) => b.releaseDate.getFullYear() - a.releaseDate.getFullYear());
          break;
        case `rating`:
          sortedMovies = this._moviesModel.getMovies()
            .slice(0, this._showingMoviesCount)
            .sort((a, b) => getViewedRating(b) - getViewedRating(a));
          break;
        case `default`:
          sortedMovies = this._moviesModel.getMovies().slice();
          break;
      }

      this._removeMovies();
      this._renderMovies(sortedMovies, 0);
      this._renderExtraMovies();
      this._renderExtraCommentMovies();

      if (sortType === `default`) {
        this._renderShowMoreButton();
      } else {
        remove(this._showMoreButton);
      }
    });
  }

  _renderMovies(movies, start) {
    const filmsListElement = this._container.getElement().querySelector(`.films-list__container`);
    for (let i = start; i < this._showingMoviesCount; i++) {
      const movieController = new MovieController(filmsListElement, this._moviesModel, this._onDataChange, this._onViewChange, this._api);
      this._showedMovieControllers.push(movieController);
      movieController.render(movies[i]);
    }
  }

  _renderShowMoreButton() {
    const filmsListElement = this._container.getElement().querySelector(`.films-list__container`);
    const movies = this._moviesModel.getMovies();

    remove(this._showMoreButton);

    if (this._showingMoviesCount < movies.length) {
      render(filmsListElement, this._showMoreButton, `afterend`);
      this._showMoreButton.setClickHandler(this._onShowMoreButtonClick);
    }
  }

  _renderExtraMovies() {
    const filmsListExtraElements = this._container.getElement().querySelectorAll(`.films-list--extra`);
    const topRatedFilmsListElement = filmsListExtraElements[0].querySelector(`.films-list__container`);

    this._topRatedMovies = getTopTwoItems(this._moviesModel.getMoviesAll(), (movieA, movieB) => {
      let result = getViewedRating(movieA) - getViewedRating(movieB);

      if (result === 0) {
        result = Math.random() - 0.5;
      }

      return result;
    });

    if (this._topRatedMovies[1].rating !== 0) {
      this._topRatedMovies.forEach((movie) => {
        const movieController = new MovieController(topRatedFilmsListElement, this._moviesModel, this._onDataChange, this._onViewChange, this._api);
        this._showedMovieControllers.push(movieController);
        movieController.render(movie);
      });
    }
  }

  _renderExtraCommentMovies() {
    const filmsListExtraElements = this._container.getElement().querySelectorAll(`.films-list--extra`);
    const mostCommentedFilmsListElement = filmsListExtraElements[1].querySelector(`.films-list__container`);

    this._mostCommentedMovies = getTopTwoItems(this._moviesModel.getMoviesAll(), (movieA, movieB) => {
      let result = movieA.comments.length - movieB.comments.length;

      if (result === 0) {
        result = Math.random() - 0.5;
      }

      return result;
    });

    if (this._topRatedMovies[1].comments.length !== 0) {
      this._mostCommentedMovies.forEach((movie) => {
        const movieController = new MovieController(mostCommentedFilmsListElement, this._moviesModel, this._onDataChange, this._onViewChange, this._api);
        this._showedMovieControllers.push(movieController);
        movieController.render(movie);
      });
    }

  }

  _onShowMoreButtonClick() {
    const movies = this._moviesModel.getMovies();

    const prevMoviesCount = this._showingMoviesCount;
    this._showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

    if (this._showingMoviesCount >= movies.length) {
      this._showingMoviesCount = movies.length;
    }

    this._renderMovies(movies, prevMoviesCount);
    this._renderShowMoreButton();
  }

  _removeMovies() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
  }

  _updateMovies() {
    this._sortComponent.setDefaultSortType();
    this._removeMovies();
    remove(this._noFilmsComponent);
    remove(this._filmsExtraComponent);
    remove(this._filmsExtraCommentComponent);
    this.render();
  }

  _onDataChange(movieController, oldData, newData) {
    if (!movieController) {
      remove(this._filmsExtraCommentComponent);
      render(this._filmsComponent.getElement(), this._filmsExtraCommentComponent, `beforeend`);
      this._renderExtraCommentMovies();
    } else {
      this._api.updateMovie(oldData.id, newData)
        .then((movieModel) => {
          if (this._moviesModel.updateMovies(oldData.id, movieModel)) {
            this._updateMovies();
          }
        });
    }
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((movieController) => movieController.setDefaultView());
  }

  _onFilterChange() {
    this._updateMovies();
  }
}
