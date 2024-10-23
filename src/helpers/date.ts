export function isExpiredDate(date: Date) {
  return Date.now() > date.getDate();
}
