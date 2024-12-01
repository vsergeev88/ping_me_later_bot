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

export const addReminder = (chatId: number, messageText: string, time: number) => {
  const stmt = db.prepare('INSERT INTO reminders (chat_id, message_text, reminder_time) VALUES (?, ?, ?)');
  stmt.run(chatId, messageText, time);
};

export const getReminders = (chatId: number): Reminder[] => {
  const stmt = db.prepare('SELECT * FROM reminders WHERE chat_id = ?');
  return stmt.all(chatId) as Reminder[];
}

export type TimeOffset = {
  chat_id: number;
  time_offset: number;
  geo_location: string;
}

db.exec(`
  CREATE TABLE IF NOT EXISTS time_zones (
    chat_id INTEGER PRIMARY KEY,
    time_offset INTEGER,
    geo_location TEXT
  )
`);

export const getTimeOffset = (chatId: number): number => {
  const stmt = db.prepare('SELECT time_offset FROM time_zones WHERE chat_id = ?');
  const row = stmt.get(chatId) as TimeOffset;
  return row ? row.time_offset : 0;
}

export const setTimeZone = (chatId: number, timeOffset: number, geoLocation: string): void => {
  const stmt = db.prepare('INSERT OR REPLACE INTO time_zones (chat_id, time_offset, geo_location) VALUES (?, ?, ?)');
  stmt.run(chatId, timeOffset, geoLocation);
}

export const deleteReminder = (id: number) => {
  const stmt = db.prepare('DELETE FROM reminders WHERE id = ?');
  stmt.run(id);
}
