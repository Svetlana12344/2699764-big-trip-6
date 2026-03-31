function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomSubarray(array, maxLength) {
  const length = getRandomInt(1, Math.min(maxLength, array.length));
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, length);
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function generateDate() {
  const now = new Date();
  const futureDate = new Date(now.getTime() + getRandomInt(0, 30) * 24 * 60 * 60 * 1000);
  return futureDate.toISOString();
}

export { getRandomInt, getRandomArrayItem, getRandomSubarray, generateId, generateDate };
