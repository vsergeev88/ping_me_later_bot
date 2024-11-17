export type UserData = {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  dialogMessages?: number[];
  remindMessageText?: string;
  remindMessageId?: number;
}

class UserDataManager {
  private userData: Record<number, UserData> = {};

  getUserData(chatId: number): UserData {
    if (!this.userData[chatId]) {
      this.userData[chatId] = {};
    }
    return this.userData[chatId];
  }

  setUserData(chatId: number, data: Partial<UserData>): void {
    if (!this.userData[chatId]) {
      this.userData[chatId] = {};
    }
    this.userData[chatId] = { ...this.userData[chatId], ...data };
  }

  deleteUserData(chatId: number): void {
    delete this.userData[chatId];
  }
}

// Экспортируем один-единственный экземпляр
export const userDataManager = new UserDataManager();
