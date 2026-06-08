import Filters from '../view/filters-view.js';

export default class FilterPresenter {
  #filterModel = null;
  #pointsModel = null;
  #onFilterChange = null;
  #filterComponent = null;
  #container = null;

  constructor({ filterModel, pointsModel, onFilterChange }) {
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#onFilterChange = onFilterChange;
    this.#container = document.querySelector('.trip-controls__filters');
  }

  init() {
    this.#renderFilters();
    this.#filterModel.addObserver(() => this.#handleModelChange());
    this.#pointsModel.addObserver(() => this.#updateFilterAvailability());
    this.#updateFilterAvailability();
  }

  #renderFilters() {
    if (!this.#container) {
      return;
    }
    this.#filterComponent = new Filters();
    this.#filterComponent.setFilterChangeHandler(this.#handleFilterChange.bind(this));
    this.#container.innerHTML = '';
    this.#container.appendChild(this.#filterComponent.element);
  }

  #handleFilterChange(filterType) {
    if (this.#filterModel.getFilter() === filterType) {
      return;
    }
    this.#filterModel.setFilter(filterType);
    this.#onFilterChange(filterType);
  }

  #handleModelChange() {
    const currentFilter = this.#filterModel.getFilter();
    const filterAvailability = this.#filterModel.getFilterAvailability();
    this.#filterComponent.updateFilter(currentFilter, filterAvailability);
    this.#onFilterChange(currentFilter);
  }

  #updateFilterAvailability() {
    const points = this.#pointsModel.getPoints();
    this.#filterModel.updateFilterAvailability(points);
  }
}
