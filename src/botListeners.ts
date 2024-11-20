import type TelegramBot from "node-telegram-bot-api";
import { BaseQueryHandler } from './types';
import { CALLBACK_ACTIONS, COMMANDS, DATE } from './enums';
import { createAddReminderButtons } from './utils/createButtons';
import { handleQueryError } from './utils/errorHandlers';
import { customDateQueryHandler } from './botQueryHandlers/customDate';
import { addReminderQueryHandler } from './botQueryHandlers/addReminder';
import { start } from "./botCommandHandlers/start";
import { reminders } from "./botCommandHandlers/reminders";
import { getTimezoneFromCoordinates } from "./utils/getTimezoneFromCoordinates";
import * as DB from './database';

export const botListeners = (bot: TelegramBot) => {
  bot.on('message', async (msg) => {
    const {text, chat, message_id, from} = msg;
    if (!text || !chat || !message_id) return;
    switch (text) {
      case COMMANDS.START:
        return start(bot, chat.id, from?.language_code);
      case COMMANDS.REMINDERS:
        return reminders(bot, chat.id, from?.language_code);
      default:
        return bot.sendMessage(chat.id, 'Alright, let\'s add notification to this',
          {
            reply_markup: {
              inline_keyboard: createAddReminderButtons(),
            },
            reply_to_message_id: message_id
          });
    }
  });

  bot.on('callback_query', async (query) => {
    const chatId = query.message?.chat.id;
    const messageId = query.message?.message_id
    const data = query.data;
    const locale = query.message?.from?.language_code;

    if (!chatId || !messageId || !data) return handleQueryError(bot, query);

    const [action, value] = data.split('_')

    const baseQueryArgs: BaseQueryHandler = {bot, query, chatId, value, locale};

    if (action === CALLBACK_ACTIONS.ADD) {
      addReminderQueryHandler(baseQueryArgs);
    } else if ((Object.values(DATE) as string[]).includes(action)) {
      customDateQueryHandler({...baseQueryArgs, action, messageId});
    }

    bot.answerCallbackQuery(query.id);
  })

  bot.on('location', async (msg) => {
    if (!msg.location) return;

    const { latitude, longitude } = msg.location;
    const timezoneData = await getTimezoneFromCoordinates(latitude, longitude);
    if (!timezoneData) return bot.sendMessage(msg.chat.id, 'Sorry, I could not determine your timezone. Please try again later');
    DB.setTimeZone(msg.chat.id, timezoneData.gmtOffset, JSON.stringify(timezoneData));
    bot.sendMessage(msg.chat.id, `Your timezone set ${timezoneData.zoneName}`);
});
}