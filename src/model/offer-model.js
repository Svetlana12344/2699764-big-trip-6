import { adaptOffersToClient } from '../utils/adapter-utils.js';

export default class OffersModel {
  #offers = [];
  #api = null;

  constructor(api) {
    this.#api = api;
  }

  async init() {
    try {
      const offers = await this.#api.getOffers();
      this.#offers = adaptOffersToClient(offers);
    } catch (error) {
      this.#offers = [];
    }
  }

  getOffers() {
    return this.#offers;
  }

  getOffersByType(type) {
    return this.#offers[type] || [];
  }
}
