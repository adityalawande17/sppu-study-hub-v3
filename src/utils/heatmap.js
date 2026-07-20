// Builds a GitHub/LeetCode-style week-column grid (7 rows: Sun–Sat) for one
// calendar year from a list of {date, count} entries. Days outside the
// selected year (padding to align the first/last week) and days beyond
// today get count: null so the grid can render them blank.
export function buildHeatmapGrid(activity, year) {
  const countByDate = new Map(activity.map((a) => [a.date, a.count]));

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year, 11, 31));

  const start = new Date(yearStart);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  const end = new Date(yearEnd);
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));

  const columns = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const column = [];
    for (let d = 0; d < 7; d++) {
      const iso = cursor.toISOString().slice(0, 10);
      const inYear = cursor.getUTCFullYear() === year;
      const isFuture = cursor > today;
      column.push({
        date: iso,
        count: !inYear || isFuture ? null : (countByDate.get(iso) ?? 0),
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    columns.push(column);
  }
  return columns;
}

// Returns { index, label } for each week-column that contains the 1st of a
// month, so the heatmap can print a month name above that column.
export function getMonthLabels(columns) {
  const labels = [];
  columns.forEach((col, i) => {
    const firstOfMonth = col.find((day) => day.count !== null && day.date.endsWith("-01"));
    if (firstOfMonth) {
      const d = new Date(`${firstOfMonth.date}T00:00:00Z`);
      labels.push({ index: i, label: d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }) });
    }
  });
  return labels;
}

// Distinct calendar years present in the activity data, newest first, always
// including the current year even if it has no activity yet.
export function getActivityYears(activity) {
  const years = new Set(activity.map((a) => Number(a.date.slice(0, 4))));
  years.add(new Date().getUTCFullYear());
  return Array.from(years).sort((a, b) => b - a);
}

// 0 = no activity, 1–4 = increasing intensity tiers, null = outside range (don't render)
export function intensityLevel(count) {
  if (count === null || count === undefined) return null;
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}
