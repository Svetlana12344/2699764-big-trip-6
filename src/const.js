export const PointType = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant'
};

export const Destination = {
  AMSTERDAM: 'Amsterdam',
  GENEVA: 'Geneva',
  CHAMONIX: 'Chamonix',
  PARIS: 'Paris',
  LONDON: 'London',
  BERLIN: 'Berlin',
  ROME: 'Rome',
  BARCELONA: 'Barcelona'
};

export const OfferType = {
  LUGGAGE: 'luggage',
  COMFORT: 'comfort',
  MEAL: 'meal',
  SEATS: 'seats',
  TRAIN: 'train'
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export const UserAction = {
  UPDATE_POINT: 'update_point',
  ADD_POINT: 'add_point',
  DELETE_POINT: 'delete_point'
};

export const UpdateType = {
  PATCH: 'patch',
  MINOR: 'minor',
  MAJOR: 'major'
};

export const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export const ALL_TYPES = Object.values(PointType);
export const ALL_DESTINATIONS = Object.values(Destination);
export const ALL_OFFER_TYPES = Object.values(OfferType);
