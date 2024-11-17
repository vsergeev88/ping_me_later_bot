const TelegramBot = require('node-telegram-bot-api');
import * as dotenv from 'dotenv';
import { checkReminders } from './utils/checkReminders';
import { botListeners } from './botListeners';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: true });

botListeners(bot)

const kickOffReminderCheck = () => {
  setInterval(() => checkReminders(bot), 60000);
}

kickOffReminderCheck();
