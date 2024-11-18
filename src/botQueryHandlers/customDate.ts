import { BaseQueryHandler } from "../types";
import { CALLBACK_ACTIONS } from "../enums";
import { createDayButtons, createHourButtons, createMinuteButtons, createMonthButtons } from "../utils/createButtons";
import { handleQueryError } from "../utils/errorHandlers";
import { getHumanDate } from "../helpers";
import { sendConfirmMessage } from "../utils/botMessages";
import * as DB from '../database';
import { userDataManager } from '../userDataManager';
import { deleteDialogMessages } from "../utils/deleteDialogMessages";

type CustomDateQueryHandlerArgs = BaseQueryHandler & {action: string, messageId: number}

export const customDateQueryHandler = async ({bot, query, chatId, messageId, action, value, locale}: CustomDateQueryHandlerArgs): Promise<void> => {
  const userData = userDataManager.getUserData(chatId);

  // console.log('query', query);

  if (action === CALLBACK_ACTIONS.YEAR) {
    const year = parseInt(value);
    userDataManager.setUserData(chatId,{
      year,
      dialogMessages: [...userData.dialogMessages ?? [], messageId]
    })
    bot.sendMessage(chatId, 'Select a month:', {
      reply_markup: {
        inline_keyboard: createMonthButtons(year),
      },
    });
  }

  if (action === CALLBACK_ACTIONS.MONTH) {
    const month = parseInt(value);
    userDataManager.setUserData(chatId, {
      month,
      dialogMessages: [...userData.dialogMessages ?? [], messageId]
    })
    if (!userData.year) {
      return handleQueryError(bot, query, 'Year missing');
    }
    bot.sendMessage(chatId, 'Select a day:', {
      reply_markup: {
        inline_keyboard: createDayButtons(month, userData.year),
      },
    });
  }

  if (action === CALLBACK_ACTIONS.DAY) {
    const day = parseInt(value);
    userDataManager.setUserData(chatId, {
      day,
      dialogMessages: [...userData.dialogMessages ?? [], messageId]
    })
    bot.sendMessage(chatId, 'Select hour:', {
      reply_markup: {
        inline_keyboard: createHourButtons(),
      },
    });
  }

  if (action === CALLBACK_ACTIONS.HOUR) {
    const hour = parseInt(value);
    userDataManager.setUserData(chatId, {hour, dialogMessages: [...userData.dialogMessages ?? [], messageId]});

    bot.sendMessage(chatId, 'Select minute:', {
      reply_markup: {
        inline_keyboard: createMinuteButtons(),
      },
    });
  }

  if (action === CALLBACK_ACTIONS.MINUTE) {
    const minute = parseInt(value);
    userDataManager.setUserData(chatId, {
      minute, dialogMessages: [...userData.dialogMessages ?? [], messageId]
    })

    if (!userData.year || !userData.month || !userData.day || userData.hour === undefined) {
      return handleQueryError(bot, query, 'Date or time missing');
    }

    const selectedDate = new Date(userData.year, userData.month - 1, userData.day, userData.hour, minute);

    console.log('>>>> query.message!.date', getHumanDate(new Date(query.message!.date), locale))

    if (!userData.remindMessageText) {
      return handleQueryError(bot, query, 'remindMessageText missing');
    }

    DB.addReminder(chatId, userData.remindMessageText, selectedDate.getTime());

    await sendConfirmMessage({bot, chatId, selectedDate, remindMessageId: userData.remindMessageId, locale});
    await deleteDialogMessages(bot, chatId);
    userDataManager.deleteUserData(chatId)
  }
}

