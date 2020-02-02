import Movie from './models/movie.js';
import Comment from './models/comment.js';

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  getCommments(id) {
    return this._load({url: `comments/${id}`})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  updateMovie(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: `PUT`,
      body: JSON.stringify(data.toRaw()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(Movie.parseMovie);
  }

  _load({url, method = `GET`, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
