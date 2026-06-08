import Sorting from '../view/sorting-view.js';
import EmptyPoints from '../view/empty-points-view.js';
import LoadingView from '../view/loading-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointPresenter, { UserAction } from './point-presenter.js';
import { sortPointsByDay, sortPointsByTime, sortPointsByPrice } from '../utils/sort-utils.js';
import { SortType } from '../const.js';
import { filter } from '../utils/filter-utils.js';
import { formatRoute, formatDates, calculateTotalPrice } from '../utils/trip-utils.js';

const LOADING_MESSAGE_TEXT = 'Loading...';
const EVENT_LIST_CLASS = 'trip-events__list';
const SORT_CLASS = 'trip-events__trip-sort';
const DEFAULT_HOURS_OFFSET_MS = 3600000;

const EMPTY_MESSAGES = {
  'everything': 'Click New Event to create your first point',
  'future': 'There are no future events now',
  'present': 'There are no present events now',
  'past': 'There are no past events now'
};

export default class BoardPresenter {
  #pointsModel = null;
  #filterModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #onNewPointDestroy = null;
  #boardContainer = null;
  #tripInfoContainer = null;
  #eventsList = null;
  #pointPresenters = new Map();
  #currentOpenPoint = null;
  #currentSortType = SortType.DAY;
  #sortingComponent = null;
  #isNewPointCreating = false;
  #isLoading = true;
  #loadingComponent = null;
  #tripInfoComponent = null;

  constructor({ pointsModel, filterModel, destinationsModel, offersModel, onNewPointDestroy }) {
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onNewPointDestroy = onNewPointDestroy;
    this.#boardContainer = document.querySelector('.trip-events');
    this.#tripInfoContainer = document.querySelector('.trip-main__trip-info');
  }

  async init() {
    this.#renderTripInfo();
    this.#renderLoading();

    await this.#pointsModel.init();
    await this.#destinationsModel.init();
    await this.#offersModel.init();

    this.#isLoading = false;
    this.#removeLoading();

    this.#renderSorting();
    this.#createEventsList();
    this.#renderPoints();
    this.#updateTripInfo();

    this.#pointsModel.addObserver(() => {
      this.#renderPoints();
      this.#updateTripInfo();
    });

    this.#filterModel.addObserver(() => {
      this.forceUpdateByFilter();
    });
  }

  #removeLoading() {
    if (this.#loadingComponent) {
      this.#loadingComponent.removeElement();
      this.#loadingComponent = null;
    }

    const loadingElements = document.querySelectorAll('.trip-events__msg');
    loadingElements.forEach((element) => {
      if (element.textContent === LOADING_MESSAGE_TEXT) {
        element.remove();
      }
    });
  }

  forceUpdateByFilter() {
    this.#currentSortType = SortType.DAY;
    this.#resetAllPointsView();
    this.#renderPoints();
  }

  #renderTripInfo() {
    if (!this.#tripInfoContainer) {
      this.#tripInfoContainer = document.querySelector('.trip-main__trip-info');
      if (!this.#tripInfoContainer) {
        const tripMain = document.querySelector('.trip-main');
        this.#tripInfoContainer = document.createElement('div');
        this.#tripInfoContainer.className = 'trip-main__trip-info trip-info';
        tripMain.prepend(this.#tripInfoContainer);
      }
    }

    if (this.#tripInfoComponent) {
      this.#tripInfoComponent.removeElement();
    }

    this.#tripInfoComponent = new TripInfoView();
    this.#tripInfoContainer.innerHTML = '';
    this.#tripInfoContainer.appendChild(this.#tripInfoComponent.element);
  }

  #updateTripInfo() {
    const points = this.#pointsModel.getPoints();
    const destinations = this.#destinationsModel.getDestinations();

    if (points.length === 0) {
      if (this.#tripInfoComponent) {
        this.#tripInfoComponent.updateInfo('', '', 0);
      }
      return;
    }

    const route = formatRoute(points, destinations);
    const dates = formatDates(points);
    const totalPrice = calculateTotalPrice(points, this.#offersModel);

    this.#tripInfoComponent.updateInfo(route, dates, totalPrice);
  }

  #renderLoading() {
    this.#loadingComponent = new LoadingView();
    this.#boardContainer.appendChild(this.#loadingComponent.element);
  }

  #renderSorting() {
    if (this.#sortingComponent) {
      this.#sortingComponent.removeElement();
    }
    this.#sortingComponent = new Sorting();
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange.bind(this));
    const sortingElement = this.#sortingComponent.element;
    sortingElement.classList.add(SORT_CLASS);
    this.#boardContainer.prepend(sortingElement);
  }

  #createEventsList() {
    if (this.#eventsList) {
      this.#eventsList.remove();
    }
    this.#eventsList = document.createElement('ul');
    this.#eventsList.classList.add(EVENT_LIST_CLASS);
    this.#boardContainer.appendChild(this.#eventsList);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    if (this.#eventsList) {
      this.#eventsList.innerHTML = '';
    }
  }

  #getSortedPoints() {
    const filterType = this.#filterModel.getFilter();
    const filteredPoints = filter[filterType](this.#pointsModel.getPoints());
    const points = [...filteredPoints];

    switch (this.#currentSortType) {
      case SortType.TIME:
        return points.sort(sortPointsByTime);
      case SortType.PRICE:
        return points.sort(sortPointsByPrice);
      default:
        return points.sort(sortPointsByDay);
    }
  }

  #renderPoints() {
    const loadingMsg = document.querySelector('.trip-events__msg');
    if (loadingMsg && loadingMsg.textContent === LOADING_MESSAGE_TEXT) {
      loadingMsg.remove();
    }

    if (this.#loadingComponent) {
      this.#loadingComponent.removeElement();
      this.#loadingComponent = null;
    }

    if (this.#isLoading) {
      return;
    }

    this.#clearPointsList();
    const points = this.#getSortedPoints();

    if (points.length === 0) {
      this.#renderEmptyPoints();
      return;
    }

    if (!this.#sortingComponent) {
      this.#renderSorting();
    }

    const destinations = this.#destinationsModel.getDestinations();
    const allOffers = this.#offersModel.getOffers();

    points.forEach((point) => {
      const destination = destinations.find((dest) => dest.id === point.destination);
      const pointWithDestination = { ...point, destination };

      const pointPresenter = new PointPresenter({
        point: pointWithDestination,
        destinations: destinations,
        allOffers: allOffers,
        onDataChange: this.#handlePointChange.bind(this),
        onModeChange: this.#handleModeChange.bind(this)
      });

      pointPresenter.init();
      this.#eventsList.appendChild(pointPresenter.routePointComponent.element);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  #renderEmptyPoints() {
    const filterType = this.#filterModel.getFilter();
    const message = EMPTY_MESSAGES[filterType] || 'Click New Event to create your first point';
    const emptyPoints = new EmptyPoints(message);
    this.#eventsList.appendChild(emptyPoints.element);
  }

  #handleSortTypeChange(sortType) {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#resetAllPointsView();
    this.#renderPoints();
  }

  async #handlePointChange(updatedPoint, action) {
    if (action === UserAction.DELETE) {
      await this.#pointsModel.deletePoint(updatedPoint.id);
      this.#resetAllPointsView();
    } else if (action === UserAction.UPDATE) {
      await this.#pointsModel.updatePoint(updatedPoint);
      this.#resetAllPointsView();
    }
    this.#updateTripInfo();
  }

  #handleModeChange() {
    if (this.#currentOpenPoint) {
      this.#currentOpenPoint.resetView();
      this.#currentOpenPoint = null;
    }
  }

  #resetAllPointsView() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.resetView();
    });
    this.#currentOpenPoint = null;
  }

  async createNewPoint() {
    if (this.#isNewPointCreating) {
      return;
    }

    this.#isNewPointCreating = true;
    this.#resetAllPointsView();

    const newEventButton = document.querySelector('.trip-main__event-add-btn');
    if (newEventButton) {
      newEventButton.disabled = true;
    }

    const destinations = this.#destinationsModel.getDestinations();
    const firstDestination = destinations[0];

    const newPoint = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      type: 'flight',
      destination: firstDestination ? firstDestination.id : null,
      basePrice: 0,
      dateFrom: new Date().toISOString(),
      dateTo: new Date(Date.now() + DEFAULT_HOURS_OFFSET_MS).toISOString(),
      offers: [],
      isFavorite: false
    };

    const newPointPresenter = new PointPresenter({
      point: newPoint,
      destinations: destinations,
      allOffers: this.#offersModel.getOffers(),
      onDataChange: this.#handleNewPointChange.bind(this),
      onModeChange: this.#handleNewPointModeChange.bind(this),
      isNew: true
    });

    newPointPresenter.init();
    newPointPresenter.replaceToEditForm();
    this.#eventsList.prepend(newPointPresenter.routePointComponent.element);
    this.#pointPresenters.set(newPoint.id, newPointPresenter);
    this.#currentOpenPoint = newPointPresenter;
  }

  async #handleNewPointChange(updatedPoint, action) {
    if (action === UserAction.DELETE) {
      this.#destroyNewPoint();
      return;
    }

    try {
      await this.#pointsModel.addPoint(updatedPoint);
      this.#destroyNewPoint();
      this.#resetAllPointsView();
      this.#renderPoints();
      this.#updateTripInfo();
    } catch (error) {
      this.#destroyNewPoint();
    }
  }

  #handleNewPointModeChange() {
    if (this.#currentOpenPoint && this.#currentOpenPoint.isNew) {
      this.#currentOpenPoint.resetView();
    }
  }

  #destroyNewPoint() {
    if (this.#currentOpenPoint && this.#currentOpenPoint.isNew) {
      this.#currentOpenPoint.destroy();
      this.#pointPresenters.delete(this.#currentOpenPoint.point.id);
      this.#currentOpenPoint = null;
    }
    this.#isNewPointCreating = false;
    if (this.#onNewPointDestroy) {
      this.#onNewPointDestroy();
    }
  }
}
