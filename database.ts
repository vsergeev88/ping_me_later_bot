import Database from 'better-sqlite3';

const db = new Database('reminders.db'); // Подключаемся к базе данных reminders.db

// Создаем таблицу для хранения напоминаний
db.exec(`
  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER,
    reminder_text TEXT,
    reminder_time TEXT
  )
`);

// Функции CRUD
export const addReminder = (chatId: number, text: string, time: string) => {
  const stmt = db.prepare('INSERT INTO reminders (chat_id, reminder_text, reminder_time) VALUES (?, ?, ?)');
  stmt.run(chatId, text, time);
};

export const getReminders = (chatId: number) => {
  const stmt = db.prepare('SELECT * FROM reminders WHERE chat_id = ?');
  return stmt.all(chatId);
};

export const updateReminder = (id: number, newText: string, newTime: string) => {
  const stmt = db.prepare('UPDATE reminders SET reminder_text = ?, reminder_time = ? WHERE id = ?');
  stmt.run(newText, newTime, id);
};

export const deleteReminder = (id: number) => {
  const stmt = db.prepare('DELETE FROM reminders WHERE id = ?');
  stmt.run(id);
};
