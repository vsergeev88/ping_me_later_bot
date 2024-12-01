import type TelegramBot from "node-telegram-bot-api";
import { createTimeZonesButtons } from "../utils/createButtons";

export const timeZone = async (bot: TelegramBot, chatId: number, locale = 'en') => {
  return bot.sendMessage(chatId, 'Choose your timezone', {
    reply_markup: {
      inline_keyboard: createTimeZonesButtons(),
    }
  });
}