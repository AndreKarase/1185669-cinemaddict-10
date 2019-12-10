import {createElement} from "../util.js";

const createBoardTemplate = () => {
  return (
    `<div>
    <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>

  <section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>

    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container">
      </div>

    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
      </div>

    </section>
  </section>
  </div>`
  );
};

export default class Board {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createBoardTemplate();
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
