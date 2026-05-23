import AbstractView from './abstract-view.js';

const createTripInfoTemplate = (route, dates, totalPrice) => `
  <div class="trip-info__main">
    <h1 class="trip-info__title">${route}</h1>
    <p class="trip-info__dates">${dates}</p>
  </div>
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>
`;

export default class TripInfoView extends AbstractView {
  constructor() {
    super();
    this.route = '';
    this.dates = '';
    this.totalPrice = 0;
  }

  get template() {
    return createTripInfoTemplate(this.route, this.dates, this.totalPrice);
  }

  updateInfo(route, dates, totalPrice) {
    this.route = route;
    this.dates = dates;
    this.totalPrice = totalPrice;
    this.updateElement();
  }
}
