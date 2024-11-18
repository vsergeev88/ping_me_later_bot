import type TelegramBot from "node-telegram-bot-api";
import { handleQueryError } from "../utils/errorHandlers";
import { BaseQueryHandler } from "../types";
import { REMINDER_TYPES } from "../enums";
import { getNextMondayAt9AM, getTomorrowAt9AM } from "../utils/getDateTime";
import { sendConfirmMessage } from "../utils/botMessages";
import { createYearButtons } from "../utils/createButtons";
import * as DB from '../database';
import { userDataManager } from '../userDataManager';

export const addReminderQueryHandler = async ({bot, query, chatId, value}: BaseQueryHandler) => {
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
      setReminder(getTomorrowAt9AM());
      await sendConfirmMessage(bot, chatId, new Date(getTomorrowAt9AM()), remindMessageId);
      bot.deleteMessage(chatId, messageId);
      break
    case REMINDER_TYPES.MONDAY_MORNING:
      setReminder(getNextMondayAt9AM());
      await sendConfirmMessage(bot, chatId, new Date(getNextMondayAt9AM()), remindMessageId);
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
