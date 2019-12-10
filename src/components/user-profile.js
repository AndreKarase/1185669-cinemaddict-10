import {createElement} from '../util.js';

const determimeLevel = (movieCount) => {
  if (movieCount <= 10) {
    return `Novice`;
  }
  if (movieCount <= 20) {
    return `Fan`;
  }

  return `Movie Buff`;
};

const createUserProfileTemplate = (movieCount) => {
  const userLevel = determimeLevel(movieCount);

  return (
    `<section class="header__profile profile">
    ${movieCount !== 0 ? `<p class="profile__rating">${userLevel}</p>` : ``}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class UserProfile {
  constructor(movieCount) {
    this._element = null;
    this._movieCount = movieCount;
  }

  getTemplate() {
    return createUserProfileTemplate(this._movieCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
