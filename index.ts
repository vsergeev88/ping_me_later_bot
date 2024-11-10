import TelegramBot from 'node-telegram-bot-api';
import * as DB from './database';
import * as dotenv from 'dotenv';
import { Reminder } from './types';
import { CALLBACK_ACTIONS, COMMANDS, DATE, REMINDER_TYPES } from './enums';
import { REMINDER_KEYBOARD } from './keyboards';
import { BOT_COMMANDS, WELCOME_STICKER } from './constants';
import * as BOT_MESSAGES from './botMessages';
import { createDayButtons, createMonthButtons, createYearButtons, getNextMondayAt9AM, getTomorrowAt9AM } from './utils';
import { getHumanDate } from './helpers';

dotenv.config();
interface UserData {
  year?: number;
  month?: number;
  day?: number;
  dialogMessages?: number[];
  remindMessageText?: string;
}

// Храним данные о пользователях
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

bot.on('callback_query', async (query) => {
  const chatId = query.message?.chat.id;
  const messageId = query.message?.message_id
  const data = query.data;
  if (!chatId || !messageId || !data) return handleQueryError(query);

  const [action, value] = data.split('_');

  if (action === CALLBACK_ACTIONS.ADD) {
    const remindMessageText = query.message?.reply_to_message?.text

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
        bot.deleteMessage(chatId, messageId);
        break
      case REMINDER_TYPES.MONDAY_MORNING:
        setReminder(getNextMondayAt9AM());
        await bot.answerCallbackQuery(query.id, {
          text: "Ok! I'll ping you at next Monday 9:00 am!",
          show_alert: true,
          });
        bot.deleteMessage(chatId, messageId);
        break
      case REMINDER_TYPES.CUSTOM:
        userData[chatId] = {};
        userData[chatId].dialogMessages = [messageId]
        userData[chatId].remindMessageText = remindMessageText
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

  if (action === CALLBACK_ACTIONS.MONTH && userData[chatId].year) {
    userData[chatId].month = parseInt(value);
    userData[chatId].dialogMessages?.push(messageId);
    bot.sendMessage(chatId, 'Select a day:', {
      reply_markup: {
        inline_keyboard: createDayButtons(userData[chatId].month, userData[chatId].year),
      },
    });
  }

  if (action === CALLBACK_ACTIONS.DAY && userData[chatId].month && userData[chatId].year) {
    userData[chatId].day = parseInt(value);
    userData[chatId].dialogMessages?.push(messageId);

    const selectedDate = new Date(userData[chatId].year, userData[chatId].month - 1, userData[chatId].day);

    if (!userData[chatId].remindMessageText) {
      return handleQueryError(query, 'remindMessageText missing');
    }

    DB.addReminder(chatId, userData[chatId].remindMessageText, selectedDate.getTime());

    await bot.answerCallbackQuery(query.id, {
      text: `Okay, I'll ping you at ${getHumanDate(selectedDate)}`,
      show_alert: true,
      });

    userData[chatId].dialogMessages?.forEach((messageId) => {
      bot.deleteMessage(chatId, messageId);
    });

    delete userData[chatId];
  }

  bot.answerCallbackQuery(query.id);
})
