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

function generateOffer() {
  const type = getRandomArrayItem(OFFER_TYPES);
  return {
    id: generateId(),
    title: OFFER_TITLES[type],
    price: OFFER_PRICES[type],
    type: type,
    accepted: Math.random() > 0.5
  };
}

function generateOffers(count = getRandomInt(1, 5)) {
  return Array.from({ length: count }, generateOffer);
}

export { generateOffer, generateOffers };