export function getTomorrowAt9AM(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  return tomorrow.getTime();
}

export function getNextMondayAt9AM(): number {
  const now = new Date();
  const dayOfWeek = now.getDay();

  const daysUntilMonday = (7 - dayOfWeek + 1) % 7 || 7;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(9, 0, 0, 0);

  return nextMonday.getTime();
}
