import { ALL_DESTINATIONS } from '../const.js';
import { getRandomArrayItem, generateId } from '../utils/common-utils.js';

const DEFAULT_DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.';
const DEFAULT_PHOTO_DESCRIPTION = 'Event photo';
const DEFAULT_PHOTOS_COUNT = 3;

const getRandomPhotos = (count = DEFAULT_PHOTOS_COUNT) => Array.from({ length: count }, (_, index) => ({
  src: `https://loremflickr.com/248/152?random=${index}`,
  description: DEFAULT_PHOTO_DESCRIPTION
}));

const generateDestination = () => {
  const city = getRandomArrayItem(ALL_DESTINATIONS);
  return {
    id: generateId(),
    name: city,
    description: DEFAULT_DESCRIPTION,
    pictures: getRandomPhotos()
  };
};

const generateDestinations = () => ALL_DESTINATIONS.map(() => generateDestination());

export { generateDestination, generateDestinations };

