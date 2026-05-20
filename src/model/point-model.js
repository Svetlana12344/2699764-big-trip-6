import { generatePoints } from '../mock/point-mock.js';

export default class PointsModel {
  #points = [];

  constructor() {
    this.#points = generatePoints(3);
  }

  getPoints() {
    return this.#points;
  }

  setPoints(points) {
    this.#points = points;
  }

  clearPoints() {
    this.#points = [];
  }
}
