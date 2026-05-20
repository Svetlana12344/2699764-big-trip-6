export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

export const sortPointsByDay = (pointA, pointB) => new Date(pointA.dateFrom) - new Date(pointB.dateFrom);

export const sortPointsByTime = (pointA, pointB) => {
  const durationA = new Date(pointA.dateTo) - new Date(pointA.dateFrom);
  const durationB = new Date(pointB.dateTo) - new Date(pointB.dateFrom);
  return durationB - durationA;
};

export const sortPointsByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
