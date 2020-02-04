import {getMoviesByFilter} from '../utils/filter.js';

export default class MoviesModel {
  constructor() {
    this._movies = [];
    this._activeFilterType = `all`;
    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  getMovies() {
    return getMoviesByFilter(this._movies, this._activeFilterType);
  }

  getMoviesAll() {
    return this._movies;
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
  }

  updateMovies(id, movie) {
    const index = this._movies.findIndex((currentMovie) => currentMovie.id === id);

    if (index === -1) {
      return false;
    }

    this._movies[index] = movie;

    this._filterChangeHandlers.forEach((handler) => handler());
    this._dataChangeHandlers.forEach((handler) => handler());

    return true;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  addComment(movieId, comment) {
    const movieIndex = this._movies.findIndex((movie) => movie.id === movieId);

    if (movieIndex === -1) {
      return;
    }

    this._movies[movieIndex].comments.unshift(comment);

  }

  removeComment(movieId, commentId) {
    const movieIndex = this._movies.findIndex((movie) => movie.id === movieId);

    if (movieIndex === -1) {
      return;
    }

    const commentIndex = this._movies[movieIndex].comments.indexOf(commentId);

    if (commentIndex === -1) {
      return;
    }

    this._movies[movieIndex].comments.splice(commentIndex, 1);

    this._dataChangeHandlers.forEach((handler) => handler());
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
}

