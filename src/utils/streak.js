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

// activityDates: array of "YYYY-MM-DD" strings (any order). Longest run of
// consecutive calendar days with activity, anywhere in the given dates.
export function computeMaxStreak(activityDates) {
  const days = Array.from(new Set(activityDates)).sort();

  let max = 0;
  let current = 0;
  let prev = null;
  for (const iso of days) {
    const day = new Date(`${iso}T00:00:00Z`);
    current = prev && day - prev === 86400000 ? current + 1 : 1;
    max = Math.max(max, current);
    prev = day;
  }
  return max;
}
