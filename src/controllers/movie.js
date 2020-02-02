import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import MovieModel from '../models/movie.js';
import {render, replace, erase, remove} from '../utils/render.js';
import moment from 'moment';

const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`
};


const parseFormData = (formData) => {

  return {
    isWatchlist: Boolean(formData.get(`watchlist`)),
    isHistory: Boolean(formData.get(`watched`)),
    isFavorite: Boolean(formData.get(`favorite`)),
    userRating: formData.get(`score`)
  };
};

const parseCommentFormData = (formData) => {

  return {
    name: `You`,
    text: formData.get(`comment`),
    time: moment(Date.now()).format(`YYYY/MM/DD HH:MM`),
    emoji: `./images/emoji/${formData.get(`comment-emoji`)}.png`
  };
};

export default class MovieController {
  constructor(container, moviesModel, onDataChange, onViewChange, api) {
    this._api = api;
    this._container = container;
    this._moviesModel = moviesModel;
    this._onDataChange = onDataChange;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._mode = Mode.DEFAULT;
    this._onViewChange = onViewChange;

    this._onEscPress = this._onEscPress.bind(this);
  }

  openPopup(movie) {
    this._onViewChange();
    this._mode = Mode.DETAILS;

    this._api.getCommments(movie.id)
      .then((comments) => {
        movie.comments = comments;
        this._filmDetailsComponent = new FilmDetailsComponent(movie);
        render(document.body, this._filmDetailsComponent, `beforeend`);
        document.addEventListener(`keydown`, this._onEscPress);

        this._filmDetailsComponent.setDeleteBtnClickHandler((index) => {
          this._onCommentDataChange(movie, index, null);
        });

        this._filmDetailsComponent.setCommentInputEnterPressHandler(() => {
          this._onCommentDataChange(movie, null, parseCommentFormData(this._filmDetailsComponent.getData()));
        });

        this._filmDetailsComponent.setCloseBtnClickHandler(() => {
          const formData = this._filmDetailsComponent.getData();
          const data = parseFormData(formData);

          const newMovie = MovieModel.clone(movie);
          newMovie.isHistory = data.isHistory;
          newMovie.isWatchlist = data.isWatchlist;
          newMovie.isFavorite = data.isFavorite;
          newMovie.userRating = +data.userRating || null;

          this._onDataChange(this, movie, newMovie);
        });
      });
  }

  render(movie) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(movie);

    if (this._mode === Mode.DETAILS) {
      this.openPopup(movie);
    }

    // const openPopup = () => {
    //   this._onViewChange();
    //   this._mode = Mode.DETAILS;

    //   this._api.getCommments(movie.id)
    //     .then((comments) => {
    //       movie.comments = comments;
    //       this._filmDetailsComponent = new FilmDetailsComponent(movie);
    //       render(document.body, this._filmDetailsComponent, `beforeend`);
    //       document.addEventListener(`keydown`, this._onEscPress);

    //       this._filmDetailsComponent.setWatchlistChangeHandler(() => {
    //         this._onDataChange(this, movie, Object.assign({}, movie, {
    //           isWatchlist: !movie.isWatchlist
    //         }));

    //         openPopup();
    //       });

    //       this._filmDetailsComponent.setWatchedChangeHandler(() => {
    //         const newMovie = MovieModel.clone(movie);
    //         newMovie.isHistory = !newMovie.isHistory;

    //         this._onDataChange(this, movie, newMovie);

    //         openPopup();
    //       });

    //       this._filmDetailsComponent.setFavoriteChangeHandler(() => {
    //         this._onDataChange(this, movie, Object.assign({}, movie, {
    //           isFavorite: !movie.isFavorite
    //         }));

    //         openPopup();
    //       });

    //       this._filmDetailsComponent.setUserRatingInputChangeHandler((value) => {
    //         this._onDataChange(this, movie, Object.assign({}, movie, {
    //           userRating: value
    //         }));

    //         openPopup();
    //       });

    //       this._filmDetailsComponent.setUserRatingResetBtnClickHandler(() => {
    //         this._onDataChange(this, movie, Object.assign({}, movie, {
    //           userRating: null
    //         }));

    //         openPopup();
    //       });

    //       this._filmDetailsComponent.setDeleteBtnClickHandler((index) => {
    //         this._onCommentDataChange(movie, index, null);
    //       });

    //       this._filmDetailsComponent.setCommentInputEnterPressHandler(() => {
    //         this._onCommentDataChange(movie, null, this._filmDetailsComponent.getCommmentData());
    //       });
    //     });
    // };

    this._filmCardComponent.setPosterClickHandler(() => this.openPopup(movie));

    this._filmCardComponent.setTitleClickHandler(() => this.openPopup(movie));

    this._filmCardComponent.setCommentsClickHandler(() => this.openPopup(movie));

    this._filmCardComponent.setAddToWatchlistBtnClickHandler(() => {
      const newMovie = MovieModel.clone(movie);
      newMovie.isWatchlist = !newMovie.isWatchlist;

      this._onDataChange(this, movie, newMovie);
    });

    this._filmCardComponent.setMarkAsWathedBtnClickHandler(() => {
      const newMovie = MovieModel.clone(movie);
      newMovie.isHistory = !newMovie.isHistory;
      newMovie.userRating = null;

      this._onDataChange(this, movie, newMovie);
    });

    this._filmCardComponent.setFavoriteBtnClickHandler(() => {
      const newMovie = MovieModel.clone(movie);
      newMovie.isFavorite = !newMovie.isFavorite;

      this._onDataChange(this, movie, newMovie);
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
    this._onDataChange();
  }
}
