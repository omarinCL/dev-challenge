export function isCutTimeValid(cutTimes: string[], now: Date): boolean {
  let dayIndex = now.getDay() - 1;
  if (dayIndex < 0) {
    dayIndex = 6;
  }
  const cutTimeStr = cutTimes[dayIndex];
  if (!cutTimeStr) {
    return true;
  }

  const [cutHour, cutMinute] = cutTimeStr.split(":").map(Number);
  const nowHour = now.getHours();
  const nowMinute = now.getMinutes();

  if (nowHour < cutHour || (nowHour === cutHour && nowMinute < cutMinute)) {
    return true;
  }
  return false;
}
