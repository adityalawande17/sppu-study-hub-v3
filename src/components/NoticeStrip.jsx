import { useState } from "react";
import { Link } from "react-router-dom";

export default function NoticeStrip({
  message = "Welcome to SPPU StudyHub, made by a student for students.",
  link = "/news",
}) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div
      style={{
        background: "var(--notice-bg)",
        borderBottom: "1px solid var(--notice-border)",
        padding: "9px 24px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
          color: "var(--notice-text)",
          overflow: "hidden",
        }}
      >
        <span className="badge badge-new" style={{ flexShrink: 0 }}>
          New
        </span>
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {message}
        </span>
        {link && (
          <Link
            to={link}
            style={{
              color: "var(--gold)",
              textDecoration: "none",
              fontWeight: 600,
              whiteSpace: "nowrap",
              fontSize: 13,
            }}
          >
            View all →
          </Link>
        )}
      </div>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: "none",
          border: "none",
          color: "var(--notice-text-dim)",
          cursor: "pointer",
          fontSize: 18,
          lineHeight: 1,
          padding: "0 2px",
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
