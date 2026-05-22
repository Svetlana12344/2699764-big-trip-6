export const adaptPointToClient = (point) => {
  const adaptedPoint = {
    ...point,
    basePrice: point.base_price,
    dateFrom: point.date_from,
    dateTo: point.date_to,
    isFavorite: point.is_favorite,
  };

  delete adaptedPoint.base_price;
  delete adaptedPoint.date_from;
  delete adaptedPoint.date_to;
  delete adaptedPoint.is_favorite;

  return adaptedPoint;
};

export const adaptDestinationToClient = (destination) => {
  return {
    ...destination,
  };
};

export const adaptOfferToClient = (offer) => {
  return {
    ...offer,
  };
};

export const adaptOffersToClient = (offers) => {
  const adaptedOffers = {};
  offers.forEach((offerGroup) => {
    adaptedOffers[offerGroup.type] = offerGroup.offers.map((offer) => ({
      ...offer,
      accepted: false,
    }));
  });
  return adaptedOffers;
};