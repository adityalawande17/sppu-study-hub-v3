import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { useApp } from "../context/AppContext";
import { fetchHistory, deleteHistoryEntry, clearHistory, MAX } from "../utils/aiHistory";

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function HistoryCard({ entry, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: "1px solid var(--border)",
      borderRadius: 12,
      background: "var(--surface)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            <Link
              to={`/subject/${entry.subjectCode}`}
              style={{
                fontSize: 10, fontWeight: 700, color: "var(--gold-dim)",
                background: "var(--gold-pale)", padding: "3px 8px",
                borderRadius: 10, textDecoration: "none", whiteSpace: "nowrap",
              }}
            >
              {entry.subjectCode}
            </Link>
            {entry.subjectName && (
              <span style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 500 }}>
                {entry.subjectName}
              </span>
            )}
            {entry.paperExam && (
              <span style={{ fontSize: 11, color: "var(--text-4)", marginLeft: "auto", whiteSpace: "nowrap" }}>
                {entry.paperExam} {entry.paperYear}
              </span>
            )}
          </div>

          <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            {entry.question}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {entry.marks && (
              <span style={{ fontSize: 11, color: "var(--text-3)", background: "var(--surface2)", padding: "2px 7px", borderRadius: 8 }}>
                {entry.marks}M
              </span>
            )}
            {entry.unit && (
              <span style={{ fontSize: 11, color: "var(--text-4)", background: "var(--surface2)", padding: "2px 7px", borderRadius: 8 }}>
                Unit {entry.unit}
              </span>
            )}
            <span style={{ fontSize: 11, color: "var(--text-4)" }}>{timeAgo(entry.askedAt)}</span>
            <button
              onClick={() => setOpen((v) => !v)}
              style={{
                marginLeft: "auto",
                fontSize: 12, fontWeight: 600, color: "#a78bfa",
                background: open ? "rgba(124,58,237,.12)" : "transparent",
                border: `1px solid ${open ? "rgba(124,58,237,.3)" : "var(--border)"}`,
                borderRadius: 7, padding: "3px 10px",
                cursor: "pointer", fontFamily: "Inter, sans-serif",
              }}
            >
              {open ? "Hide answer" : "View answer"}
            </button>
          </div>
        </div>

        <button
          onClick={() => onDelete(entry)}
          title="Remove"
          style={{
            flexShrink: 0, width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid var(--border)", borderRadius: 7,
            background: "transparent", color: "var(--text-4)",
            cursor: "pointer", fontSize: 16, lineHeight: 1,
            transition: "all .15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-4)"; }}
        >
          ×
        </button>
      </div>

      {open && (
        <div style={{
          borderTop: "1px solid var(--border)",
          borderLeft: "3px solid #7c3aed",
          padding: "14px 16px",
          background: "rgba(124,58,237,.05)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", letterSpacing: 0.3, marginBottom: 10 }}>
            AI ANSWER
            {entry.cached && (
              <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-4)", background: "var(--surface2)", padding: "2px 8px", borderRadius: 10, marginLeft: 8 }}>
                cached
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--text)", margin: 0, whiteSpace: "pre-wrap" }}>
            {entry.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function History() {
  useSEO({
    title: "AI Answer History — SPPUStudyHub",
    description: "Your recent AI-explained questions on SPPUStudyHub.",
  });

  const { user } = useApp();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory(user)
      .then((data) => { setEntries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  async function handleDelete(entry) {
    await deleteHistoryEntry(entry, user);
    setEntries((prev) => prev.filter((e) => e.askedAt !== entry.askedAt));
  }

  async function handleClearAll() {
    await clearHistory(user);
    setEntries([]);
  }

  return (
    <div className="container" style={{ padding: "40px 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 26, color: "var(--heading)", margin: 0, lineHeight: 1.2,
          }}>
            AI Answer History
          </h1>
          <p style={{ color: "var(--text-3)", fontSize: 13, margin: "6px 0 0" }}>
            {user ? "Synced across your devices — " : "Stored locally — "}
            last {MAX} questions kept
          </p>
          <p style={{ fontSize: 12, color: "var(--text-4)", margin: "6px 0 0", lineHeight: 1.6 }}>
            This feature is still in testing phase. We apologise if you faced any issues — mail us at{" "}
            <a href="mailto:contact.sppustudyhub@gmail.com" style={{ color: "#a78bfa", textDecoration: "none" }}>
              contact.sppustudyhub@gmail.com
            </a>
          </p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              padding: "7px 14px", borderRadius: 8,
              border: "1px solid var(--border)",
              background: "transparent", color: "var(--text-3)",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "Inter, sans-serif", transition: "all .18s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-3)"; }}
          >
            Clear all
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-4)", fontSize: 13 }}>
          Loading…
        </div>
      ) : entries.length === 0 ? (
        <div className="card" style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>✨</div>
          <p style={{ color: "var(--text-3)", fontSize: 14, marginBottom: 20 }}>
            No history yet. Open any subject page and ask AI to explain a question.
          </p>
          <Link to="/branches" className="btn btn-primary">Browse Subjects</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {entries.map((entry) => (
            <HistoryCard key={entry.askedAt} entry={entry} onDelete={handleDelete} />
          ))}
          <p style={{ fontSize: 12, color: "var(--text-4)", textAlign: "center", marginTop: 4 }}>
            Only the last {MAX} answers are kept. Older ones are removed automatically.
          </p>
        </div>
      )}
    </div>
  );
}
