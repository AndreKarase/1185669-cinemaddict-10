const MOVIES_COUNT = 25;

import BoardComponent from './components/board.js';
import StatisticsComponent from './components/statistics.js';
import UserProfileComponent from './components/user-profile.js';
import {generateMovies} from './mock/movie.js';
import {getUserLevel} from './utils/profile.js';
import {render} from './utils/render.js';
import PageController from './controllers/board.js';
import MoviesModel from './models/movies.js';
import FilterController from './controllers/filter.js';

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const movies = generateMovies(MOVIES_COUNT);
const userLevel = getUserLevel(movies);
render(siteHeaderElement, new UserProfileComponent(userLevel), `beforeend`);

const moviesModel = new MoviesModel();
moviesModel.setMovies(movies);

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, `beforeend`);

const statisticsComponent = new StatisticsComponent(moviesModel, userLevel);
render(siteMainElement, statisticsComponent, `beforeend`);

const footerStatistics = document.querySelector(`.footer__statistics`);
footerStatistics.querySelector(`p`).textContent = `${movies.length} movies inside`;

const pageController = new PageController(boardComponent, moviesModel);
pageController.render();
statisticsComponent.hide();

filterController.setOnChange((menuItem) => {
  switch (menuItem) {
    case `all`:
    case `watchlist`:
    case `history`:
    case `favorites`:
      statisticsComponent.hide();
      pageController.show();
      break;
    case `stats`:
      pageController.hide();
      statisticsComponent.show();
      break;
  }
});
