import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export function getDate() {
  return dayjs();
}

export function showRelativeDate(date) {
  dayjs.extend(relativeTime);

  if (!dayjs(date).isValid()) {
    return date
  }

  return dayjs(date).fromNow();
}