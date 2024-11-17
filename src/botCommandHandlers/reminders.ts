import type TelegramBot from "node-telegram-bot-api";
import { Reminder } from "../types";
import * as DB from '../../database';
import { getHumanDate } from "../helpers";

export const reminders = async (bot: TelegramBot, chatId: number) => {
  const reminders = DB.getReminders(chatId);
  if (reminders.length > 0) {
    reminders.forEach((reminder: Reminder) => {
      const date = new Date(reminder.reminder_time);

      const formattedMessageText = reminder.message_text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const reminderText = `<blockquote>${formattedMessageText}</blockquote>\n⏰ <b>${getHumanDate(date)}</b>`;

      bot.sendMessage(chatId, reminderText, { parse_mode: 'HTML' });
    });
  } else {
    bot.sendMessage(chatId, 'You have no reminders.');
  }
}