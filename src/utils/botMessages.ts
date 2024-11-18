import type TelegramBot from "node-telegram-bot-api";
import { getHumanDate } from "../helpers";

export const sendConfirmMessage = async ({bot, chatId, selectedDate, remindMessageId, locale}: {bot: TelegramBot, chatId: number, selectedDate: Date, remindMessageId?: number, locale?: string}) => {
  return await bot.sendMessage(chatId, `Reminder set for ${getHumanDate(selectedDate, locale)}`, {reply_to_message_id: remindMessageId});
}