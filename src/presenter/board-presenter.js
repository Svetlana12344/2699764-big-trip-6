import Sorting from '../view/sorting-view.js';
import EmptyPoints from '../view/empty-points-view.js';
import PointPresenter from './point-presenter.js';
import { sortPointsByDay, sortPointsByTime, sortPointsByPrice, SortType } from '../utils/sort-utils.js';
import { filter } from '../utils/filter-utils.js';
import { generateDestinations } from '../mock/destination-mock.js';
import { generateOffers } from '../mock/offer-mock.js';

const EMPTY_MESSAGES = {
  'everything': 'Click New Event to create your first point',
  'future': 'There are no future events now',
  'present': 'There are no present events now',
  'past': 'There are no past events now'
};

export default class BoardPresenter {
  constructor({ pointsModel, filterModel, onNewPointDestroy }) {
    this.pointsModel = pointsModel;
    this.filterModel = filterModel;
    this.onNewPointDestroy = onNewPointDestroy;
    this.boardContainer = document.querySelector('.trip-events');
    this.eventsList = null;
    this.pointPresenters = new Map();
    this.currentOpenPoint = null;
    this.currentSortType = SortType.DAY;
    this.sortingComponent = null;
    this.isNewPointCreating = false;
    this.destinations = generateDestinations();
    this.allOffers = this._generateAllOffers();
  }

  _generateAllOffers() {
    const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
    const offers = {};
    types.forEach((type) => {
      offers[type] = generateOffers(3);
    });
    return offers;
  }

  init() {
    this.renderSorting();
    this.createEventsList();
    this.renderPoints();
    this.pointsModel.addObserver(() => this.renderPoints());
    this.filterModel.addObserver(() => this.renderPoints());
  }

  renderSorting() {
    if (this.sortingComponent) {
      this.sortingComponent.removeElement();
    }
    this.sortingComponent = new Sorting();
    this.sortingComponent.setSortTypeChangeHandler(this.handleSortTypeChange.bind(this));
    const sortingElement = this.sortingComponent.element;
    sortingElement.classList.add('trip-events__trip-sort');
    this.boardContainer.prepend(sortingElement);
  }

  createEventsList() {
    if (this.eventsList) {
      this.eventsList.remove();
    }
    this.eventsList = document.createElement('ul');
    this.eventsList.classList.add('trip-events__list');
    this.boardContainer.appendChild(this.eventsList);
  }

  clearPointsList() {
    this.pointPresenters.forEach((presenter) => presenter.destroy());
    this.pointPresenters.clear();
    if (this.eventsList) {
      this.eventsList.innerHTML = '';
    }
  }

  getSortedPoints() {
    const filterType = this.filterModel.getFilter();
    const filteredPoints = filter[filterType](this.pointsModel.getPoints());
    const points = [...filteredPoints];

    switch (this.currentSortType) {
      case SortType.TIME:
        return points.sort(sortPointsByTime);
      case SortType.PRICE:
        return points.sort(sortPointsByPrice);
      default:
        return points.sort(sortPointsByDay);
    }
  }

  renderPoints() {
    this.clearPointsList();
    const points = this.getSortedPoints();

    if (points.length === 0) {
      this.renderEmptyPoints();
      return;
    }

    if (!this.sortingComponent) {
      this.renderSorting();
    }

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        point: point,
        destinations: this.destinations,
        allOffers: this.allOffers,
        onDataChange: this.handlePointChange.bind(this),
        onModeChange: this.handleModeChange.bind(this)
      });

      pointPresenter.init();
      this.eventsList.appendChild(pointPresenter.routePointComponent.element);
      this.pointPresenters.set(point.id, pointPresenter);
    });
  }

  renderEmptyPoints() {
    const filterType = this.filterModel.getFilter();
    const message = EMPTY_MESSAGES[filterType] || 'Click New Event to create your first point';
    const emptyPoints = new EmptyPoints(message);
    this.eventsList.appendChild(emptyPoints.element);
  }

  handleSortTypeChange(sortType) {
    if (this.currentSortType === sortType) {
      return;
    }
    this.currentSortType = sortType;
    this.resetAllPointsView();
    this.renderPoints();
  }

  handlePointChange(updatedPoint, isDeleting = false) {
    if (isDeleting) {
      this.pointsModel.deletePoint(updatedPoint.id);
    } else {
      this.pointsModel.updatePoint(updatedPoint);
    }
    this.resetAllPointsView();
  }

  handleModeChange() {
    if (this.currentOpenPoint) {
      this.currentOpenPoint.resetView();
      this.currentOpenPoint = null;
    }
  }

  resetAllPointsView() {
    this.pointPresenters.forEach((presenter) => {
      presenter.resetView();
    });
    this.currentOpenPoint = null;
  }

  createNewPoint() {
    if (this.isNewPointCreating) {
      return;
    }

    this.isNewPointCreating = true;
    this.resetAllPointsView();

    const newPoint = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      type: 'flight',
      destination: this.destinations[0],
      basePrice: 0,
      dateFrom: new Date().toISOString(),
      dateTo: new Date(Date.now() + 3600000).toISOString(),
      offers: [],
      isFavorite: false
    };

    const newPointPresenter = new PointPresenter({
      point: newPoint,
      destinations: this.destinations,
      allOffers: this.allOffers,
      onDataChange: this.handleNewPointChange.bind(this),
      onModeChange: this.handleNewPointModeChange.bind(this),
      isNew: true
    });

    newPointPresenter.init();
    newPointPresenter.replaceToEditForm();
    this.eventsList.prepend(newPointPresenter.routePointComponent.element);
    this.pointPresenters.set(newPoint.id, newPointPresenter);
  }

  handleNewPointChange(updatedPoint, isDeleting = false) {
    if (isDeleting) {
      this.destroyNewPoint();
      return;
    }

    this.pointsModel.addPoint(updatedPoint);
    this.destroyNewPoint();
    this.resetAllPointsView();
    this.renderPoints();
  }

  handleNewPointModeChange() {
    if (this.currentOpenPoint) {
      this.currentOpenPoint.resetView();
      this.currentOpenPoint = null;
    }
  }

  destroyNewPoint() {
    if (this.currentOpenPoint && this.currentOpenPoint.isNew) {
      this.currentOpenPoint.destroy();
      this.pointPresenters.delete(this.currentOpenPoint.point.id);
    }
    this.isNewPointCreating = false;
    this.onNewPointDestroy();
  }
}
