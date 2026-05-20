import Filters from '../view/filters-view.js';
import Sorting from '../view/sorting-view.js';
import EmptyPoints from '../view/empty-points-view.js';
import PointPresenter from './point-presenter.js';
import { sortPointsByDay, sortPointsByTime, sortPointsByPrice, SortType } from '../utils/sort-utils.js';

export default class BoardPresenter {
  constructor({ pointsModel }) {
    this.pointsModel = pointsModel;
    this.boardContainer = document.querySelector('.trip-events');
    this.eventsList = null;
    this.pointPresenters = new Map();
    this.currentOpenPoint = null;
    this.currentSortType = SortType.DAY;
    this.sortingComponent = null;
  }

  init() {
    this.renderFilters();
    this.renderSorting();
    this.createEventsList();
    this.renderPoints();
  }

  renderFilters() {
    const filters = new Filters();
    const filtersSection = document.querySelector('.trip-controls__filters');
    if (filtersSection) {
      filtersSection.innerHTML = '';
      filtersSection.appendChild(filters.element);
    }
  }

  renderSorting() {
    this.sortingComponent = new Sorting();
    this.sortingComponent.setSortTypeChangeHandler(this.handleSortTypeChange.bind(this));
    const sortingElement = this.sortingComponent.element;
    sortingElement.classList.add('trip-events__trip-sort');
    this.boardContainer.prepend(sortingElement);
  }

  createEventsList() {
    this.eventsList = document.createElement('ul');
    this.eventsList.classList.add('trip-events__list');
    this.boardContainer.appendChild(this.eventsList);
  }

  clearPointsList() {
    this.eventsList.innerHTML = '';
    this.pointPresenters.clear();
  }

  getSortedPoints() {
    const points = [...this.pointsModel.getPoints()];

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

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        point: point,
        onDataChange: this.handlePointChange.bind(this),
        onModeChange: this.handleModeChange.bind(this)
      });

      pointPresenter.init();
      this.eventsList.appendChild(pointPresenter.routePointComponent.element);
      this.pointPresenters.set(point.id, pointPresenter);
    });
  }

  renderEmptyPoints() {
    const emptyPoints = new EmptyPoints();
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

  handlePointChange(updatedPoint) {
    const points = this.pointsModel.getPoints();
    const index = points.findIndex((point) => point.id === updatedPoint.id);

    if (index !== -1) {
      points[index] = updatedPoint;
      this.pointsModel.setPoints(points);
      this.resetAllPointsView();
      this.renderPoints();
    }
  }

  handleModeChange() {
    if (this.currentOpenPoint) {
      this.currentOpenPoint.resetView();
      this.currentOpenPoint = null;
    }
    this.currentOpenPoint = this.pointPresenters.get(this.currentOpenPoint?.point?.id);
  }

  resetAllPointsView() {
    this.pointPresenters.forEach((presenter) => {
      presenter.resetView();
    });
    this.currentOpenPoint = null;
  }
}
