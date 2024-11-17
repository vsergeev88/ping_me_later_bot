import Database from 'better-sqlite3';
import { Reminder } from './src/types';

const db = new Database('reminders.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER,
    message_text TEXT,
    reminder_time INTEGER
  )
`);

export const addReminder = (chatId: number, messageText: string, time: number) => {
  const stmt = db.prepare('INSERT INTO reminders (chat_id, message_text, reminder_time) VALUES (?, ?, ?)');
  stmt.run(chatId, messageText, time);
};

export const getReminders = (chatId: number): Reminder[] => {
  const stmt = db.prepare('SELECT * FROM reminders WHERE chat_id = ?');
  return stmt.all(chatId) as Reminder[];
}
