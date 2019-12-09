export const createSiteMenuTemplate = (filters) => {
  const filtersMarkup = filters.slice(1)
  .map((filter) => {
    const {name, count} = filter;

    return (
      `<a href="#${name.toLowerCase()}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`
    );
  })
  .join(`\n`);

  return (
    `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filtersMarkup}
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`
  );
};
