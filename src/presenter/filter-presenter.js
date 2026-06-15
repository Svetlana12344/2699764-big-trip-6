import { render } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { FilterType } from '../const.js';

export default class FilterController {
  #container = null;
  #filterModel = null;
  #tripsModel = null;
  #onFilterChange = null;
  #onSortReset = null;

  #filterWidget = null;

  constructor({ filterContainer, filterModel, pointsModel, onFilterChange, onSortReset }) {
    this.#container = filterContainer;
    this.#filterModel = filterModel;
    this.#tripsModel = pointsModel;
    this.#onFilterChange = onFilterChange;
    this.#onSortReset = onSortReset;

    this.#filterModel.addObserver(this.#handleModelUpdate);
  }

  init() {
    this.#filterWidget = new FiltersView(this.#handleFilterSelect);
    render(this.#filterWidget, this.#container);
    this.#updateFiltersState();
  }

  #handleFilterSelect = (filterType) => {
    if (this.#filterModel.getFilter() === filterType) {
      return;
    }
    this.#filterModel.setFilter(filterType);
    this.#onSortReset?.();
    this.#onFilterChange?.();
  };

  #handleModelUpdate = () => {
    if (this.#filterWidget) {
      this.#filterWidget.updateFilter(this.#filterModel.getFilter());
      this.#updateFiltersState();
    }
  };

  #updateFiltersState() {
    if (!this.#tripsModel || !this.#filterWidget) return;
    
    const allTrips = this.#tripsModel.getPoints();
    const currentTime = new Date();

    if (!allTrips || allTrips.length === 0) {
      return;
    }

    const hasFutureTrips = allTrips.some((trip) => new Date(trip.dateFrom) > currentTime);
    const hasPresentTrips = allTrips.some((trip) => {
      const startTime = new Date(trip.dateFrom);
      const endTime = new Date(trip.dateEnd);
      return startTime <= currentTime && endTime >= currentTime;
    });
    const hasPastTrips = allTrips.some((trip) => new Date(trip.dateEnd) < currentTime);

    this.#filterWidget.setDisabled(FilterType.FUTURE, !hasFutureTrips);
    this.#filterWidget.setDisabled(FilterType.PRESENT, !hasPresentTrips);
    this.#filterWidget.setDisabled(FilterType.PAST, !hasPastTrips);
    this.#filterWidget.setDisabled(FilterType.EVERYTHING, false);
  }

  setFilterDisabled(filterType, isDisabled) {
    if (this.#filterWidget) {
      this.#filterWidget.setDisabled(filterType, isDisabled);
    }
  }
}
