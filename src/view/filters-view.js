import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const createFiltersTemplate = (currentFilter, availability) => {
  const filterItems = [
    { id: FilterType.EVERYTHING, label: 'Everything' },
    { id: FilterType.FUTURE, label: 'Future' },
    { id: FilterType.PRESENT, label: 'Present' },
    { id: FilterType.PAST, label: 'Past' }
  ];

  const filtersHtml = filterItems.map((filter) => `
    <div class="trip-filters__filter">
      <input
        id="filter-${filter.id}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter.id}"
        ${currentFilter === filter.id ? 'checked' : ''}
        ${!availability[filter.id] ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${filter.id}">${filter.label}</label>
    </div>
  `).join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersHtml}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

export default class FiltersView extends AbstractView {
  #currentFilter = FilterType.EVERYTHING;
  #filterAvailability = {
    [FilterType.EVERYTHING]: true,
    [FilterType.FUTURE]: true,
    [FilterType.PRESENT]: true,
    [FilterType.PAST]: true
  };

  #onFilterChange = null;

  constructor(onFilterChange) {
    super();
    this.#onFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#handleFilterChange);
  }

  get template() {
    return createFiltersTemplate(this.#currentFilter, this.#filterAvailability);
  }

  #handleFilterChange = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      this.#onFilterChange(evt.target.value);
    }
  };

  setDisabled(filterType, isDisabled) {
    const input = this.element.querySelector(`input[value="${filterType}"]`);
    if (input) {
      input.disabled = isDisabled;
    }
  }

  updateFilter(newFilter, availability) {
    if (availability) {
      this.#filterAvailability = availability;
    }
    this.#currentFilter = newFilter;

    const inputs = this.element.querySelectorAll('input[type="radio"]');
    inputs.forEach((input) => {
      input.checked = input.value === newFilter;
      if (availability) {
        input.disabled = !availability[input.value];
      }
    });
  }
}
