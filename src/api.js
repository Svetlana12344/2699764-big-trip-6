const SERVER_URL = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTH_CREDENTIALS = 'Basic bigtrip123456789';

export default class Api {
  #endPoint = SERVER_URL;
  #authorization = AUTH_CREDENTIALS;

  #load(url, options = {}) {
    return fetch(`${this.#endPoint}/${url}`, {
      ...options,
      headers: {
        'Authorization': this.#authorization,
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
    return this.#load('points');
  }

  getDestinations() {
    return this.#load('destinations');
  }

  getOffers() {
    return this.#load('offers');
  }

  updatePoint(point) {
    return this.#load(`points/${point.id}`, {
      method: 'PUT',
      body: JSON.stringify(this.#serializeToServer(point)),
    });
  }

  addPoint(point) {
    return this.#load('points', {
      method: 'POST',
      body: JSON.stringify(this.#serializeToServer(point)),
    });
  }

  deletePoint(pointId) {
    return this.#load(`points/${pointId}`, {
      method: 'DELETE',
    });
  }

  #serializeToServer(point) {
    const serializedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite,
    };

    delete serializedPoint.basePrice;
    delete serializedPoint.dateFrom;
    delete serializedPoint.dateTo;
    delete serializedPoint.isFavorite;
    delete serializedPoint.destination;

    return serializedPoint;
  }
}
