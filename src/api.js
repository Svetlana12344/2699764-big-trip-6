import ApiService from './framework/api-service.js';

const HttpMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class TravelApi extends ApiService {
  get points() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' }).then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(this.#toServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return ApiService.parseResponse(response);
  }

  async addPoint(point) {
    const adapted = this.#toServer(point);
    const response = await this._load({
      url: 'points',
      method: HttpMethod.POST,
      body: JSON.stringify(adapted),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return ApiService.parseResponse(response);
  }

  async deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: HttpMethod.DELETE,
    });
  }

  #toServer(point) {
    const adapted = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateEnd,
      'is_favorite': point.isFavorite,
    };
    delete adapted.basePrice;
    delete adapted.dateFrom;
    delete adapted.dateEnd;
    delete adapted.isFavorite;
    if (!adapted.id) {
      delete adapted.id;
    }
    return adapted;
  }
}
