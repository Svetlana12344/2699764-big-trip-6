import TripInfoView from '../view/trip-info-view.js';
import { render, replace, remove } from '../framework/render.js';
import { formatRoute, formatDates, calculateTotalPrice } from '../utils/trip-utils.js';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #infoComponent = null;

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsModel.addObserver(this.#onModelUpdate);
    this.#displayTripInfo();
  }

  #onModelUpdate = () => {
    this.#displayTripInfo();
  };

  #displayTripInfo() {
    if (!this.#container) {
      return;
    }

    const points = this.#pointsModel.getPoints();

    if (points.length === 0) {
      if (this.#infoComponent) {
        remove(this.#infoComponent);
        this.#infoComponent = null;
      }
      return;
    }

    const destinations = this.#pointsModel.getDestinations();
    const routePath = formatRoute(points, destinations);
    const dateString = formatDates(points);
    const totalCost = calculateTotalPrice(points, this.#pointsModel);

    const oldComponent = this.#infoComponent;

    this.#infoComponent = new TripInfoView();
    this.#infoComponent.updateInfo(routePath, dateString, totalCost);

    if (!oldComponent) {
      render(this.#infoComponent, this.#container, 'afterbegin');
    } else {
      replace(this.#infoComponent, oldComponent);
    }
  }
}
