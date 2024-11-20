import { MONTH_NAMES } from "../constants";
import { ADD_REMINDER_TYPES, CALLBACK_ACTIONS, DATE } from "../enums";
import { chunkArray } from "../helpers";

export const createAddReminderButtons = () => {
  return chunkArray([{
    text: 'Tomorrow 9:00 AM',
    callback_data: ADD_REMINDER_TYPES.TOMORROW_MORNING
  }, {
    text: 'Monday 9:00 AM',
    callback_data: ADD_REMINDER_TYPES.MONDAY_MORNING
  }, {
    text: 'Custom time',
    callback_data: ADD_REMINDER_TYPES.CUSTOM_TIME
  }], 1)
}

export function createYearButtons() {
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i < currentYear + 2; i++) {
    years.push(i);
  }

  return years.map(year => ({
    text: `${year}`,
    callback_data: `${CALLBACK_ACTIONS.YEAR}_${year}`
  }));
}

export function createMonthButtons(year: number) {
  const months = Array.from({ length: 12 }, (_, index) => ({
    text: MONTH_NAMES[index],
    callback_data: `${CALLBACK_ACTIONS.MONTH}_${index + 1}`
  }));

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  if (currentYear === year) {
    return chunkArray(months.slice(currentMonth), 4);
  }
  return chunkArray(months, 4);
}

export function createDayButtons(month: number, year: number) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => ({
    text: `${index + 1}`,
    callback_data: `${CALLBACK_ACTIONS.DAY}_${index + 1}`
  }));

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  if (currentYear === year && currentMonth === month) {
    return chunkArray(days.slice(currentDay - 1), 5);
  }

  return chunkArray(days, 5);
}

export function createHourButtons() {
  const hours = Array.from({ length: 24 }, (_, index) => ({
    text: index.toString().padStart(2, '0'),
    callback_data: `${CALLBACK_ACTIONS.HOUR}_${index}`
  }));

  return chunkArray(hours, 6);
}

export function createMinuteButtons() {
  const hours = Array.from({ length: 12 }, (_, index) => ({
    text: (index * 5).toString().padStart(2, '0'),
    callback_data: `${CALLBACK_ACTIONS.MINUTE}_${index * 5}`
  }));

  return chunkArray(hours, 4);
}