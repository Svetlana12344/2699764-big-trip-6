import AbstractView from './abstract-view.js';

const createEmptyPointsTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class EmptyPoints extends AbstractView {
  get template() {
    return createEmptyPointsTemplate();
  }
}
