export const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;

  return element.firstChild;
};

export const render = (container, component, place) => {
  switch (place) {
    case `beforebegin`:
      container.before(component.getElement());
      break;
    case `afterbegin`:
      container.prepend(component.getElement());
      break;
    case `beforeend`:
      container.append(component.getElement());
      break;
    case `afterend`:
      container.after(component.getElement());
      break;
  }
};

export const erase = (component) => {
  component.getElement().remove();
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const replace = (newComponent, oldComponent) => {
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();
  const parentElement = oldElement.parentElement;

  const isExistElement = !!(newElement && oldElement && parentElement);

  if (isExistElement) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
