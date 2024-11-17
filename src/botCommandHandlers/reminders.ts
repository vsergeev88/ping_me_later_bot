import type TelegramBot from "node-telegram-bot-api";
import { showActiveReminders } from "../utils/showActiveReminders";

export const reminders = async (bot: TelegramBot, chatId: number) => {
  showActiveReminders(bot, chatId);
}