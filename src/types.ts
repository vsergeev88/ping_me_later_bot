import type TelegramBot from "node-telegram-bot-api";

export type Reminder = {
  id: number;
  chat_id: number;
  message_text: string;
  reminder_time: string;
}

export type BaseQueryHandler = {
  bot: TelegramBot
  query: TelegramBot.CallbackQuery
  chatId: number
  value: string
  locale?: string
}