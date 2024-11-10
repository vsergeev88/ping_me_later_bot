import TelegramBot from 'node-telegram-bot-api';
import { addReminder, getReminders, updateReminder, deleteReminder } from './database';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: true });

bot.onText(/\/addreminder (.+) at (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const reminderText = match?.[1];
  const reminderTime = match?.[2];

  if (reminderText && reminderTime) {
    addReminder(chatId, reminderText, reminderTime);
    bot.sendMessage(chatId, `Reminder set: "${reminderText}" at ${reminderTime}`);
  } else {
    bot.sendMessage(chatId, 'Please provide a reminder text and time. Example: /addreminder Buy milk at 18:00');
  }
});

bot.onText(/\/reminders/, (msg) => {
  const chatId = msg.chat.id;
  const reminders = getReminders(chatId);

  if (reminders.length > 0) {
    let message = 'Your reminders:\n';
    reminders.forEach((reminder: any) => {
      message += `ID: ${reminder.id} - ${reminder.reminder_text} at ${reminder.reminder_time}\n`;
    });
    bot.sendMessage(chatId, message);
  } else {
    bot.sendMessage(chatId, 'You have no reminders.');
  }
});

bot.onText(/\/updatereminder (\d+) (.+) at (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const reminderId = parseInt(match?.[1] || '', 10);
  const newText = match?.[2];
  const newTime = match?.[3];

  if (reminderId && newText && newTime) {
    updateReminder(reminderId, newText, newTime);
    bot.sendMessage(chatId, `Reminder updated: "${newText}" at ${newTime}`);
  } else {
    bot.sendMessage(chatId, 'Please provide the reminder ID, new text, and new time. Example: /updatereminder 1 Buy coffee at 08:00');
  }
});

bot.onText(/\/deletereminder (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const reminderId = parseInt(match?.[1] || '', 10);

  if (reminderId) {
    deleteReminder(reminderId);
    bot.sendMessage(chatId, `Reminder with ID ${reminderId} deleted.`);
  } else {
    bot.sendMessage(chatId, 'Please provide the reminder ID. Example: /deletereminder 1');
  }
});
