// utils/timerStorage.ts
export const TimerStorage = {
  saveStartTime: (userCode: string, startTime: Date) =>
    localStorage.setItem(`timerStartTime_${userCode}`, startTime.toISOString()),
  getStartTime: (userCode: string): Date | null => {
    const savedTime = localStorage.getItem(`timerStartTime_${userCode}`);
    return savedTime ? new Date(savedTime) : null;
  },
  clearStartTime: (userCode: string) =>
    localStorage.removeItem(`timerStartTime_${userCode}`),
};
