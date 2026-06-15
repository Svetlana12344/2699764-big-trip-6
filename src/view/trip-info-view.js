import AbstractView from '../framework/view/abstract-view.js';
import { humanizeTripDate } from '../utils/date-utils.js';
import he from 'he';

const createTripInfoTemplate = (route, startDate, endDate, totalCost) => `
  <div class="trip-info__main">
    <h1 class="trip-info__title">${he.encode(route)}</h1>
    <p class="trip-info__dates">${route ? he.encode(startDate) : ''}</p>
  </div>
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
  </p>
`;

export default class TripInfoView extends AbstractView {
  #routeText = '';
  #startDate = null;
  #endDate = null;
  #totalExpense = 0;

  constructor() {
    super();
  }

  get template() {
    return createTripInfoTemplate(this.#routeText, this.#formatDates(), this.#totalExpense);
  }

  #formatDates() {
    if (!this.#startDate || !this.#endDate) {
      return '';
    }
    return `${humanizeTripDate(this.#startDate)} — ${humanizeTripDate(this.#endDate)}`;
  }

  updateInfo(routeInfo, startTimestamp, endTimestamp, totalAmount) {
    this.#routeText = routeInfo;
    this.#startDate = startTimestamp;
    this.#endDate = endTimestamp;
    this.#totalExpense = totalAmount;

    const oldElement = this.element;
    const parentContainer = oldElement.parentElement;
    this.removeElement();

    if (parentContainer) {
      parentContainer.replaceChild(this.element, oldElement);
    }
  }
}
