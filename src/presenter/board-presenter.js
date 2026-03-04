import Filters from '../view/filters-view.js';
import Sorting from '../view/sorting-view.js';
import EditForm from '../view/edit-form-view.js';
import RoutePoint from '../view/route-point-view.js';

export default class BoardPresenter {
  constructor({ pointsModel }) {
    this.pointsModel = pointsModel;
    this.boardContainer = document.querySelector('.trip-events');
    this.filtersContainer = document.querySelector('.trip-main__trip-controls');
    this.sortingContainer = this.boardContainer;
    this.eventsList = null;
    this.routePoints = [];
  }

  init() {
    this.renderFilters();
    this.renderSorting();
    this.createEventsList();
    this.renderEditForm();
    this.renderRoutePoints();
  }

  renderFilters() {
    const filters = new Filters();
    const filtersSection = document.querySelector('.trip-controls__filters');
    if (filtersSection) {
      filtersSection.innerHTML = '';
      filtersSection.appendChild(filters.getElement());
    }
  }

  renderSorting() {
    const sorting = new Sorting();
    const sortingElement = sorting.getElement();
    sortingElement.classList.add('trip-events__trip-sort');
    this.boardContainer.prepend(sortingElement);
  }

  createEventsList() {
    this.eventsList = document.createElement('ul');
    this.eventsList.classList.add('trip-events__list');
    this.boardContainer.appendChild(this.eventsList);
  }

  renderEditForm() {
    const points = this.pointsModel.getPoints();
    const firstPoint = points[0];
    const editForm = new EditForm(firstPoint);
    this.eventsList.prepend(editForm.getElement());
  }

  renderRoutePoints() {
    const points = this.pointsModel.getPoints();
    
    this.routePoints = points.map((point) => new RoutePoint(point));
    
    this.routePoints.forEach((routePoint) => {
      this.eventsList.appendChild(routePoint.getElement());
    });
  }
}