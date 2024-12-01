import * as DB from '../database';

export const correctTimezone = async (chatId: number, date: Date): Promise<Date> => {
  const serverTimeOffset = new Date().getTimezoneOffset() * 60;
  const chatTimeOffset = await DB.getTimeOffset(chatId) ?? 0;
  console.log({serverTimeOffset, chatTimeOffset});
  date.setSeconds(date.getSeconds() + serverTimeOffset + chatTimeOffset);
  return date;
}

export async function getTomorrowAt9AM(chatId: number): Promise<number> {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  const correctedTomorrow = await correctTimezone(chatId, tomorrow);
  return correctedTomorrow.getTime();
}

export async function getNextMondayAt9AM(chatId: number): Promise<number> {
  const now = new Date();
  const dayOfWeek = now.getDay();

  const daysUntilMonday = (7 - dayOfWeek + 1) % 7 || 7;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(9, 0, 0, 0);
  const correctedNextMonday = await correctTimezone(chatId, nextMonday);
  return correctedNextMonday.getTime();
}
