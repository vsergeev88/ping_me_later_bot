

export enum DATE {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day'
}

export enum CALLBACK_ACTIONS {
  YEAR = DATE.YEAR,
  MONTH = DATE.MONTH,
  DAY = DATE.DAY,
  ADD = 'add',
}

export enum COMMANDS {
  START = '/start',
  REMINDERS = '/reminders',
  // UPDATE_REMINDER = '/updatereminder'
}

export enum REMINDER_TYPES {
  TOMORROW_MORNING = 'tomorrowMorning',
  MONDAY_MORNING = 'mondayMorning',
  CUSTOM = 'custom'
}

export enum ADD_REMINDER_TYPES {
  TOMORROW_MORNING = `${CALLBACK_ACTIONS.ADD}_${REMINDER_TYPES.TOMORROW_MORNING}`,
  MONDAY_MORNING = `${CALLBACK_ACTIONS.ADD}_${REMINDER_TYPES.MONDAY_MORNING}`,
  CUSTOM_TIME = `${CALLBACK_ACTIONS.ADD}_${REMINDER_TYPES.CUSTOM}`,
}