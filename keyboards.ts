import { ADD_REMINDER_TYPES } from "./enums";

export const REMINDER_KEYBOARD = [
  [
    {
      text: 'Tomorrow 9:00 AM',
      callback_data: ADD_REMINDER_TYPES.TOMORROW_MORNING
    }
  ],
  [
    {
      text: 'Monday 9:00 AM',
      callback_data: ADD_REMINDER_TYPES.MONDAY_MORNING
    }
  ],
  [
    {
      text: 'Custom time',
      callback_data: ADD_REMINDER_TYPES.CUSTOM_TIME
    }
  ]
]