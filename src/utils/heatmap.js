// Builds a GitHub/LeetCode-style week-column grid (7 rows: Sun–Sat) from a
// list of {date, count} entries, ending with the current week. Days beyond
// today get count: null so the grid can render them blank.
export function buildHeatmapGrid(activity, weeks = 20) {
  const countByDate = new Map(activity.map((a) => [a.date, a.count]));

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const endOfWeek = new Date(today);
  endOfWeek.setUTCDate(endOfWeek.getUTCDate() + (6 - endOfWeek.getUTCDay()));

  const totalDays = weeks * 7;
  const start = new Date(endOfWeek);
  start.setUTCDate(start.getUTCDate() - totalDays + 1);

  const columns = [];
  const cursor = new Date(start);
  for (let w = 0; w < weeks; w++) {
    const column = [];
    for (let d = 0; d < 7; d++) {
      const iso = cursor.toISOString().slice(0, 10);
      const isFuture = cursor > today;
      column.push({
        date: iso,
        count: isFuture ? null : (countByDate.get(iso) ?? 0),
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    columns.push(column);
  }
  return columns;
}

// 0 = no activity, 1–4 = increasing intensity tiers, null = future day (don't render)
export function intensityLevel(count) {
  if (count === null || count === undefined) return null;
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}
