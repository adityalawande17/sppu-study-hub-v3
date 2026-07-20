import { useMemo, useState } from "react";
import { buildHeatmapGrid, getMonthLabels, getActivityYears, intensityLevel } from "../utils/heatmap";
import { computeMaxStreak } from "../utils/streak";

const LEVELS = [
  { bg: "var(--surface3)", opacity: 1 }, // 0 - no activity
  { bg: "var(--heat-green)", opacity: 0.3 },
  { bg: "var(--heat-green)", opacity: 0.55 },
  { bg: "var(--heat-green)", opacity: 0.8 },
  { bg: "var(--heat-green)", opacity: 1 },
];

const CELL = 12;
const GAP = 3;
const MONTH_GAP = 6;

export default function ActivityHeatmap({ activity }) {
  const years = useMemo(() => getActivityYears(activity), [activity]);
  const [year, setYear] = useState(years[0]);

  const columns = useMemo(() => buildHeatmapGrid(activity, year), [activity, year]);
  const monthLabels = useMemo(() => getMonthLabels(columns), [columns]);
  const monthStarts = useMemo(
    () => new Set(monthLabels.map((m) => m.index).filter((i) => i !== 0)),
    [monthLabels],
  );

  const { activeDays, maxStreak } = useMemo(() => {
    const yearDates = activity
      .filter((a) => a.date.startsWith(String(year)))
      .filter((a) => a.count > 0)
      .map((a) => a.date);
    return { activeDays: yearDates.length, maxStreak: computeMaxStreak(yearDates) };
  }, [activity, year]);

  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 4,
        }}
      >
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 16,
            color: "var(--heading)",
          }}
        >
          Your Activity
        </h2>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{
            padding: "5px 10px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--surface2)",
            color: "var(--text)",
            fontSize: 12,
            fontFamily: "Inter, sans-serif",
            outline: "none",
          }}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <p style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 14 }}>
        {activeDays} active day{activeDays === 1 ? "" : "s"} · Max streak: {maxStreak} day
        {maxStreak === 1 ? "" : "s"}
      </p>

      <div style={{ overflowX: "auto", paddingBottom: 4 }}>
        <div style={{ display: "flex", gap: GAP, marginBottom: 4 }}>
          {columns.map((_, i) => {
            const label = monthLabels.find((m) => m.index === i);
            return (
              <div
                key={i}
                style={{
                  width: CELL,
                  marginLeft: monthStarts.has(i) ? MONTH_GAP : 0,
                  flexShrink: 0,
                  fontSize: 10,
                  color: "var(--text-3)",
                  whiteSpace: "nowrap",
                  overflow: "visible",
                }}
              >
                {label ? label.label : ""}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: GAP }}>
          {columns.map((col, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateRows: "repeat(7, 1fr)",
                gap: GAP,
                flexShrink: 0,
                marginLeft: monthStarts.has(i) ? MONTH_GAP : 0,
              }}
            >
              {col.map((day) => {
                const level = intensityLevel(day.count);
                if (level === null) {
                  return <div key={day.date} style={{ width: CELL, height: CELL }} />;
                }
                const { bg, opacity } = LEVELS[level];
                return (
                  <div
                    key={day.date}
                    title={`${day.count} ${day.count === 1 ? "activity" : "activities"} on ${day.date}`}
                    style={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 3,
                      background: bg,
                      opacity,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 12,
          fontSize: 11,
          color: "var(--text-3)",
        }}
      >
        <span>Less</span>
        {LEVELS.map((lvl, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: lvl.bg,
              opacity: lvl.opacity,
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
