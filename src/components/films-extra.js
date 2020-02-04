import AbstractComponent from './abstract-component.js';

const createFilmsExtraTemplate = (caption) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${caption}</h2>

      <div class="films-list__container">
      </div>

    </section>`


  );
};

export default class FilmsExtra extends AbstractComponent {
  constructor(caption) {
    super();

    this._caption = caption;
  }
  getTemplate() {
    return createFilmsExtraTemplate(this._caption);
  }
}
