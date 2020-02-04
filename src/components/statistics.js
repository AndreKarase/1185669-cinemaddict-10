import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import {getUserLevel} from '../utils/profile.js';

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const getTargetMoviesCount = (movies, genre) => {
  const result = movies.reduce((count, movie) => {
    const targetMoviesCount = Array.from(movie.genres)
      .filter((movieGenre) => movieGenre === genre).length;

    return count + targetMoviesCount;
  }, 0);

  return result;
};

const getGenres = (movies) => {
  const genresLabels = movies.map((movie) => movie.genres)
    .reduce((allGenres, genres) => {
      return allGenres.concat(Array.from(genres));
    }, [])
    .filter(getUniqItems);

  const genres = genresLabels.map((label) => {
    return {
      label,
      count: getTargetMoviesCount(movies, label)
    };
  });

  return genres.sort((a, b) => b.count - a.count);
};

const renderChart = (ctx, genres) => {

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres.reduce((labels, genre) => {
        return labels.concat(genre.label);
      }, []),
      datasets: [{
        data: genres.reduce((counts, genre) => {
          return counts.concat(genre.count);
        }, []),
        backgroundColor: genres.map(() => `rgba(255, 255, 0, 1)`),
        barPercentage: genres.map(() => 0.5)
      }]
    },
    options: {
      plugins: {
        datalabels: {
          color: `black`,
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            return `${tooltipData} Movies`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            display: false,
            beginAtZero: true
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontColor: `white`,
          }
        }]
      }
    }
  });
};

const createStatisticsTemplate = (movies, genres, activeFilter, userLevel) => {

  const moviesCount = movies.length;
  const runtimesCount = movies.reduce((count, movie) => {
    return count + movie.runtime;
  }, 0);
  const hoursCount = Math.floor(runtimesCount / 60);
  const minutesCount = runtimesCount % 60;
  let topGenre = `-`;

  if (genres[0]) {
    topGenre = genres[0].label;
  }

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${userLevel || `-`}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${activeFilter === `all-time` ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${activeFilter === `today` ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${activeFilter === `week` ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${activeFilter === `month` ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${activeFilter === `year` ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${moviesCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hoursCount} <span class="statistic__item-description">h</span> ${minutesCount} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();

    this._moviesModel = moviesModel;
    this._userLevel = null;
    this._chart = null;
    this._startDate = null;
    this._watchedMovies = this._moviesModel.getMovies().filter((movie) => movie.isHistory);
    this._genres = getGenres(this._watchedMovies);
    this._activeFilter = `all-time`;

    this._renderChart();
    this.recoveryListeners();
  }

  getTemplate() {
    return createStatisticsTemplate(this._watchedMovies, this._genres, this._activeFilter, this._userLevel);
  }

  rerender(moviesModel) {
    this._moviesModel = moviesModel;
    this._userLevel = getUserLevel(this._moviesModel.getMoviesAll());
    this._watchedMovies = this._startDate ?
      this._moviesModel.getMoviesAll()
        .filter((movie) => {
          return movie.isHistory && movie.watchingDate > this._startDate;
        }) :
      this._moviesModel.getMoviesAll()
        .filter((movie) => movie.isHistory);

    this._genres = getGenres(this._watchedMovies);
    super.rerender();
    this._renderChart();
  }

  show() {
    super.show();
    this.rerender(this._moviesModel);
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  _renderChart() {
    const element = this.getElement();
    const ctx = element.querySelector(`.statistic__chart`);

    this._resetChart();
    this._chart = renderChart(ctx, this._genres)
    ;
  }

  recoveryListeners() {
    this.getElement().querySelector(`form`)
      .addEventListener(`change`, (evt) => {
        if (evt.target.value === `all-time`) {
          this._startDate = null;
        } else if (evt.target.value === `today`) {
          this._startDate = moment(new Date(Date.now())).startOf(`day`);
        } else {
          this._startDate = moment(new Date(Date.now())).startOf(evt.target.value);
        }

        this._activeFilter = evt.target.value;
        this.rerender(this._moviesModel);
      });
  }
}
