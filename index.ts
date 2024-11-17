import TelegramBot from 'node-telegram-bot-api';
import * as DB from './database';
import * as dotenv from 'dotenv';
import { Reminder, UserData } from './types';
import { CALLBACK_ACTIONS, COMMANDS, DATE, REMINDER_TYPES } from './enums';
import { REMINDER_KEYBOARD } from './keyboards';
import { BOT_COMMANDS, WELCOME_STICKER } from './constants';
import * as BOT_MESSAGES from './botMessages';
import { getHumanDate } from './helpers';
import { getNextMondayAt9AM, getTomorrowAt9AM } from './utils/getDateTime';
import { createDayButtons, createHourButtons, createMinuteButtons, createMonthButtons, createYearButtons } from './utils/createButtons';
import { checkReminders } from './utils/checkReminders';

dotenv.config();


const userData: { [chatId: string]: UserData } = {};

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: true });

bot.on('message', async (msg) => {
  const {text, chat, message_id, from} = msg;
  switch (text) {
    case COMMANDS.START:
      await bot.setMyCommands(BOT_COMMANDS)
      await bot.sendSticker(chat.id, WELCOME_STICKER);
      return bot.sendMessage(chat.id, BOT_MESSAGES.WELCOME_MESSAGE);

      case COMMANDS.REMINDERS:
        const reminders = DB.getReminders(chat.id);
        if (reminders.length > 0) {
          reminders.forEach((reminder: Reminder) => {
            const date = new Date(reminder.reminder_time);

            const formattedMessageText = reminder.message_text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const reminderText = `<blockquote>${formattedMessageText}</blockquote>\n\nReminder set for <b>${getHumanDate(date)}</b>`;

            bot.sendMessage(chat.id, reminderText, { parse_mode: 'HTML' });
          });
        } else {
          bot.sendMessage(chat.id, 'You have no reminders.');
        }
        return

    default:
      return bot.sendMessage(chat.id, BOT_MESSAGES.ADD_REMINDER_MESSAGE,
        {
          reply_markup: {
            inline_keyboard: REMINDER_KEYBOARD,
          },
          reply_to_message_id: message_id
        });
  }
});

const handleQueryError = (query: TelegramBot.CallbackQuery, errorMessage = 'Something went wrong') => {
  bot.answerCallbackQuery(query.id, {
    text: errorMessage,
    show_alert: true,
  });
}

const sendConfirmMessage = async (chatId: number, selectedDate: Date, remindMessageId?: number) => {
  return await bot.sendMessage(chatId, `Reminder set for ${getHumanDate(selectedDate)}`, {reply_to_message_id: remindMessageId});
}

bot.on('callback_query', async (query) => {
  const chatId = query.message?.chat.id;
  const messageId = query.message?.message_id
  const data = query.data;
  if (!chatId || !messageId || !data) return handleQueryError(query);

  const [action, value] = data.split('_');

  if (action === CALLBACK_ACTIONS.ADD) {
    const remindMessageText = query.message?.reply_to_message?.text
    const remindMessageId = query.message?.reply_to_message?.message_id

    if (!remindMessageText) {
      return handleQueryError(query, 'remindMessageId text missing');
    }

    const setReminder = async (time: number) => {
      DB.addReminder(chatId, remindMessageText, time);
    }

    switch (value) {
      case REMINDER_TYPES.TOMORROW_MORNING:
        setReminder(getTomorrowAt9AM());
        await bot.answerCallbackQuery(query.id, {
          text: "Ok! I'll ping you at tomorrow 9:00 am!",
          show_alert: true,
          });
        await sendConfirmMessage(chatId, new Date(getTomorrowAt9AM()), remindMessageId);
        bot.deleteMessage(chatId, messageId);
        break
      case REMINDER_TYPES.MONDAY_MORNING:
        setReminder(getNextMondayAt9AM());
        await bot.answerCallbackQuery(query.id, {
          text: "Ok! I'll ping you at next Monday 9:00 am!",
          show_alert: true,
          });
        await sendConfirmMessage(chatId, new Date(getNextMondayAt9AM()), remindMessageId);
        bot.deleteMessage(chatId, messageId);
        break
      case REMINDER_TYPES.CUSTOM:
        userData[chatId] = {};
        userData[chatId].dialogMessages = [messageId]
        userData[chatId].remindMessageText = remindMessageText
        userData[chatId].remindMessageId = remindMessageId
        bot.sendMessage(chatId, 'Select a year:', {
          reply_markup: {
            inline_keyboard: [createYearButtons()],
          },
        });
        break
    }
  }

  if (action === CALLBACK_ACTIONS.YEAR) {
    userData[chatId].year = parseInt(value);
    userData[chatId].dialogMessages?.push(messageId);
    bot.sendMessage(chatId, 'Select a month:', {
      reply_markup: {
        inline_keyboard: createMonthButtons(userData[chatId].year),
      },
    });
  }

  if (action === CALLBACK_ACTIONS.MONTH) {
    userData[chatId].month = parseInt(value);
    userData[chatId].dialogMessages?.push(messageId);
    if (!userData[chatId].year) {
      return handleQueryError(query, 'Year missing');
    }
    bot.sendMessage(chatId, 'Select a day:', {
      reply_markup: {
        inline_keyboard: createDayButtons(userData[chatId].month, userData[chatId].year),
      },
    });
  }

  if (action === CALLBACK_ACTIONS.DAY) {
    userData[chatId].day = parseInt(value);
    userData[chatId].dialogMessages?.push(messageId);
    bot.sendMessage(chatId, 'Select hour:', {
      reply_markup: {
        inline_keyboard: createHourButtons(),
      },
    });
  }

  if (action === CALLBACK_ACTIONS.HOUR) {
    userData[chatId].hour = parseInt(value);
    userData[chatId].dialogMessages?.push(messageId);
    bot.sendMessage(chatId, 'Select minute:', {
      reply_markup: {
        inline_keyboard: createMinuteButtons(),
      },
    });
  }

  if (action === CALLBACK_ACTIONS.MINUTE) {
    userData[chatId].minute = parseInt(value);
    userData[chatId].dialogMessages?.push(messageId);

    if (!userData[chatId].year || !userData[chatId].month || !userData[chatId].day || !userData[chatId].hour || !userData[chatId].minute) {
      return handleQueryError(query, 'Date or time missing');
    }

    const selectedDate = new Date(userData[chatId].year, userData[chatId].month - 1, userData[chatId].day, userData[chatId].hour, userData[chatId].minute);

    if (!userData[chatId].remindMessageText) {
      return handleQueryError(query, 'remindMessageText missing');
    }

    DB.addReminder(chatId, userData[chatId].remindMessageText, selectedDate.getTime());

    await bot.answerCallbackQuery(query.id, {
      text: `Okay, I'll ping you at ${getHumanDate(selectedDate)}`,
      show_alert: true,
      });

    await sendConfirmMessage(chatId, selectedDate, userData[chatId].remindMessageId);

    userData[chatId].dialogMessages?.forEach((messageId) => {
      bot.deleteMessage(chatId, messageId);
    });

    delete userData[chatId];
  }

  bot.answerCallbackQuery(query.id);
})

const kickOffReminderCheck = () => {
  setInterval(() => checkReminders(bot), 60000);
}

kickOffReminderCheck();
