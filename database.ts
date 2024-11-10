import Database from 'better-sqlite3';
import { Reminder } from './types';

const db = new Database('reminders.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER,
    message_text TEXT,
    reminder_time INTEGER
  )
`);

// CRUD
export const addReminder = (chatId: number, messageText: string, time: number) => {
  const stmt = db.prepare('INSERT INTO reminders (chat_id, message_text, reminder_time) VALUES (?, ?, ?)');
  stmt.run(chatId, messageText, time);
};

export const getReminders = (chatId: number): Reminder[] => {
  const stmt = db.prepare('SELECT * FROM reminders WHERE chat_id = ?');
  return stmt.all(chatId) as Reminder[];
}

// export const getReminders = (chatId: number): Reminder[] => {
//   const stmt = db.prepare('SELECT * FROM reminders WHERE chat_id = ?');
//   return stmt.all(chatId) as Reminder[];
// };

// export const updateReminder = (id: number, newText: string, newTime: string) => {
//   const stmt = db.prepare('UPDATE reminders SET reminder_text = ?, reminder_time = ? WHERE id = ?');
//   stmt.run(newText, newTime, id);
// };

// export const deleteReminder = (id: number) => {
//   const stmt = db.prepare('DELETE FROM reminders WHERE id = ?');
//   stmt.run(id);
// };
