import { BaseQueryHandler } from "../types";
import { handleQueryError } from "../utils/errorHandlers";
import { deleteReminder } from "../database";

export const deleteReminderAction = async ({bot, query, chatId, value, locale}: BaseQueryHandler): Promise<void> => {
  try {
    await deleteReminder(parseInt(value));
    if (query.message?.message_id) {
      await bot.deleteMessage(chatId, query.message?.message_id);
    }
  } catch (error) {
    console.log("setTimezone error", error)
    return handleQueryError(bot, query, 'Something went wrong');
  }
}