import AbstractView from '../framework/view/abstract-view.js';
import he from 'he';

const createTripInfoTemplate = (route, dates, totalCost) => `
  <div class="trip-info__main">
    <h1 class="trip-info__title">${he.encode(route)}</h1>
    <p class="trip-info__dates">${he.encode(dates)}</p>
  </div>
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
  </p>
`;

export default class TripInfoView extends AbstractView {
  #routeText = '';
  #datesString = '';
  #totalExpense = 0;

  constructor() {
    super();
  }

  get template() {
    return createTripInfoTemplate(this.#routeText, this.#datesString, this.#totalExpense);
  }

  updateInfo(route, datesString, totalPrice) {
    this.#routeText = route;
    this.#datesString = datesString;
    this.#totalExpense = totalPrice;

    const oldElement = this.element;
    const parentContainer = oldElement.parentElement;
    this.removeElement();

    if (parentContainer) {
      parentContainer.replaceChild(this.element, oldElement);
    }
  }
}
