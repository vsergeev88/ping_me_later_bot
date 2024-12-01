import { BaseQueryHandler } from "../types";
import * as DB from '../database';
import { handleQueryError } from "../utils/errorHandlers";

export const setTimezone = async ({bot, query, chatId, value, locale}: BaseQueryHandler): Promise<void> => {
  try {
    await DB.setTimeZone(chatId, parseInt(value), "");
    if (query.message?.message_id) {
      bot.deleteMessage(chatId, query.message?.message_id);
    }
  } catch (error) {
    console.log("setTimezone error", error)
    return handleQueryError(bot, query, 'Something went wrong');
  }
  bot.sendMessage(chatId, `Your timezone set`);
}