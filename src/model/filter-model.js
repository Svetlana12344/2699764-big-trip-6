export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export default class FilterModel {
  #currentFilter = FilterType.EVERYTHING;
  #observers = [];
  #filterAvailability = {
    [FilterType.EVERYTHING]: true,
    [FilterType.FUTURE]: true,
    [FilterType.PRESENT]: true,
    [FilterType.PAST]: true
  };

  getFilter() {
    return this.#currentFilter;
  }

  setFilter(filter) {
    if (!this.#filterAvailability[filter]) {
      return;
    }
    this.#currentFilter = filter;
    this.#notifyObservers();
  }

  getFilterAvailability() {
    return this.#filterAvailability;
  }

  updateFilterAvailability(points) {
    const now = new Date();
    const hasFuture = points.some((point) => new Date(point.dateFrom) > now);
    const hasPresent = points.some((point) =>
      new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now
    );
    const hasPast = points.some((point) => new Date(point.dateTo) < now);

    this.#filterAvailability = {
      [FilterType.EVERYTHING]: points.length > 0,
      [FilterType.FUTURE]: hasFuture,
      [FilterType.PRESENT]: hasPresent,
      [FilterType.PAST]: hasPast
    };

    if (!this.#filterAvailability[this.#currentFilter]) {
      this.setFilter(FilterType.EVERYTHING);
    }

    this.#notifyObservers();
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers() {
    this.#observers.forEach((observer) => observer());
  }
}
