import { buildHeatmapGrid, intensityLevel } from "../utils/heatmap";

const LEVELS = [
  { bg: "var(--surface3)", opacity: 1 }, // 0 - no activity
  { bg: "var(--gold)", opacity: 0.25 },
  { bg: "var(--gold)", opacity: 0.5 },
  { bg: "var(--gold)", opacity: 0.75 },
  { bg: "var(--gold)", opacity: 1 },
];

export default function ActivityHeatmap({ activity, weeks = 20 }) {
  const columns = buildHeatmapGrid(activity, weeks);

  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 16,
          color: "var(--heading)",
          marginBottom: 14,
        }}
      >
        Your Activity
      </h2>

      <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 4 }}>
        {columns.map((col, i) => (
          <div
            key={i}
            style={{ display: "grid", gridTemplateRows: "repeat(7, 1fr)", gap: 3, flexShrink: 0 }}
          >
            {col.map((day) => {
              const level = intensityLevel(day.count);
              if (level === null) {
                return <div key={day.date} style={{ width: 12, height: 12 }} />;
              }
              const { bg, opacity } = LEVELS[level];
              return (
                <div
                  key={day.date}
                  title={`${day.count} ${day.count === 1 ? "activity" : "activities"} on ${day.date}`}
                  style={{
                    width: 12,
                    height: 12,
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
