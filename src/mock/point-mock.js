import { ALL_TYPES } from '../const.js';
import { getRandomInt, getRandomArrayItem, generateId, generateDate } from '../utils/common-utils.js';
import { generateOffers } from './offer-mock.js';
import { generateDestinations } from './destination-mock.js';

const MIN_BASE_PRICE = 10;
const MAX_BASE_PRICE = 500;
const DEFAULT_POINTS_COUNT = 3;
const MIN_HOURS_OFFSET = 1;
const MAX_HOURS_OFFSET = 5;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const FAVORITE_PROBABILITY_THRESHOLD = 0.5;
const DEFAULT_OFFERS_MIN_COUNT = 1;
const DEFAULT_OFFERS_MAX_COUNT = 3;

const generatePoint = () => {
  const type = getRandomArrayItem(ALL_TYPES);
  const destinations = generateDestinations();
  const destination = getRandomArrayItem(destinations);
  const offers = generateOffers(getRandomInt(DEFAULT_OFFERS_MIN_COUNT, DEFAULT_OFFERS_MAX_COUNT));
  const startDate = generateDate();
  const endDate = new Date(
    new Date(startDate).getTime() + getRandomInt(MIN_HOURS_OFFSET, MAX_HOURS_OFFSET) * MILLISECONDS_PER_HOUR
  ).toISOString();

  return {
    id: generateId(),
    type: type,
    destination: destination,
    basePrice: getRandomInt(MIN_BASE_PRICE, MAX_BASE_PRICE),
    dateFrom: startDate,
    dateTo: endDate,
    offers: offers,
    isFavorite: Math.random() > FAVORITE_PROBABILITY_THRESHOLD
  };
};

const generatePoints = (count = DEFAULT_POINTS_COUNT) => Array.from({ length: count }, generatePoint);

export { generatePoint, generatePoints };
