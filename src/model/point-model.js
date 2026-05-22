export default class PointsModel {
  #points = [];
  #api = null;
  #observers = [];

  constructor(api) {
    this.#api = api;
  }

  async init() {
    try {
      const points = await this.#api.getPoints();
      this.#points = points.map(adaptPointToClient);
    } catch (error) {
      this.#points = [];
    }
    this.#notifyObservers();
  }

  getPoints() {
    return this.#points;
  }

  async updatePoint(updatedPoint) {
    try {
      const response = await this.#api.updatePoint(updatedPoint);
      const adaptedPoint = adaptPointToClient(response);
      const index = this.#points.findIndex((point) => point.id === adaptedPoint.id);
      if (index !== -1) {
        this.#points[index] = adaptedPoint;
      }
      this.#notifyObservers();
    } catch (error) {
      throw new Error('Не удалось обновить точку');
    }
  }

  async addPoint(point) {
    try {
      const response = await this.#api.addPoint(point);
      const adaptedPoint = adaptPointToClient(response);
      this.#points = [adaptedPoint, ...this.#points];
      this.#notifyObservers();
    } catch (error) {
      throw new Error('Не удалось добавить точку');
    }
  }

  async deletePoint(pointId) {
    try {
      await this.#api.deletePoint(pointId);
      const index = this.#points.findIndex((point) => point.id === pointId);
      if (index !== -1) {
        this.#points.splice(index, 1);
      }
      this.#notifyObservers();
    } catch (error) {
      throw new Error('Не удалось удалить точку');
    }
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers() {
    this.#observers.forEach((observer) => observer());
  }
}