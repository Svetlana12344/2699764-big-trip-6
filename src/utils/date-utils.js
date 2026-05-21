import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

export const formatDate = (date, format = 'DD/MM/YY HH:mm') => dayjs(date).format(format);

export const formatShortDate = (date) => dayjs(date).format('MMM DD').toUpperCase();

export const formatTime = (date) => dayjs(date).format('HH:mm');

export const formatDuration = (dateFrom, dateTo) => {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));
  const durationObj = dayjs.duration(diff);

  const days = Math.floor(durationObj.asDays());
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();

  if (days > 0) {
    return `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }
  return `${minutes}M`;
};

export const isDateEqual = (dateA, dateB) => dayjs(dateA).isSame(dateB, 'minute');
