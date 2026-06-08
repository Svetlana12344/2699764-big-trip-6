import AbstractView from './abstract-view.js';
import he from 'he';

export default class EmptyPoints extends AbstractView {
  #message = '';

  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return `<p class="trip-events__msg">${he.encode(this.#message)}</p>`;
  }
}
