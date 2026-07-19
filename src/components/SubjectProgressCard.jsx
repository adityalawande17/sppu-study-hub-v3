import { Link } from "react-router-dom";

function ProgressBar({ label, done, total, loading, emptyNote }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "var(--text-3)",
          marginBottom: 4,
        }}
      >
        <span>{label}</span>
        <span>{loading ? "…" : total > 0 ? `${done}/${total}` : emptyNote}</span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 4,
          background: "var(--surface3)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "var(--gold)",
            transition: "width .2s",
          }}
        />
      </div>
    </div>
  );
}

export default function SubjectProgressCard({
  subject,
  unitsDone,
  unitsTotal,
  questionsDone,
  questionsTotal,
  loading,
}) {
  return (
    <div className="card" style={{ padding: "16px 18px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--heading)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {subject.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-3)" }}>{subject.code}</div>
        </div>
        <Link
          to={`/subject/${subject.code}`}
          state={subject}
          className="btn btn-outline"
          style={{ fontSize: 12, padding: "6px 12px", whiteSpace: "nowrap", flexShrink: 0 }}
        >
          Go to subject →
        </Link>
      </div>

      <ProgressBar
        label="Unit notes"
        done={unitsDone}
        total={unitsTotal}
        loading={loading}
        emptyNote="No units added yet"
      />
      <ProgressBar
        label="PYQ questions"
        done={questionsDone}
        total={questionsTotal}
        loading={loading}
        emptyNote="No questions added yet"
      />
    </div>
  );
}
