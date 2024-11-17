import type TelegramBot from "node-telegram-bot-api";
import { BOT_COMMANDS, WELCOME_STICKER } from "../constants";
import * as BOT_MESSAGES from '../botMessages';

export const start = async (bot: TelegramBot, chatId: number) => {
  await bot.setMyCommands(BOT_COMMANDS)
  await bot.sendSticker(chatId, WELCOME_STICKER);
  return bot.sendMessage(chatId, BOT_MESSAGES.WELCOME_MESSAGE);
}