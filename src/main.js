const MOVIES_COUNT = 15;

import BoardComponent from './components/board.js';
import SiteMenuComponent from './components/site-menu.js';
import UserProfileComponent from './components/user-profile.js';
import {generateMovies} from './mock/movie.js';
import {getMovieCount} from './mock/user-profile.js';
import {generateFilters} from './mock/menu.js';
import {render} from './utils/render.js';
import PageController from './controllers/board.js';

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const movies = generateMovies(MOVIES_COUNT);
const movieCount = getMovieCount(movies);
render(siteHeaderElement, new UserProfileComponent(movieCount), `beforeend`);

const filters = generateFilters(movies);
render(siteMainElement, new SiteMenuComponent(filters), `beforeend`);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, `beforeend`);

const footerStatistics = document.querySelector(`.footer__statistics`);
footerStatistics.querySelector(`p`).textContent = `${movies.length} movies inside`;

const pageController = new PageController(boardComponent.getElement());
pageController.render(movies);
