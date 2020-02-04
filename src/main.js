import Api from './api.js';
import BoardComponent from './components/board.js';
import StatisticsComponent from './components/statistics.js';
import UserProfileComponent from './components/user-profile.js';
import {getUserLevel} from './utils/profile.js';
import {render} from './utils/render.js';
import BoardController from './controllers/board.js';
import MoviesModel from './models/movies.js';
import FilterController from './controllers/filter.js';

export const AUTHORIZATION = `Basic Jw&Z0bu9HO%urwjLi`;
export const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

const api = new Api(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);


const statisticsComponent = new StatisticsComponent(moviesModel);

const boardComponent = new BoardComponent();
const pageController = new BoardController(boardComponent, moviesModel, api);
const filterController = new FilterController(siteMainElement, moviesModel);

filterController.render();
render(siteMainElement, boardComponent, `beforeend`);
render(siteMainElement, statisticsComponent, `beforeend`);
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

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    const userLevel = getUserLevel(moviesModel.getMoviesAll());

    render(siteHeaderElement, new UserProfileComponent(userLevel), `beforeend`);
    pageController.render();
    filterController.render();

    const footerStatistics = document.querySelector(`.footer__statistics`);
    footerStatistics.querySelector(`p`).textContent = `${moviesModel.getMoviesAll().length} movies inside`;

  });
