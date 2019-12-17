import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import {render, replace, erase} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
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

    this._filmCardComponent.setPosterClickHandler(() => {
      this._onViewChange();
      this._mode = Mode.DETAILS;

      render(document.body, this._filmDetailsComponent, `beforeend`);
    });

    this._filmCardComponent.setTitleClickHandler(() => {
      this._onViewChange();
      this._mode = Mode.DETAILS;

      render(document.body, this._filmDetailsComponent, `beforeend`);
    });

    this._filmCardComponent.setCommentsClickHandler(() => {
      this._onViewChange();
      this._mode = Mode.DETAILS;

      render(document.body, this._filmDetailsComponent, `beforeend`);
    });

    // this._filmDetailsComponent.setCloseBtnClickHandler(() => {
    //   this._mode = Mode.DEFAULT;

    //   erase(this._filmDetailsComponent);
    // });

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

    if (oldFilmCardComponent && oldFilmDetailsComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmCardComponent, `beforeend`);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      erase(this._filmDetailsComponent);

      this._mode = Mode.DEFAULT;
    }
  }
}
