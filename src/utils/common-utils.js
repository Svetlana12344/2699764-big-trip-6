const RANDOM_SORT_BIAS = 0.5;
const ID_SUBSTRING_START = 2;
const ID_SUBSTRING_END = 9;
const MIN_DAYS_OFFSET = 0;
const MAX_DAYS_OFFSET = 30;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomArrayItem = (array) => array[Math.floor(Math.random() * array.length)];

const getRandomSubarray = (array, maxLength) => {
  const length = getRandomInt(1, Math.min(maxLength, array.length));
  const shuffled = [...array].sort(() => RANDOM_SORT_BIAS - Math.random());
  return shuffled.slice(0, length);
};

const generateId = () => Math.random().toString(36).substring(ID_SUBSTRING_START, ID_SUBSTRING_END);

const generateDate = () => {
  const now = new Date();
  const daysOffset = getRandomInt(MIN_DAYS_OFFSET, MAX_DAYS_OFFSET);
  const futureDate = new Date(now.getTime() + daysOffset * MILLISECONDS_PER_DAY);
  return futureDate.toISOString();
};

export { getRandomInt, getRandomArrayItem, getRandomSubarray, generateId, generateDate };
