import { useNavigate } from "react-router-dom";

export default function SubjectItem({
  subject,
  branch,
  branchKey,
  yearKey,
  sem,
  accentColor,
}) {
  const navigate = useNavigate();
  const state = { ...subject, branch, branchKey, yearKey, sem };
  return (
    <div
      className="subject-item"
      style={{
        borderLeft: accentColor ? `3px solid ${accentColor}` : undefined,
      }}
      onClick={() => navigate(`/subject/${subject.code}`, { state })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" && navigate(`/subject/${subject.code}`, { state })
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flex: 1,
          minWidth: 0,
        }}
      >
        <span className="subject-code">{subject.code}</span>
        <div style={{ minWidth: 0 }}>
          <div
            className="subject-name"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {subject.name}
          </div>
          <div className="subject-credits">
            {subject.credits} Credits{subject.type ? ` · ${subject.type}` : ""}
          </div>
        </div>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
      >
        {subject.updated && (
          <span
            className="hide-sm"
            style={{
              fontSize: 11,
              color: "var(--text-4)",
              whiteSpace: "nowrap",
            }}
          >
            {subject.updated}
          </span>
        )}
        <div
          style={{
            width: 14,
            height: 14,
            borderRight: "2px solid var(--border-2)",
            borderTop: "2px solid var(--border-2)",
            transform: "rotate(45deg)",
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
}
