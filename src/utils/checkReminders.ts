import sqlite3 from 'sqlite3';
import { Reminder } from "../types";
import TelegramBot from 'node-telegram-bot-api';
const db = new sqlite3.Database('reminders.db');

export function checkReminders(bot: TelegramBot) {
  const now = Date.now();

  // Ищем напоминания, время которых меньше или равно текущему
  db.all<Reminder>("SELECT id, chat_id, message_text FROM reminders WHERE reminder_time <= ?", [now], (err, rows) => {
    if (err) {
      console.error("Error checking reminders:", err);
      return;
    }

    rows.forEach((row) => {
      // Отправляем напоминание
      bot.sendMessage(row.chat_id, row.message_text)
        .then(() => {
          // Удаляем напоминание после отправки
          db.run("DELETE FROM reminders WHERE id = ?", [row.id], (deleteErr) => {
            if (deleteErr) {
              console.error("Error deleting reminder:", deleteErr);
            }
          });
        })
        .catch(sendErr => {
          console.error("Error sending message:", sendErr);
        });
    });
  });
}
