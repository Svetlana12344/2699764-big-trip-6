import dayjs from 'dayjs';
import { FilterType } from '../const.js';

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
    if (!points || points.length === 0) {
      this.#filterAvailability = {
        [FilterType.EVERYTHING]: false,
        [FilterType.FUTURE]: false,
        [FilterType.PRESENT]: false,
        [FilterType.PAST]: false
      };
      this.#notifyObservers();
      return;
    }

    const now = dayjs();
    const hasFuture = points.some((point) => dayjs(point.dateFrom).isAfter(now));
    const hasPresent = points.some((point) =>
      dayjs(point.dateFrom).isBefore(now) && dayjs(point.dateTo).isAfter(now)
    );
    const hasPast = points.some((point) => dayjs(point.dateTo).isBefore(now));

    this.#filterAvailability = {
      [FilterType.EVERYTHING]: points.length > 0,
      [FilterType.FUTURE]: hasFuture,
      [FilterType.PRESENT]: hasPresent,
      [FilterType.PAST]: hasPast
    };

    if (!this.#filterAvailability[this.#currentFilter]) {
      this.#currentFilter = FilterType.EVERYTHING;
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
