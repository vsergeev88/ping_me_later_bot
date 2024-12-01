import type TelegramBot from "node-telegram-bot-api";
import { handleQueryError } from "../utils/errorHandlers";
import { BaseQueryHandler } from "../types";
import { REMINDER_TYPES } from "../enums";
import { getNextMondayAt9AM, getTomorrowAt9AM } from "../utils/getDateTime";
import { sendConfirmMessage } from "../utils/botMessages";
import { createYearButtons } from "../utils/createButtons";
import * as DB from '../database';
import { userDataManager } from '../userDataManager';

export const addReminderQueryHandler = async ({bot, query, chatId, value, locale}: BaseQueryHandler) => {
  const messageId = query.message?.message_id
  const remindMessageText = query.message?.reply_to_message?.text
  const remindMessageId = query.message?.reply_to_message?.message_id

  if (!remindMessageText || !messageId) {
    return handleQueryError(bot, query, 'remindMessageId text missing');
  }

  const setReminder = async (time: number) => {
    DB.addReminder(chatId, remindMessageText, time);
  }

  switch (value) {
    case REMINDER_TYPES.TOMORROW_MORNING:
      const tomorrowMorning = await getTomorrowAt9AM(chatId)
      setReminder(tomorrowMorning);
      await sendConfirmMessage({bot, chatId, selectedDate: new Date(tomorrowMorning), remindMessageId, locale});
      bot.deleteMessage(chatId, messageId);
      break
    case REMINDER_TYPES.MONDAY_MORNING:
      const mondayMorning = await getNextMondayAt9AM(chatId)
      setReminder(mondayMorning);
      await sendConfirmMessage({bot, chatId, selectedDate: new Date(mondayMorning), remindMessageId, locale});
      bot.deleteMessage(chatId, messageId);
      break
    case REMINDER_TYPES.CUSTOM:
      userDataManager.setUserData(chatId, {
        remindMessageText,
        remindMessageId,
        dialogMessages: [messageId]
      })

      bot.sendMessage(chatId, 'Select a year:', {
        reply_markup: {
          inline_keyboard: [createYearButtons()],
        },
      });
      break
  }
}
