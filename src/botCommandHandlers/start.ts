import type TelegramBot from "node-telegram-bot-api";
import { BOT_COMMANDS, WELCOME_STICKER } from "../constants";

export const start = async (bot: TelegramBot, chatId: number) => {
  await bot.setMyCommands(BOT_COMMANDS)
  await bot.sendSticker(chatId, WELCOME_STICKER);
  return bot.sendMessage(chatId, 'Hello, I am a reminder bot! To add a reminder, send me something or forward a message from another chat');
}