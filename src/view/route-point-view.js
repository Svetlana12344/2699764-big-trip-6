import AbstractView from './abstract-view.js';
import { formatShortDate, formatTime, formatDuration } from '../utils/date-utils.js';
import he from 'he';

export default class RoutePoint extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return this.#createRoutePointTemplate();
  }

  #createRoutePointTemplate() {
    const point = this.#point;
    if (!point) {
      return '<li class="trip-events__item">Ошибка загрузки точки</li>';
    }

    const { type, destination, basePrice, dateFrom, dateTo, offers, isFavorite } = point;

    const date = formatShortDate(dateFrom);
    const startTimeStr = formatTime(dateFrom);
    const endTimeStr = formatTime(dateTo);
    const durationStr = formatDuration(dateFrom, dateTo);

    const selectedOffers = offers && offers.length ? offers.filter((offer) => offer.accepted) : [];

    const offersTemplate = selectedOffers.length > 0 ? `
      <ul class="event__selected-offers">
        ${selectedOffers.map((offer) => `
          <li class="event__offer">
            <span class="event__offer-title">${he.encode(offer.title)}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>
        `).join('')}
      </ul>
    ` : '';

    const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
    const formattedType = type ? he.encode(type.charAt(0).toUpperCase() + type.slice(1)) : '';
    const destinationName = destination && destination.name ? he.encode(destination.name) : '';

    return `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type || 'flight'}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${formattedType} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${startTimeStr}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${endTimeStr}</time>
          </p>
          <p class="event__duration">${durationStr}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${offersTemplate}
        <button class="event__favorite-btn ${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    if (rollupBtn) {
      rollupBtn.addEventListener('click', this.#rollupClickHandler);
    }
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    const favoriteBtn = this.element.querySelector('.event__favorite-btn');
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', this.#favoriteClickHandler);
    }
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
