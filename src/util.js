export const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;

  return element.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case `beforebegin`:
      container.before(element);
      break;
    case `afterbegin`:
      container.prepend(element);
      break;
    case `beforeend`:
      container.append(element);
      break;
    case `afterend`:
      container.after(element);
      break;
  }
};
