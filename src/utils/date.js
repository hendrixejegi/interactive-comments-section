import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export function getDate() {
  const newDate = new Date();
  const day = dayjs(newDate).format('YYYY-MM-DD');
  return day;
}

export function showRelativeDate(date) {
  dayjs.extend(relativeTime);

  if (!dayjs(date).isValid()) {
    return date
  }

  const newDate = new Date();
  const day = dayjs(newDate).format('YYYY-MM-DD');
  return dayjs(day).fromNow();
}