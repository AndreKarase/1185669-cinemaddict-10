const MOVIES_COUNT = 10;

import BoardComponent from './components/board.js';
import UserProfileComponent from './components/user-profile.js';
import {generateMovies} from './mock/movie.js';
import {getMovieCount} from './mock/user-profile.js';
import {render} from './utils/render.js';
import PageController from './controllers/board.js';
import MoviesModel from './models/movies.js';
import FilterController from './controllers/filter.js';

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const movies = generateMovies(MOVIES_COUNT);
const movieCount = getMovieCount(movies);
render(siteHeaderElement, new UserProfileComponent(movieCount), `beforeend`);

const moviesModel = new MoviesModel();
moviesModel.setMovies(movies);

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, `beforeend`);

const footerStatistics = document.querySelector(`.footer__statistics`);
footerStatistics.querySelector(`p`).textContent = `${movies.length} movies inside`;

const pageController = new PageController(boardComponent.getElement(), moviesModel);
pageController.render();
