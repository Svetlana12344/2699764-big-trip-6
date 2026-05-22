import { generatePoints } from '../mock/point-mock.js';

export default class PointsModel {
  #points = [];
  #observers = [];

  constructor() {
    this.#points = generatePoints(3);
  }

  getPoints() {
    return this.#points;
  }

  setPoints(points) {
    this.#points = points;
    this.#notifyObservers();
  }

  updatePoint(updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);
    if (index !== -1) {
      this.#points[index] = updatedPoint;
      this.#notifyObservers();
    }
  }

  addPoint(point) {
    this.#points = [point, ...this.#points];
    this.#notifyObservers();
  }

  deletePoint(pointId) {
    const index = this.#points.findIndex((point) => point.id === pointId);
    if (index !== -1) {
      this.#points.splice(index, 1);
      this.#notifyObservers();
    }
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers() {
    this.#observers.forEach((observer) => observer());
  }
}
