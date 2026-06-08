import AbstractStatefulView from './abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import { formatDate } from '../utils/date-utils.js';
import he from 'he';

const SHAKE_ANIMATION_DURATION_MS = 500;

export default class EditForm extends AbstractStatefulView {
  #point = null;
  #destinations = [];
  #allOffers = {};
  #isNew = false;
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor({ point, destinations, allOffers, isNew = false }) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#allOffers = allOffers;
    this.#isNew = isNew;
    this._state = this.#getStateFromPoint(point);
  }

  #getStateFromPoint(point) {
    return {
      id: point.id,
      type: point.type || 'flight',
      destination: point.destination || null,
      basePrice: point.basePrice || 0,
      dateFrom: point.dateFrom || new Date().toISOString(),
      dateTo: point.dateTo || new Date(Date.now() + 3600000).toISOString(),
      offers: point.offers || [],
      destinations: this.#destinations,
      allOffers: this.#allOffers,
      isNew: this.#isNew
    };
  }

  get template() {
    return this.#createEditFormTemplate(this._state);
  }

  #createEditFormTemplate(state) {
    const { type, destination, basePrice, dateFrom, dateTo, offers, destinations, allOffers, isNew } = state;
    const startDateStr = dateFrom ? formatDate(dateFrom) : '';
    const endDateStr = dateTo ? formatDate(dateTo) : '';
    const formattedType = type ? he.encode(type.charAt(0).toUpperCase() + type.slice(1)) : 'Flight';
    const destinationName = destination && destination.name ? he.encode(destination.name) : '';

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
          <label class="event__type-label event__type-label--${typeOption}" for="event-type-${typeOption}-1">
            ${formattedTypeOption}
          </label>
        </div>
      `;
    }).join('');

    const currentOffers = allOffers && allOffers[type] ? allOffers[type] : [];
    const offersTemplate = currentOffers.length > 0 ? `
      <section class="event__section event__section--offers">
        <h3 class="event__section-title event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${currentOffers.map((offer) => {
    const isChecked = offers && offers.some((selected) => selected.id === offer.id);
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
                  <span class="event__offer-title">${he.encode(offer.title)}</span>
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
      <option value="${he.encode(dest.name)}"></option>
    `).join('');

    const destinationTemplate = destination && destination.description ? `
      <section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${he.encode(destination.description)}</p>
        ${destination.pictures && destination.pictures.length > 0 ? `
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${destination.pictures.map((pic) => `
                <img class="event__photo" src="${he.encode(pic.src)}" alt="${he.encode(pic.description || 'Event photo')}">
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
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type || 'flight'}.png" alt="Event type icon">
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
              value="${he.encode(startDateStr)}"
              data-date-type="start"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${he.encode(endDateStr)}"
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
  }

  _restoreHandlers() {
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.#setTypeChangeHandler();
    this.#setDestinationChangeHandler();
    this.#setOffersChangeHandler();
    this.#initDatepickers();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    const form = this.element.querySelector('form');
    if (form) {
      form.addEventListener('submit', this.#formSubmitHandler);
    }
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    if (rollupBtn) {
      rollupBtn.addEventListener('click', this.#rollupClickHandler);
    }
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    const deleteBtn = this.element.querySelector('.event__reset-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', this.#deleteClickHandler);
    }
  }

  setSavingState() {
    const saveBtn = this.element.querySelector('.event__save-btn');
    if (saveBtn) {
      saveBtn.textContent = 'Saving...';
      saveBtn.disabled = true;
    }
    const deleteBtn = this.element.querySelector('.event__reset-btn');
    if (deleteBtn && deleteBtn.textContent === 'Delete') {
      deleteBtn.disabled = true;
    }
  }

  setDeletingState() {
    const deleteBtn = this.element.querySelector('.event__reset-btn');
    if (deleteBtn && deleteBtn.textContent === 'Delete') {
      deleteBtn.textContent = 'Deleting...';
      deleteBtn.disabled = true;
    }
    const saveBtn = this.element.querySelector('.event__save-btn');
    if (saveBtn) {
      saveBtn.disabled = true;
    }
  }

  setDefaultState() {
    const saveBtn = this.element.querySelector('.event__save-btn');
    if (saveBtn) {
      saveBtn.textContent = 'Save';
      saveBtn.disabled = false;
    }
    const deleteBtn = this.element.querySelector('.event__reset-btn');
    if (deleteBtn && deleteBtn.textContent === 'Deleting...') {
      deleteBtn.textContent = 'Delete';
      deleteBtn.disabled = false;
    }
  }

  shake() {
    this.element.style.animation = 'shake 0.5s';
    setTimeout(() => {
      this.element.style.animation = '';
    }, SHAKE_ANIMATION_DURATION_MS);
  }

  getData() {
    const destinationId = this._state.destination && typeof this._state.destination === 'object'
      ? this._state.destination.id
      : this._state.destination;

    const data = {
      type: this._state.type,
      destination: destinationId,
      basePrice: parseInt(this._state.basePrice, 10),
      dateFrom: this._state.dateFrom,
      dateTo: this._state.dateTo,
      offers: this._state.offers || [],
      isFavorite: this.#point ? this.#point.isFavorite : false
    };

    if (!this.#isNew && this.#point && this.#point.id) {
      data.id = this.#point.id;
    }

    return data;
  }

  destroy() {
    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
    this.removeElement();
  }

  #setTypeChangeHandler() {
    const typeInputs = this.element.querySelectorAll('.event__type-input');
    typeInputs.forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });
  }

  #setDestinationChangeHandler() {
    const destinationInput = this.element.querySelector('.event__input--destination');
    if (destinationInput) {
      destinationInput.addEventListener('change', this.#destinationChangeHandler);
    }
  }

  #setOffersChangeHandler() {
    const offerCheckboxesElements = this.element.querySelectorAll('.event__offer-checkbox');
    offerCheckboxesElements.forEach((checkbox) => {
      checkbox.addEventListener('change', this.#offersChangeHandler);
    });
  }

  #initDatepickers() {
    const startDateInput = this.element.querySelector('[data-date-type="start"]');
    const endDateInput = this.element.querySelector('[data-date-type="end"]');

    if (!startDateInput || !endDateInput) {
      return;
    }

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
    }
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
    }

    this.#datepickerStart = flatpickr(startDateInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom,
      onChange: this.#startDateChangeHandler
    });

    this.#datepickerEnd = flatpickr(endDateInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateTo,
      onChange: this.#endDateChangeHandler
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    if (this._callback.formSubmit) {
      this._callback.formSubmit();
    }
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    if (this._callback.rollupClick) {
      this._callback.rollupClick();
    }
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    if (this._callback.deleteClick) {
      this._callback.deleteClick();
    }
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const newType = evt.target.value;
    const newOffers = (this._state.allOffers && this._state.allOffers[newType]) ? this._state.allOffers[newType] : [];

    this.updateState({
      type: newType,
      offers: newOffers.filter((offer) => offer.accepted)
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destinationName = evt.target.value;
    const newDestination = this.#destinations.find((dest) => dest.name === destinationName);

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
      const allCurrentOffers = (this._state.allOffers && this._state.allOffers[this._state.type]) ? this._state.allOffers[this._state.type] : [];
      const newOffer = allCurrentOffers.find((offer) => offer.id === offerId);
      if (newOffer) {
        currentOffers.push({ ...newOffer, accepted: true });
      }
    } else {
      currentOffers.splice(offerIndex, 1);
    }

    this.updateState({
      offers: currentOffers
    });
  };

  #startDateChangeHandler = ([userDate]) => {
    if (userDate) {
      this.updateState({
        dateFrom: userDate.toISOString()
      });
    }
  };

  #endDateChangeHandler = ([userDate]) => {
    if (userDate) {
      this.updateState({
        dateTo: userDate.toISOString()
      });
    }
  };
}
