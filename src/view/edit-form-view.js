import AbstractStatefulView from './abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { formatDate } from '../utils/date-utils.js';

const createEditFormTemplate = (state) => {
  const { type, destination, basePrice, dateFrom, dateTo, offers, destinations, allOffers, isNew } = state;
  const startDateStr = formatDate(dateFrom);
  const endDateStr = formatDate(dateTo);
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
  const destinationName = destination ? destination.name : '';
  const typeOptions = [
    'taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'
  ].map((typeOption) => {
    const formattedTypeOption = typeOption.charAt(0).toUpperCase() + typeOption.slice(1);
    const isChecked = typeOption === type ? 'checked' : '';

    return `
      <div class="event__type-item">
        <input
          id="event-type-${typeOption}-1"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${typeOption}"
          ${isChecked}
          data-type="${typeOption}"
        >
        <label
          class="event__type-label event__type-label--${typeOption}"
          for="event-type-${typeOption}-1"
        >
          ${formattedTypeOption}
        </label>
      </div>
    `;
  }).join('');

  const currentOffers = allOffers[type] || [];
  const offersTemplate = currentOffers.length > 0 ? `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${currentOffers.map((offer) => {
    const isChecked = offers.some((selected) => selected.id === offer.id);
    return `
            <div class="event__offer-selector">
              <input
                class="event__offer-checkbox visually-hidden"
                id="event-offer-${offer.id}"
                type="checkbox"
                name="event-offer-${offer.id}"
                ${isChecked ? 'checked' : ''}
                data-offer-id="${offer.id}"
              >
              <label class="event__offer-label" for="event-offer-${offer.id}">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>
          `;
  }).join('')}
      </div>
    </section>
  ` : '';

  const destinationsList = destinations.map((dest) => `
    <option value="${dest.name}"></option>
  `).join('');

  const destinationTemplate = destination && destination.description ? `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      ${destination.pictures && destination.pictures.length > 0 ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${destination.pictures.map((pic) => `
              <img class="event__photo" src="${pic.src}" alt="${pic.description || 'Event photo'}">
            `).join('')}
          </div>
        </div>
      ` : ''}
    </section>
  ` : '';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typeOptions}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            ${formattedType}
          </label>
          <input
            class="event__input event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${destinationName}"
            list="destination-list-1"
            autocomplete="off"
          >
          <datalist id="destination-list-1">
            ${destinationsList}
          </datalist>
        </div>
        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input
            class="event__input event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            value="${startDateStr}"
            data-date-type="start"
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input
            class="event__input event__input--time"
            id="event-end-time-1"
            type="text"
            name="event-end-time"
            value="${endDateStr}"
            data-date-type="end"
          >
        </div>
        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input event__input--price"
            id="event-price-1"
            type="number"
            name="event-price"
            value="${basePrice || 0}"
            min="0"
            step="1"
          >
        </div>
        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isNew ? 'Cancel' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersTemplate}
        ${destinationTemplate}
      </section>
    </form>
  </li>`;
};

export default class EditForm extends AbstractStatefulView {
  constructor({ point, destinations, allOffers, isNew = false }) {
    super();
    this._point = point;
    this._destinations = destinations;
    this._allOffers = allOffers;
    this._isNew = isNew;
    this._datepickerStart = null;
    this._datepickerEnd = null;
    this._state = this._getStateFromPoint(point);
  }

  _getStateFromPoint(point) {
    return {
      type: point.type,
      destination: point.destination,
      basePrice: point.basePrice,
      dateFrom: point.dateFrom,
      dateTo: point.dateTo,
      offers: point.offers || [],
      destinations: this._destinations,
      allOffers: this._allOffers,
      isNew: this._isNew
    };
  }

  get template() {
    return createEditFormTemplate(this._state);
  }

  _restoreHandlers() {
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setTypeChangeHandler();
    this.setDestinationChangeHandler();
    this.setOffersChangeHandler();
    this.initDatepickers();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    if (rollupBtn) {
      rollupBtn.addEventListener('click', this.#rollupClickHandler);
    }
  }

  setTypeChangeHandler() {
    const typeInputs = this.element.querySelectorAll('.event__type-input');
    typeInputs.forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });
  }

  setDestinationChangeHandler() {
    const destinationInput = this.element.querySelector('.event__input--destination');
    if (destinationInput) {
      destinationInput.addEventListener('change', this.#destinationChangeHandler);
    }
  }

  setOffersChangeHandler() {
    const offerCheckboxesElements = this.element.querySelectorAll('.event__offer-checkbox');
    offerCheckboxesElements.forEach((checkbox) => {
      checkbox.addEventListener('change', this.#offersChangeHandler);
    });
  }

  initDatepickers() {
    const startDateInput = this.element.querySelector('[data-date-type="start"]');
    const endDateInput = this.element.querySelector('[data-date-type="end"]');

    if (this._datepickerStart) {
      this._datepickerStart.destroy();
    }
    if (this._datepickerEnd) {
      this._datepickerEnd.destroy();
    }

    this._datepickerStart = flatpickr(startDateInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom,
      onChange: this.#startDateChangeHandler
    });

    this._datepickerEnd = flatpickr(endDateInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateTo,
      onChange: this.#endDateChangeHandler
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const newType = evt.target.value;
    const newOffers = this._allOffers[newType] || [];

    this.updateState({
      type: newType,
      offers: newOffers.filter((offer) => offer.accepted)
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destinationName = evt.target.value;
    const newDestination = this._destinations.find((dest) => dest.name === destinationName);

    if (newDestination) {
      this.updateState({
        destination: newDestination
      });
    }
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    const offerId = evt.target.dataset.offerId;
    const currentOffers = [...this._state.offers];
    const offerIndex = currentOffers.findIndex((offer) => offer.id === offerId);

    if (offerIndex === -1) {
      const allCurrentOffers = this._allOffers[this._state.type] || [];
      const offer = allCurrentOffers.find((offer) => offer.id === offerId);
      if (offer) {
        currentOffers.push({ ...offer, accepted: true });
      }
    } else {
      currentOffers.splice(offerIndex, 1);
    }

    this.updateState({
      offers: currentOffers
    });
  };

  #startDateChangeHandler = ([userDate]) => {
    this.updateState({
      dateFrom: userDate.toISOString()
    });
  };

  #endDateChangeHandler = ([userDate]) => {
    this.updateState({
      dateTo: userDate.toISOString()
    });
  };
}
