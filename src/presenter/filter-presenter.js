import Filters from '../view/filters-view.js';
import { FilterType } from '../utils/filter-utils.js';

export default class FilterPresenter {
  constructor({ filterModel, onFilterChange }) {
    this.filterModel = filterModel;
    this.onFilterChange = onFilterChange;
    this.filterComponent = null;
    this.container = document.querySelector('.trip-controls__filters');
  }

  init() {
    this.renderFilters();
    this.filterModel.addObserver(() => this.handleModelChange());
  }

  renderFilters() {
    this.filterComponent = new Filters();
    this.filterComponent.setFilterChangeHandler(this.handleFilterChange.bind(this));
    this.container.innerHTML = '';
    this.container.appendChild(this.filterComponent.element);
  }

  handleFilterChange(filterType) {
    if (this.filterModel.getFilter() === filterType) {
      return;
    }
    this.filterModel.setFilter(filterType);
  }

  handleModelChange() {
    const currentFilter = this.filterModel.getFilter();
    this.filterComponent.updateFilter(currentFilter);
    this.onFilterChange();
  }
}
