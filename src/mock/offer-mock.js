import { OFFER_TYPES } from '../const.js';
import { getRandomInt, getRandomArrayItem, generateId } from '../utils/common-utils.js';

const OFFER_PRICES = {
  luggage: 30,
  comfort: 100,
  meal: 15,
  seats: 5,
  train: 40
};

const OFFER_TITLES = {
  luggage: 'Add luggage',
  comfort: 'Switch to comfort class',
  meal: 'Add meal',
  seats: 'Choose seats',
  train: 'Travel by train'
};

function generateOffer(type) {
  return {
    id: generateId(),
    title: OFFER_TITLES[type],
    price: OFFER_PRICES[type],
    type: type,
    accepted: Math.random() > 0.5
  };
}

function generateOffers(count = getRandomInt(1, 3)) {
  const shuffledTypes = [...OFFER_TYPES].sort(() => 0.5 - Math.random());
  const selectedTypes = shuffledTypes.slice(0, count);
  return selectedTypes.map((type) => generateOffer(type));
}

export { generateOffer, generateOffers };
