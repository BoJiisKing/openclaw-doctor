export function filterCheckinsByDays(checkins = [], days = 7) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return checkins.filter(item => new Date(item.createdAt).getTime() >= cutoff);
}
