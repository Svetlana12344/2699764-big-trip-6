import AbstractView from './abstract-view.js';
import he from 'he';

export default class TripInfoView extends AbstractView {
  #route = '';
  #dates = '';
  #totalPrice = 0;

  constructor() {
    super();
  }

  get template() {
    return `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${he.encode(this.#route)}</h1>
        <p class="trip-info__dates">${he.encode(this.#dates)}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${this.#totalPrice}</span>
      </p>
    `;
  }

  updateInfo(route, dates, totalPrice) {
    this.#route = route;
    this.#dates = dates;
    this.#totalPrice = totalPrice;
    
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();
    
    if (parent) {
      parent.replaceChild(this.element, prevElement);
    }
  }
}
