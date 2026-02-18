import Filters from '../view/filters.js';
import Sorting from '../view/sorting.js';
import CreateForm from '../view/create-form.js';
import EditForm from '../view/edit-form.js';
import RoutePoint from '../view/route-point.js';

export default class BoardPresenter {
  constructor() {
    this.boardContainer = document.querySelector('.trip-events');
    this.filtersContainer = document.querySelector('.trip-main__trip-controls');
    this.sortingContainer = this.boardContainer;
    this.eventsList = null;
  }

  init() {
    // Отрисовка фильтров
    this.renderFilters();
    
    // Отрисовка сортировки
    this.renderSorting();
    
    // Создаём контейнер для списка событий
    this.createEventsList();
    
    // Отрисовка формы редактирования (первой)
    this.renderEditForm();
    
    // Отрисовка трёх точек маршрута
    this.renderRoutePoints(3);
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
    const editForm = new EditForm();
    this.eventsList.prepend(editForm.getElement());
  }

  renderRoutePoints(count) {
    for (let i = 0; i < count; i++) {
      const routePoint = new RoutePoint();
      this.eventsList.appendChild(routePoint.getElement());
    }
  }
}