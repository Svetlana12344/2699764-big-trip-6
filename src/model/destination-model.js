import { adaptDestinationToClient } from '../utils/adapter-utils.js';

export default class DestinationsModel {
  #destinations = [];
  #api = null;

  constructor(api) {
    this.#api = api;
  }

  async init() {
    try {
      const destinations = await this.#api.getDestinations();
      this.#destinations = destinations.map(adaptDestinationToClient);
    } catch (error) {
      this.#destinations = [];
    }
  }

  getDestinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  getDestinationByName(name) {
    return this.#destinations.find((destination) => destination.name === name);
  }
}
