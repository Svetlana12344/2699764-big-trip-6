import Filters from '../view/filters-view.js';
import Sorting from '../view/sorting-view.js';
import EmptyPoints from '../view/empty-points-view.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  constructor({ pointsModel }) {
    this.pointsModel = pointsModel;
    this.boardContainer = document.querySelector('.trip-events');
    this.eventsList = null;
    this.pointPresenters = new Map();
    this.currentOpenPoint = null;
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
    const sorting = new Sorting();
    const sortingElement = sorting.element;
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

  renderPoints() {
    this.clearPointsList();
    const points = this.pointsModel.getPoints();

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

  handlePointChange(updatedPoint) {
    const points = this.pointsModel.getPoints();
    const index = points.findIndex((point) => point.id === updatedPoint.id);

    if (index !== -1) {
      points[index] = updatedPoint;
      this.pointsModel.setPoints(points);

      const pointPresenter = this.pointPresenters.get(updatedPoint.id);
      if (pointPresenter) {
        pointPresenter.update(updatedPoint);
      }
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
