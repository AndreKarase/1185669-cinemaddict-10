import AbstractComponent from './abstract-component.js';

const createUserProfileTemplate = (userLevel) => {
  return (
    `<section class="header__profile profile">
    ${userLevel ? `<p class="profile__rating">${userLevel}</p>` : ``}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class UserProfile extends AbstractComponent {
  constructor(userLevel) {
    super();
    this._userLevel = userLevel;
  }

  getTemplate() {
    return createUserProfileTemplate(this._userLevel);
  }
}
