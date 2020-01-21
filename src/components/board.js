import AbstractComponent from './abstract-component.js';

const createBoardTemplate = () => {
  return (
    `<div></div>`
  );
};

export default class Board extends AbstractComponent {
  getTemplate() {
    return createBoardTemplate();
  }
}
