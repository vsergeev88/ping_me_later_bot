import type TelegramBot from "node-telegram-bot-api";
import { Reminder } from "../types";
import { getHumanDate } from "../helpers";
import * as DB from '../../database';

export const showActiveReminders = async (bot: TelegramBot, chatId: number) => {
  const reminders = DB.getReminders(chatId);
  if (reminders.length > 0) {
    reminders.forEach((reminder: Reminder) => {
      const date = new Date(reminder.reminder_time);

      const formattedMessageText = reminder.message_text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const reminderText = `<blockquote>${formattedMessageText}</blockquote>\n\nReminder set for <b>${getHumanDate(date)}</b>`;

      bot.sendMessage(chatId, reminderText, { parse_mode: 'HTML' });
    });
  } else {
    bot.sendMessage(chatId, 'You have no reminders.');
  }
}