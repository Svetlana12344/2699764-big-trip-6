import { ALL_OFFER_TYPES } from '../const.js';
import { getRandomInt, generateId } from '../utils/common-utils.js';

const OfferPrice = {
  LUGGAGE: 30,
  COMFORT: 100,
  MEAL: 15,
  SEATS: 5,
  TRAIN: 40
};

const OfferTitle = {
  LUGGAGE: 'Add luggage',
  COMFORT: 'Switch to comfort class',
  MEAL: 'Add meal',
  SEATS: 'Choose seats',
  TRAIN: 'Travel by train'
};

const RANDOM_SORT_BIAS = 0.5;
const DEFAULT_OFFERS_MIN_COUNT = 1;
const DEFAULT_OFFERS_MAX_COUNT = 3;

const generateOffer = (type) => {
  const upperCaseType = type.toUpperCase();
  return {
    id: generateId(),
    title: OfferTitle[upperCaseType],
    price: OfferPrice[upperCaseType],
    type: type,
    accepted: Math.random() > RANDOM_SORT_BIAS
  };
};

const generateOffers = (count = getRandomInt(DEFAULT_OFFERS_MIN_COUNT, DEFAULT_OFFERS_MAX_COUNT)) => {
  const shuffledTypes = [...ALL_OFFER_TYPES].sort(() => RANDOM_SORT_BIAS - Math.random());
  const selectedTypes = shuffledTypes.slice(0, count);
  return selectedTypes.map((type) => generateOffer(type));
};

export { generateOffer, generateOffers };
