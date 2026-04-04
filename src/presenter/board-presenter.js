import Filters from '../view/filters-view.js';
import Sorting from '../view/sorting-view.js';
import EditForm from '../view/edit-form-view.js';
import RoutePoint from '../view/route-point-view.js';

export default class BoardPresenter {
  constructor({ pointsModel }) {
    this.pointsModel = pointsModel;
    this.boardContainer = document.querySelector('.trip-events');
    this.eventsList = null;
    this.routePoints = [];
    this.currentEditForm = null;
  }

  init() {
    this.renderFilters();
    this.renderSorting();
    this.createEventsList();
    this.renderRoutePoints();
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

  renderRoutePoints() {
    const points = this.pointsModel.getPoints();

    this.routePoints = points.map((point) => new RoutePoint(point));

    this.routePoints.forEach((routePoint) => {
      routePoint.setRollupClickHandler(() => {
        this.replacePointToEditForm(routePoint);
      });
      this.eventsList.appendChild(routePoint.element);
    });
  }

  replacePointToEditForm(routePoint) {
    const editForm = new EditForm(routePoint.point);

    editForm.setFormSubmitHandler(() => {
      this.replaceEditFormToPoint(editForm, routePoint);
    });

    editForm.setRollupClickHandler(() => {
      this.replaceEditFormToPoint(editForm, routePoint);
    });

    this.eventsList.replaceChild(editForm.element, routePoint.element);
    this.currentEditForm = editForm;

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape') {
        this.replaceEditFormToPoint(editForm, routePoint);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    document.addEventListener('keydown', onEscKeyDown);
  }

  replaceEditFormToPoint(editForm, routePoint) {
    this.eventsList.replaceChild(routePoint.element, editForm.element);
    this.currentEditForm = null;
  }
}
