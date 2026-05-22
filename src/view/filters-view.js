import AbstractView from './abstract-view.js';

const createFiltersTemplate = (currentFilter) => `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="everything" ${currentFilter === 'everything' ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>
    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="future" ${currentFilter === 'future' ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>
    <div class="trip-filters__filter">
      <input id="filter-present" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="present" ${currentFilter === 'present' ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-present">Present</label>
    </div>
    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="past" ${currentFilter === 'past' ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class Filters extends AbstractView {
  constructor() {
    super();
    this._currentFilter = 'everything';
  }

  get template() {
    return createFiltersTemplate(this._currentFilter);
  }

  setFilterChangeHandler(callback) {
    this._callback.filterChange = callback;
    this.element.querySelectorAll('.trip-filters__filter-input').forEach((input) => {
      input.addEventListener('change', this.#filterChangeHandler);
    });
  }

  updateFilter(filter) {
    this._currentFilter = filter;
    this.updateElement();
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterChange(evt.target.value);
  };
}
