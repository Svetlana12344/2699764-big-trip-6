export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export default class FilterModel {
  #currentFilter = FilterType.EVERYTHING;
  #observers = [];

  getFilter() {
    return this.#currentFilter;
  }

  setFilter(filter) {
    this.#currentFilter = filter;
    this.#notifyObservers();
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers() {
    this.#observers.forEach((observer) => observer());
  }
}
