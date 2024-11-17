import type TelegramBot from "node-telegram-bot-api";

export const handleQueryError = (bot: TelegramBot, query: TelegramBot.CallbackQuery, errorMessage = 'Something went wrong') => {
  bot.answerCallbackQuery(query.id, {
    text: errorMessage,
    show_alert: true,
  });
}