export default class Api {
  constructor() {
    this._endPoint = 'https://21.objects.pages.academy/big-trip';
    this._authorization = 'Basic bigtrip123456789';
  }

  _load(url, options = {}) {
    return fetch(`${this._endPoint}/${url}`, {
      ...options,
      headers: {
        'Authorization': this._authorization,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`Error: ${response.status}`);
      });
  }

  getPoints() {
    return this._load('points');
  }

  getDestinations() {
    return this._load('destinations');
  }

  getOffers() {
    return this._load('offers');
  }

  updatePoint(point) {
    return this._load(`points/${point.id}`, {
      method: 'PUT',
      body: JSON.stringify(this._adaptToServer(point)),
    });
  }

  addPoint(point) {
    return this._load('points', {
      method: 'POST',
      body: JSON.stringify(this._adaptToServer(point)),
    });
  }

  deletePoint(pointId) {
    return this._load(`points/${pointId}`, {
      method: 'DELETE',
    });
  }

  _adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.destination;

    return adaptedPoint;
  }
}
