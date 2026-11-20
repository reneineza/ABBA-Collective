// Dates are shown day-month-year in Rwanda time (CAT), regardless of the
// server's or visitor's time zone.

export function formatDate(value, month = 'long') {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month,
    year: 'numeric',
    timeZone: 'Africa/Kigali',
  });
}
