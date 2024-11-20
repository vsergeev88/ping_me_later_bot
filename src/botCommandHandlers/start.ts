import type TelegramBot from "node-telegram-bot-api";
import { BOT_COMMANDS, WELCOME_STICKER } from "../constants";

export const start = async (bot: TelegramBot, chatId: number, locale = 'en') => {
  await bot.setMyCommands(BOT_COMMANDS)
  await bot.sendSticker(chatId, WELCOME_STICKER);
  await bot.sendMessage(chatId, '👋 Hello, I am a reminder bot! To add a reminder, send me something or forward a message from another chat');
  return bot.sendMessage(chatId, 'Пожалуйста, поделитесь своим местоположением, чтобы определить ваш часовой пояс.', {
    reply_markup: {
        keyboard: [[{ text: 'Отправить местоположение', request_location: true }]],
        one_time_keyboard: true,
    },
});
}