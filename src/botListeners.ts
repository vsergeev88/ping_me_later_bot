import type TelegramBot from "node-telegram-bot-api";
import { BaseQueryHandler } from './types';
import { CALLBACK_ACTIONS, COMMANDS, DATE } from './enums';
import * as BOT_MESSAGES from './botMessages';
import { createAddReminderButtons } from './utils/createButtons';
import { handleQueryError } from './utils/errorHandlers';
import { customDateQueryHandler } from './botQueryHandlers/customDate';
import { addReminderQueryHandler } from './botQueryHandlers/addReminder';
import { start } from "./botCommandHandlers/start";
import { reminders } from "./botCommandHandlers/reminders";

export const botListeners = (bot: TelegramBot) => {
  bot.on('message', async (msg) => {
    const {text, chat, message_id} = msg;
    switch (text) {
      case COMMANDS.START:
        return start(bot, chat.id);
      case COMMANDS.REMINDERS:
        return reminders(bot, chat.id);
      default:
        return bot.sendMessage(chat.id, BOT_MESSAGES.ADD_REMINDER_MESSAGE,
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

    if (!chatId || !messageId || !data) return handleQueryError(bot, query);

    const [action, value] = data.split('_')

    const baseQueryArgs: BaseQueryHandler = {bot, query, chatId, value}

    if (action === CALLBACK_ACTIONS.ADD) {
      addReminderQueryHandler(baseQueryArgs);
    } else if ((Object.values(DATE) as string[]).includes(action)) {
      customDateQueryHandler({...baseQueryArgs, action, messageId});
    }

    bot.answerCallbackQuery(query.id);
  })
}