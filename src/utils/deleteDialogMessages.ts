import type TelegramBot from "node-telegram-bot-api";
import { userDataManager } from "../userDataManager";

export const deleteDialogMessages = async (bot: TelegramBot, chatId: number) => {
  const userData = userDataManager.getUserData(chatId);
  userData.dialogMessages?.forEach(async (messageId) => {
    try {
      await bot.deleteMessage(chatId, messageId);
    } catch (error) {
      console.error('>>>>>> Error deleting message', messageId)
    }
  });
}