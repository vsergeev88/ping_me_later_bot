import sqlite3 from 'sqlite3';
import { Reminder } from "../types";
import TelegramBot from 'node-telegram-bot-api';
const db = new sqlite3.Database('reminders.db');

export function checkReminders(bot: TelegramBot) {
  const now = Date.now();

  db.all<Reminder>("SELECT id, chat_id, message_text FROM reminders WHERE reminder_time <= ?", [now], (err, rows) => {
    if (err) {
      console.error("Error checking reminders:", err);
      return;
    }

    rows.forEach(async (row) => {
      const formattedMessageText = row.message_text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const reminderText = `✨ <b>New reminder:</b>\n<blockquote>${formattedMessageText}</blockquote>\n`;

      await bot.sendMessage(row.chat_id, reminderText, { parse_mode: 'HTML' })
      try {
        db.run("DELETE FROM reminders WHERE id = ?", [row.id], (deleteErr) => {
          if (deleteErr) {
            console.error("Error deleting reminder:", deleteErr);
          }
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });
  });
}
