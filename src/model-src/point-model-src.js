import { generatePoints } from '../mock/point.js';

export default class PointsModel {
  #points = [];

  constructor() {
    this.#points = generatePoints(3); 
  }

  getPoints() {
    return this.#points;
  }
}