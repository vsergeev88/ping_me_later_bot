import type TelegramBot from "node-telegram-bot-api";
import { Reminder } from "../types";
import * as DB from '../database';
import { getHumanDate } from "../helpers";

export const reminders = async (bot: TelegramBot, chatId: number, locale = 'en') => {
  const reminders = DB.getReminders(chatId);
  if (reminders.length > 0) {
    reminders.forEach((reminder: Reminder) => {
      const date = new Date(reminder.reminder_time);

      const formattedMessageText = reminder.message_text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const reminderText = `<blockquote>${formattedMessageText}</blockquote>\n⏰ <b>${getHumanDate(date, locale)}</b>`;

      bot.sendMessage(chatId, reminderText, { parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{ text: '❌ Delete', callback_data: `deleteReminder_${reminder.id}` }]]} });
    });
  } else {
    bot.sendMessage(chatId, 'You have no reminders.');
  }
}