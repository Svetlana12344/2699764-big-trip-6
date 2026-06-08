import AbstractView from './abstract-view.js';

export default class Filters extends AbstractView {
  _currentFilter = 'everything';
  _filterAvailability = {
    everything: true,
    future: true,
    present: true,
    past: true
  };

  get template() {
    return this.#createFiltersTemplate();
  }

  #createFiltersTemplate() {
    const filters = [
      { id: 'everything', label: 'Everything' },
      { id: 'future', label: 'Future' },
      { id: 'present', label: 'Present' },
      { id: 'past', label: 'Past' }
    ];

    const filtersHtml = filters.map((filter) => `
      <div class="trip-filters__filter">
        <input
          id="filter-${filter.id}"
          class="trip-filters__filter-input visually-hidden"
          type="radio"
          name="trip-filter"
          value="${filter.id}"
          ${this._currentFilter === filter.id ? 'checked' : ''}
          ${!this._filterAvailability[filter.id] ? 'disabled' : ''}
        >
        <label class="trip-filters__filter-label" for="filter-${filter.id}">${filter.label}</label>
      </div>
    `).join('');

    return `<form class="trip-filters" action="#" method="get">
      ${filtersHtml}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
  }

  setFilterChangeHandler(callback) {
    this._callback.filterChange = callback;
    this.element.querySelectorAll('.trip-filters__filter-label').forEach((label) => {
      label.addEventListener('click', this.#labelClickHandler);
    });
  }

  updateFilter(filter, filterAvailability) {
    this._currentFilter = filter;
    this._filterAvailability = filterAvailability;
    
    const filters = ['everything', 'future', 'present', 'past'];
    filters.forEach((filterId) => {
      const input = this.element.querySelector(`#filter-${filterId}`);
      if (input) {
        input.checked = (this._currentFilter === filterId);
        input.disabled = !this._filterAvailability[filterId];
      }
    });
  }

  #labelClickHandler = (evt) => {
    evt.preventDefault();
    const label = evt.target;
    const forId = label.getAttribute('for');
    const input = document.getElementById(forId);
    
    if (input && !input.disabled) {
      input.checked = true;
      this._callback.filterChange(input.value);
    }
  };
}
