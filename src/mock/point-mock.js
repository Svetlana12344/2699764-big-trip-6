import { TYPES } from '../const.js';
import { getRandomInt, getRandomArrayItem, generateId, generateDate } from '../utils/common-utils.js';
import { generateOffers } from './offer-mock.js';
import { generateDestinations } from './destination-mock.js';

function generatePoint() {
  const type = getRandomArrayItem(TYPES);
  const destinations = generateDestinations();
  const destination = getRandomArrayItem(destinations);
  const offers = generateOffers();
  const startDate = generateDate();
  const endDate = new Date(new Date(startDate).getTime() + getRandomInt(1, 5) * 60 * 60 * 1000).toISOString();

  return {
    id: generateId(),
    type: type,
    destination: destination,
    basePrice: getRandomInt(10, 500),
    dateFrom: startDate,
    dateTo: endDate,
    offers: offers,
    isFavorite: Math.random() > 0.5
  };
}

function generatePoints(count = 3) {
  return Array.from({ length: count }, generatePoint);
}

export { generatePoint, generatePoints };
