import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import {render, replace, erase, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`
};

export default class MovieController {
  constructor(container, moviesModel, onDataChange, onViewChange) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._onDataChange = onDataChange;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._mode = Mode.DEFAULT;
    this._onViewChange = onViewChange;
  }

  render(movie) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(movie);
    this._filmDetailsComponent = new FilmDetailsComponent(movie);

    const openPopup = () => {
      this._onViewChange();
      this._mode = Mode.DETAILS;

      render(document.body, this._filmDetailsComponent, `beforeend`);

      document.addEventListener(`keydown`, this._onEscPress);
    };

    this._filmCardComponent.setPosterClickHandler(openPopup);

    this._filmCardComponent.setTitleClickHandler(openPopup);

    this._filmCardComponent.setCommentsClickHandler(openPopup);

    this._filmCardComponent.setAddToWatchlistBtnClickHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isWatchlist: !movie.isWatchlist
      }));
    });

    this._filmCardComponent.setMarkAsWathedBtnClickHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isHistory: !movie.isHistory
      }));
    });

    this._filmCardComponent.setFavoriteBtnClickHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isFavorite: !movie.isFavorite
      }));
    });

    this._filmDetailsComponent.setWatchlistChangeHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isWatchlist: !movie.isWatchlist
      }));
    });

    this._filmDetailsComponent.setWatchedChangeHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isHistory: !movie.isHistory
      }));
    });

    this._filmDetailsComponent.setFavoriteChangeHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isFavorite: !movie.isFavorite
      }));
    });

    this._filmDetailsComponent.setDeleteBtnClickHandler((index) => {
      this._onCommentDataChange(movie, index, null);
    });

    this._filmDetailsComponent.setCommentInputEnterPressHandler(() => {
      this._onCommentDataChange(movie, null, this._filmDetailsComponent.getData());
    });

    if (oldFilmCardComponent && oldFilmDetailsComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmCardComponent, `beforeend`);
    }
  }

  _onEscPress(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      erase(this._filmDetailsComponent);
      document.removeEventListener(`keydown`, this._onEscPress);
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscPress);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      erase(this._filmDetailsComponent);

      this._mode = Mode.DEFAULT;
    }
  }

  _onCommentDataChange(movie, index, newData) {
    if (newData === null) {
      this._moviesModel.removeComment(movie.id, index);

    } else if (index === null) {
      this._moviesModel.addComment(movie.id, newData);
    }

    this.render(movie);
  }
}
