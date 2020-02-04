import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import MovieModel from '../models/movie.js';
import CommentModel from '../models/comment.js';
import {render, replace, erase, remove} from '../utils/render.js';

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
  return new CommentModel({
    'comment': formData.get(`comment`),
    'date': new Date(Date.now()),
    'emotion': formData.get(`comment-emoji`)
  });
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

        this._filmDetailsComponent.setCloseBtnClickHandler(() => {
          const formData = this._filmDetailsComponent.getData();
          const controlsData = parseFormData(formData);

          const ratingBtns = this._filmDetailsComponent.getElement().querySelectorAll(`.film-details__user-rating-input`);
          if (ratingBtns.length !== 0) {
            ratingBtns.forEach((btn) => {
              btn.disabled = true;
            });
          }

          const newMovie = MovieModel.clone(movie);
          newMovie.isHistory = controlsData.isHistory;
          newMovie.isWatchlist = controlsData.isWatchlist;
          newMovie.watchingDate = new Date(Date.now());
          newMovie.isFavorite = controlsData.isFavorite;
          newMovie.userRating = +controlsData.userRating || null;

          this._onDataChange(this, movie, newMovie);
        });

        this._filmDetailsComponent.setDeleteBtnClickHandler((id) => {
          this._onCommentDataChange(movie, id, null);
        });

        this._filmDetailsComponent.setCommentInputEnterPressHandler(() => {
          const formData = this._filmDetailsComponent.getData();
          const comment = parseCommentFormData(formData);

          const commentInput = this._filmDetailsComponent.getElement().querySelector(`.film-details__comment-input`);
          commentInput.disabled = true;
          commentInput.style.borderColor = `#979797`;
          commentInput.style.animation = ``;


          this._onCommentDataChange(movie, null, comment);
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

      newMovie.watchingDate = new Date(Date.now());
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


  shake() {
    const commentInput = this._filmDetailsComponent.getElement().querySelector(`.film-details__comment-input`);
    commentInput.style.borderColor = `#ff0000`;
    commentInput.style.animation = `shake 0.6s`;
    commentInput.disabled = false;
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      erase(this._filmDetailsComponent);

      this._mode = Mode.DEFAULT;
    }
  }

  _onCommentDataChange(movie, id, newData) {
    if (newData === null) {
      this._api.deleteComment(id)
        .then(() => {
          this._moviesModel.removeComment(movie.id, id);
          this.render(movie);
          this._onDataChange();
        });

    } else if (id === null) {
      this._api.createComment(newData, movie.id)
        .then((commentModel) => {
          this._moviesModel.addComment(movie.id, commentModel);
          this.render(movie);
          this._onDataChange();
        })
        .catch(() => {
          this.shake();
        });
    }


  }
}
