import Sorting from '../view/sorting-view.js';
import EmptyPoints from '../view/empty-points-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter, { UserAction } from './point-presenter.js';
import { sortPointsByDay, sortPointsByTime, sortPointsByPrice, SortType } from '../utils/sort-utils.js';
import { filter } from '../utils/filter-utils.js';

const EMPTY_MESSAGES = {
  'everything': 'Click New Event to create your first point',
  'future': 'There are no future events now',
  'present': 'There are no present events now',
  'past': 'There are no past events now'
};

export default class BoardPresenter {
  constructor({ pointsModel, filterModel, destinationsModel, offersModel, onNewPointDestroy }) {
    this.pointsModel = pointsModel;
    this.filterModel = filterModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.onNewPointDestroy = onNewPointDestroy;
    this.boardContainer = document.querySelector('.trip-events');
    this.eventsList = null;
    this.pointPresenters = new Map();
    this.currentOpenPoint = null;
    this.currentSortType = SortType.DAY;
    this.sortingComponent = null;
    this.isNewPointCreating = false;
    this.isLoading = true;
    this.loadingComponent = null;
  }

  async init() {
    this.renderLoading();
    await this.pointsModel.init();
    await this.destinationsModel.init();
    await this.offersModel.init();
    this.isLoading = false;
    this.renderSorting();
    this.createEventsList();
    this.renderPoints();
    this.pointsModel.addObserver(() => this.renderPoints());
    this.filterModel.addObserver(() => this.renderPoints());
  }

  renderLoading() {
    this.loadingComponent = new LoadingView();
    this.boardContainer.appendChild(this.loadingComponent.element);
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
    if (this.isLoading) {
      return;
    }

    if (this.loadingComponent) {
      this.loadingComponent.removeElement();
      this.loadingComponent = null;
    }

    this.clearPointsList();
    const points = this.getSortedPoints();

    if (points.length === 0) {
      this.renderEmptyPoints();
      return;
    }

    if (!this.sortingComponent) {
      this.renderSorting();
    }

    const destinations = this.destinationsModel.getDestinations();
    const allOffers = this.offersModel.getOffers();

    points.forEach((point) => {
      const destination = destinations.find((dest) => dest.id === point.destination);
      const pointWithDestination = { ...point, destination };

      const pointPresenter = new PointPresenter({
        point: pointWithDestination,
        destinations: destinations,
        allOffers: allOffers,
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

  async handlePointChange(updatedPoint, action) {
    if (action === UserAction.DELETE) {
      await this.pointsModel.deletePoint(updatedPoint.id);
      this.resetAllPointsView();
    } else if (action === UserAction.UPDATE) {
      await this.pointsModel.updatePoint(updatedPoint);
      this.resetAllPointsView();
    }
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

  async createNewPoint() {
    if (this.isNewPointCreating) {
      return;
    }

    this.isNewPointCreating = true;
    this.resetAllPointsView();

    const destinations = this.destinationsModel.getDestinations();
    const firstDestination = destinations[0];

    const newPoint = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      type: 'flight',
      destination: firstDestination ? firstDestination.id : null,
      basePrice: 0,
      dateFrom: new Date().toISOString(),
      dateTo: new Date(Date.now() + 3600000).toISOString(),
      offers: [],
      isFavorite: false
    };

    const newPointPresenter = new PointPresenter({
      point: newPoint,
      destinations: destinations,
      allOffers: this.offersModel.getOffers(),
      onDataChange: this.handleNewPointChange.bind(this),
      onModeChange: this.handleNewPointModeChange.bind(this),
      isNew: true
    });

    newPointPresenter.init();
    newPointPresenter.replaceToEditForm();
    this.eventsList.prepend(newPointPresenter.routePointComponent.element);
    this.pointPresenters.set(newPoint.id, newPointPresenter);
  }

  async handleNewPointChange(updatedPoint, action) {
    if (action === UserAction.DELETE) {
      this.destroyNewPoint();
      return;
    }

    await this.pointsModel.addPoint(updatedPoint);
    this.destroyNewPoint();
    this.resetAllPointsView();
    this.renderPoints();
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
