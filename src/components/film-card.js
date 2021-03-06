import AbstractComponent from './abstract-component.js';

const DESCRIPTION_MAX = 140;

const createFilmCardTemplate = (movie) => {
  const {title, poster, description: notCroppedDescription, rating, userRating, runtime, genres, comments, isFavorite, isHistory, isWatchlist} = movie;
  const year = movie.releaseDate.getFullYear();
  const formatedRuntime = `${Math.floor(runtime / 60)}h ${runtime % 60}m`;
  const description = notCroppedDescription.length > DESCRIPTION_MAX ?
    notCroppedDescription.substr(0, DESCRIPTION_MAX - 1) + `…` :
    notCroppedDescription;


  return (
    `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p ${userRating ? `style="color:#14d1ff"` : `rating`} class="film-card__rating">${userRating ? userRating : rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${formatedRuntime}</span>
      <span class="film-card__genre">${genres[0] || ``}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isHistory ? `film-card__controls-item--active` : ``}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
    </form>
  </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(movie) {
    super();
    this._movie = movie;
  }

  getTemplate() {
    return createFilmCardTemplate(this._movie);
  }

  setPosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, handler);
  }

  setTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`)
      .addEventListener(`click`, handler);
  }

  setCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`)
      .addEventListener(`click`, handler);
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler();
      });
  }

  setMarkAsWathedButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler();
      });
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler();
      });
  }
}
