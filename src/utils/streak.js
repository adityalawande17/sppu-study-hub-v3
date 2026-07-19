// activityDates: array of "YYYY-MM-DD" strings (any order, from GET /api/progress/activity)
// Counts consecutive calendar days with activity, ending today (UTC).
export function computeStreak(activityDates) {
  const daySet = new Set(activityDates);
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  let streak = 0;
  while (daySet.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
