import AbstractComponent from './abstract-component.js';

const getMenuItemByFilterType = (filterType) => {
  if (filterType === `all`) {
    return `All movies`;
  }

  return filterType[0].toUpperCase() + filterType.substr(1);
};

const createFilterMarkup = (filter, isChecked) => {
  const {name, count} = filter;
  const menuItem = getMenuItemByFilterType(name);

  return (
    `<a href="#${name.toLowerCase()}" class="main-navigation__item ${isChecked ? `main-navigation__item--active` : ``}">${menuItem} ${name !== `all` ? `<span class="main-navigation__item-count">${count}</span></a>` : ``}`
  );
};

const createSiteMenuTemplate = (filters) => {
  const filtersMarkup = filters
  .map((filter) => createFilterMarkup(filter, filter.checked))
  .join(`\n`);

  return (
    `<nav class="main-navigation">
    ${filtersMarkup}
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const filterTypePos = evt.target.href.indexOf(`#`) + 1;
      const filterType = evt.target.href.substr(filterTypePos);
      handler(filterType);
    });
  }
}
