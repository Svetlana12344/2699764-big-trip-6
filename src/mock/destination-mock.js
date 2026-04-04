import { DESTINATIONS } from '../const.js';
import { getRandomArrayItem, generateId } from '../utils/common-utils.js';

const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.';

function getRandomPhotos(count = 3) {
  return Array.from({ length: count }, (_, index) => ({
    src: `https://loremflickr.com/248/152?random=${index}`,
    description: 'Event photo'
  }));
}

function generateDestination() {
  const city = getRandomArrayItem(DESTINATIONS);
  return {
    id: generateId(),
    name: city,
    description: DESCRIPTION,
    pictures: getRandomPhotos()
  };
}

function generateDestinations() {
  return DESTINATIONS.map(() => generateDestination());
}

export { generateDestination, generateDestinations };

