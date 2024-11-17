import type TelegramBot from "node-telegram-bot-api";
import { getHumanDate } from "../helpers";

export const sendConfirmMessage = async (bot: TelegramBot, chatId: number, selectedDate: Date, remindMessageId?: number) => {
  return await bot.sendMessage(chatId, `Reminder set for ${getHumanDate(selectedDate)}`, {reply_to_message_id: remindMessageId});
}