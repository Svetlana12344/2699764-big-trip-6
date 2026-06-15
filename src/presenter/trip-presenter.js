import TripInfoView from '../view/trip-info-view.js';
import { render, replace, remove } from '../framework/render.js';
import { MAX_ROUTE_DESTINATIONS } from '../const.js';

export default class TripInfoPresenter {
  #container = null;
  #tripsModel = null;
  #infoComponent = null;

  constructor({ tripInfoContainer, pointsModel }) {  
    this.#container = tripInfoContainer;
    this.#tripsModel = pointsModel;
  }

  init() {
    if (this.#tripsModel && typeof this.#tripsModel.addObserver === 'function') {
      this.#tripsModel.addObserver(this.#handleModelUpdate);
    }
    this.#displayTripInfo();
  }

  #handleModelUpdate = () => {
    this.#displayTripInfo();
  };

  #displayTripInfo() {
    if (!this.#tripsModel || typeof this.#tripsModel.getPoints !== 'function') {
      return;
    }

    const trips = this.#tripsModel.getPoints();

    if (!trips || trips.length === 0) {
      if (this.#infoComponent) {
        remove(this.#infoComponent);
        this.#infoComponent = null;
      }
      return;
    }

    const routePath = this.#buildRoutePath(trips);
    const { startDate, endDate } = this.#extractDateRange(trips);
    const totalExpenses = this.#sumTotalExpenses(trips);

    const previousComponent = this.#infoComponent;

    this.#infoComponent = new TripInfoView({
      route: routePath,
      startDate,
      endDate,
      totalCost: totalExpenses,
    });

    if (previousComponent === null) {
      render(this.#infoComponent, this.#container, 'afterbegin');
      return;
    }

    replace(this.#infoComponent, previousComponent);
  }

  #buildRoutePath(trips) {
    const sortedTrips = [...trips].sort((first, second) =>
      new Date(first.dateFrom) - new Date(second.dateFrom)
    );

    const cityNames = sortedTrips.map((trip) => {
      const destinationInfo = this.#tripsModel.getDestinationById(trip.destination);
      return destinationInfo ? destinationInfo.name : '';
    }).filter(Boolean);

    const uniqueCities = cityNames.filter((city, position) =>
      cityNames.indexOf(city) === position
    );

    if (uniqueCities.length === 0) {
      return '';
    }

    if (uniqueCities.length <= MAX_ROUTE_DESTINATIONS) {
      return uniqueCities.join(' — ');
    }

    return `${uniqueCities[0]} — ... — ${uniqueCities[uniqueCities.length - 1]}`;
  }

  #extractDateRange(trips) {
    const sortedTrips = [...trips].sort((first, second) =>
      new Date(first.dateFrom) - new Date(second.dateFrom)
    );

    const tripStart = new Date(sortedTrips[0].dateFrom);
    const tripEnd = new Date(sortedTrips[sortedTrips.length - 1].dateEnd);

    return { startDate: tripStart, endDate: tripEnd };
  }

  #sumTotalExpenses(trips) {
    return trips.reduce((accumulator, currentTrip) => {
      let tripCost = currentTrip.basePrice;

      currentTrip.offers.forEach((offerId) => {
        const selectedOffer = this.#tripsModel.getOfferById(currentTrip.type, offerId);
        if (selectedOffer) {
          tripCost += selectedOffer.price;
        }
      });

      return accumulator + tripCost;
    }, 0);
  }
}