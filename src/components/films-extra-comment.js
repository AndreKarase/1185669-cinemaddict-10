import AbstractComponent from './abstract-component.js';

const createFilmsExtraTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
      </div>

    </section>`
  );
};

export default class FilmsExtra extends AbstractComponent {
  getTemplate() {
    return createFilmsExtraTemplate();
  }
}
