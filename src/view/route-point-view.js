import AbstractView from './abstract-view.js';

const createRoutePointTemplate = (point) => {
  const { type, destination, basePrice, dateFrom, dateTo, offers, isFavorite } = point;

  const startTime = new Date(dateFrom);
  const endTime = new Date(dateTo);
  const date = startTime.toLocaleString('en', { month: 'short', day: '2-digit' }).toUpperCase();
  const startTimeStr = startTime.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
  const endTimeStr = endTime.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

  const durationMs = endTime - startTime;
  const durationMin = Math.floor(durationMs / (1000 * 60));
  const hours = Math.floor(durationMin / 60);
  const minutes = durationMin % 60;

  let durationStr = '';
  if (hours > 0) {
    durationStr = `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else {
    durationStr = `${minutes}M`;
  }

  const selectedOffers = offers.filter((offer) => offer.accepted);

  const offersTemplate = selectedOffers.length > 0 ? `
    <ul class="event__selected-offers">
      ${selectedOffers.map((offer) => `
        <li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>
      `).join('')}
    </ul>
  ` : '';

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${startTime.toISOString().split('T')[0]}">${date}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${formattedType} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startTime.toISOString()}">${startTimeStr}</time>
          &mdash;
          <time class="event__end-time" datetime="${endTime.toISOString()}">${endTimeStr}</time>
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
};

export default class RoutePoint extends AbstractView {
  constructor(point) {
    super();
    this.point = point;
  }

  get template() {
    return createRoutePointTemplate(this.point);
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
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
