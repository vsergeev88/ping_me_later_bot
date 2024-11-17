const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const { checkReminders } = require('./utils/checkReminders');
const { botListeners } = require('./botListeners');

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: true });

botListeners(bot)

const kickOffReminderCheck = () => {
  setInterval(() => checkReminders(bot), 60000);
}

kickOffReminderCheck();
