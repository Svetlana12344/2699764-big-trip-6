export default class AbstractView {
  #element = null;

  constructor() {
    this._callback = {};
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = this.createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    throw new Error('You have to implement template getter');
  }

  createElement(template) {
    const newElement = document.createElement('div');
    newElement.innerHTML = template;
    return newElement.firstElementChild;
  }

  removeElement() {
    this.#element = null;
  }
}
