import AbstractSmartComponent from './abstract-smart-component.js';
import {erase} from '../utils/render.js';

const EMOJI = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

const createFilmDetailsTemplate = (movie, options = {}) => {
  const {
    poster,
    title,
    originalTitle,
    rating,
    director,
    writers,
    cast,
    releaseDate,
    duration,
    country,
    genres,
    description,
    ageRating,
    comments
  } = movie;

  const {isWatchlist, isHistory, isFavorite, addedEmoji} = options;

  const createGenresMarkup = () => {
    return genres.map((genre) => {
      return (
        `<span class="film-details__genre">${genre}</span>`
      );
    }).join(`\n`);
  };

  const createEmojiMarkup = () => {
    return EMOJI.map((name) => {

      const isChecked = addedEmoji.indexOf(name) !== -1;

      return (
        `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${name}" value="${name}" ${isChecked ? `checked` : ``}>
        <label class="film-details__emoji-label" for="emoji-${name}">
          <img src="./images/emoji/${name}.png" width="30" height="30" alt="emoji">
        </label>`
      );
    }).join(`\n`);
  };

  const createCommentsMarkup = () => {
    return comments.map((comment) => {
      const {emoji, text, name, time} = comment;

      return (
        `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="${emoji}" width="55" height="55" alt="emoji">
        </span>
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${name}</span>
            <span class="film-details__comment-day">${time}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`
      );
    }).join(`\n`);
  };

  const createRatingScoreMarkup = () => {
    return new Array(9).fill(``)
      .map((it, i) => {
        return (
          `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i + 1}" id="rating-${i + 1}" ${i === 8 ? `checked` : ``}>
          <label class="film-details__user-rating-label" for="rating-${i + 1}">${i + 1}</label>`
        );
      }).join(`\n`);
  };

  const genresKey = genres.length > 1 ? `Genres` : `Genre`;

  const ratingScoreMarkup = createRatingScoreMarkup();
  const genresMarkup = createGenresMarkup();
  const commentsMarkUp = createCommentsMarkup();
  const emojiMarkup = createEmojiMarkup();

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ageRating}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${originalTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${cast}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genresKey}</td>
                <td class="film-details__cell">
                  ${genresMarkup}
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchlist ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isHistory ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      ${isHistory ?
      `<div class="form-details__middle-container">
        <section class="film-details__user-rating-wrap">
          <div class="film-details__user-rating-controls">
            <button class="film-details__watched-reset" type="button">Undo</button>
          </div>

          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
            </div>

            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${title}</h3>

              <p class="film-details__user-rating-feelings">How you feel it?</p>

              <div class="film-details__user-rating-score">
                ${ratingScoreMarkup}
              </div>
            </section>
          </div>
        </section>
      </div>` : ``}

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsMarkUp}
          </ul>

          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label">
      ${addedEmoji !== `` ?
      `<img src="${addedEmoji}" width="55" height="55" alt="emoji">`
      : ``}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              ${emojiMarkup}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`
  );
};

const parseFormData = (formData) => {
  const options = {
    hour12: false,
    year: `numeric`,
    month: `numeric`,
    day: `numeric`,
    hour: `numeric`,
    minute: `numeric`
  };

  return {
    name: `You`,
    text: formData.get(`comment`),
    time: new Date().toLocaleString(`en-US`, options),
    emoji: `./images/emoji/${formData.get(`comment-emoji`)}.png`
  };
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(movie) {
    super();
    this._movie = movie;
    this._isWatchlist = movie.isWatchlist;
    this._isHistory = movie.isHistory;
    this._isFavorite = movie.isFavorite;
    this._emoji = ``;

    this._watchlistChangeHandler = null;
    this._watchedChangeHandler = null;
    this._favoriteChangeHandler = null;
    this._commentInputEnterPressHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._movie, {
      isWatchlist: this._isWatchlist,
      isHistory: this._isHistory,
      isFavorite: this._isFavorite,
      addedEmoji: this._emoji,
    });
  }

  getData() {
    const form = this.getElement().querySelector(`.film-details__inner`);
    const formData = new FormData(form);

    return parseFormData(formData);
  }

  setWatchlistChangeHandler(handler) {
    this.getElement().querySelector(`#watchlist`)
      .addEventListener(`change`, handler);
    this._watchlistChangeHandler = handler;
  }

  setWatchedChangeHandler(handler) {
    this.getElement().querySelector(`#watched`)
      .addEventListener(`change`, handler);
    this._watchedChangeHandler = handler;
  }

  setFavoriteChangeHandler(handler) {
    this.getElement().querySelector(`#favorite`)
      .addEventListener(`change`, handler);
    this._favoriteChangeHandler = handler;
  }

  setDeleteBtnClickHandler(handler) {
    this.getElement().querySelectorAll(`.film-details__comment-delete`)
      .forEach((it, i) => it.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler(i);
      }));
  }

  setCommentInputEnterPressHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, (evt) => {
        if (evt.ctrlKey === true && evt.key === `Enter`) {
          handler();
        }
      });
    this._commentInputEnterPressHandler = handler;
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, () => {
      element.querySelector(`.film-details__comment-input`).value = ``;

      erase(this);
    });

    this.setWatchlistChangeHandler(this._watchlistChangeHandler);
    this.setWatchedChangeHandler(this._watchedChangeHandler);
    this.setFavoriteChangeHandler(this._favoriteChangeHandler);
    this.setCommentInputEnterPressHandler(this._commentInputEnterPressHandler);

    element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `IMG` ||
        evt.target.classList.contains(`film-details__emoji-label`)) {
          this._emoji = evt.target.src || evt.target.querySelector(`img`).src;
        }

        this.rerender();
      });
  }
}
