import AbstractView from './abstract-view.js';

export default class AbstractStatefulView extends AbstractView {
  #state = {};

  constructor() {
    super();
    this._state = {};
  }

  get state() {
    return this.#state;
  }

  set state(newState) {
    this.#state = newState;
    this.updateElement();
  }

  updateElement() {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    if (parent) {
      parent.replaceChild(newElement, prevElement);
    }

    this._restoreHandlers();
  }

  updateState(update) {
    this.state = { ...this.#state, ...update };
  }

  _restoreHandlers() {
    throw new Error('Abstract method not implemented: _restoreHandlers');
  }
}