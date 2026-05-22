import AbstractView from './abstract-view.js';

const createEmptyPointsTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class EmptyPoints extends AbstractView {
  constructor(message) {
    super();
    this.message = message;
  }

  get template() {
    return createEmptyPointsTemplate(this.message);
  }
}