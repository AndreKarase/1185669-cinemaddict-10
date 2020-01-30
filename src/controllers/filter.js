import FilterComponent from '../components/site-menu.js';
import {getMoviesByFilter} from '../utils/filter.js';
import {replace, render} from '../utils/render.js';

const FILTER_TYPE = [
  `all`,
  `watchlist`,
  `history`,
  `favorites`
];

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._filterComponent = null;
    this._activeFilterType = `all`;
    this._onChange = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allMovies = this._moviesModel.getMoviesAll();
    const filters = FILTER_TYPE.map((filterType) => {
      return {
        name: filterType,
        count: getMoviesByFilter(allMovies, filterType).length,
        checked: filterType === this._activeFilterType
      };
    });


    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);

    if (this._onChange) {
      this._filterComponent.setFilterChangeHandler(this._onChange);
    }

    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, `beforeend`);
    }
  }

  setOnChange(handler) {
    this._onChange = handler;
    this._filterComponent.setFilterChangeHandler(this._onChange);
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

  _onDataChange() {
    this.render();
  }
}
