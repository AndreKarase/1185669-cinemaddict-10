const MOVIES_COUNT = 5;
const TOP_MOVIES_COUNT = 2;

import {createBoardTemplate} from './components/board.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createUserProfileTemplate} from './components/user-profile.js';
import {createFilmDetailsTemplate} from './components/film-details.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createUserProfileTemplate(), `beforeend`);
render(siteMainElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const filmsListElement = siteMainElement.querySelector(`.films-list__container`);

for (let i = 0; i < MOVIES_COUNT; i++) {
  render(filmsListElement, createFilmCardTemplate(), `beforeend`);
}

render(filmsListElement, createShowMoreButtonTemplate(), `afterend`);

const filmsListExtraElements = siteMainElement.querySelectorAll(`.films-list--extra`);
const topRatedFilmsListElement = filmsListExtraElements[0].querySelector(`.films-list__container`);
const mostCommentedFilmsListElement = filmsListExtraElements[1].querySelector(`.films-list__container`);

for (let i = 0; i < TOP_MOVIES_COUNT; i++) {
  render(topRatedFilmsListElement, createFilmCardTemplate(), `beforeend`);
}

for (let i = 0; i < TOP_MOVIES_COUNT; i++) {
  render(mostCommentedFilmsListElement, createFilmCardTemplate(), `beforeend`);
}

render(document.body, createFilmDetailsTemplate(), `beforeend`);

