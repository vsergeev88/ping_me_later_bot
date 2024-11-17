
export type Reminder = {
  id: number;
  chat_id: number;
  message_text: string;
  reminder_time: string;
}

export type UserData = {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  dialogMessages?: number[];
  remindMessageText?: string;
  remindMessageId?: number;
}