import dayjs from 'dayjs';

export const formatRoute = (points, destinations) => {
  const uniqueDestinations = [...new Set(points.map((point) => {
    const destination = destinations.find((dest) => dest.id === point.destination);
    return destination ? destination.name : '';
  }).filter(Boolean))];

  if (uniqueDestinations.length === 0) {
    return '';
  }

  if (uniqueDestinations.length <= 3) {
    return uniqueDestinations.join(' &mdash; ');
  }

  return `${uniqueDestinations[0]} &mdash; ... &mdash; ${uniqueDestinations[uniqueDestinations.length - 1]}`;
};

export const formatDates = (points) => {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const startDate = dayjs(sortedPoints[0].dateFrom);
  const endDate = dayjs(sortedPoints[sortedPoints.length - 1].dateTo);

  const startFormat = startDate.format('MMM D').toUpperCase();
  const endFormat = endDate.format('MMM D').toUpperCase();

  if (startDate.isSame(endDate, 'month')) {
    return `${startDate.format('MMM D')} &mdash; ${endDate.format('D')}`.toUpperCase();
  }

  return `${startFormat} &mdash; ${endFormat}`;
};

export const calculateTotalPrice = (points, offersModel) => {
  let total = 0;

  points.forEach((point) => {
    total += point.basePrice;

    const pointOffers = point.offers || [];
    pointOffers.forEach((offer) => {
      const allOffers = offersModel.getOffersByType(point.type);
      const offerData = allOffers.find((o) => o.id === offer.id);
      if (offerData) {
        total += offerData.price;
      }
    });
  });

  return total;
};
