import { useState, useEffect } from "react";
import { Navigate, useNavigate, Link, useLocation } from "react-router-dom";
import {
  getAdminToken,
  clearAdminToken,
  getAdminAuthHeader,
} from "../utils/adminAuth";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const inputStyle = {
  width: "100%",
  padding: "9px 11px",
  borderRadius: 8,
  border: "var(--border-w) solid var(--border)",
  background: "var(--surface2)",
  color: "var(--text)",
  fontSize: 13,
  fontFamily: "Inter, sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text-3)",
  marginBottom: 5,
};

const ADMIN_TABS = [
  { path: "/admin/questions", label: "PYQ Questions" },
  { path: "/admin/announcements", label: "Announcements" },
];

export default function AdminAnnouncements() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendResult, setSendResult] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setChecking(false);
      return;
    }
    fetch(`${BACKEND}/api/admin/me`, { headers: getAdminAuthHeader() })
      .then((res) => {
        if (res.ok) setAuthorized(true);
        else clearAdminToken();
      })
      .catch(() => clearAdminToken())
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!authorized) return;
    loadHistory();
  }, [authorized]);

  function loadHistory() {
    setHistoryLoading(true);
    setHistoryError(null);
    fetch(`${BACKEND}/api/announcements`, { headers: getAdminAuthHeader() })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load history."))))
      .then((data) => setHistory(data.announcements ?? []))
      .catch((err) => setHistoryError(err.message))
      .finally(() => setHistoryLoading(false));
  }

  function handleLogout() {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  }

  async function handleUnauthorized(res) {
    if (res.status === 401) {
      clearAdminToken();
      navigate("/admin/login", { replace: true });
      return true;
    }
    return false;
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      setSendError("Subject and message are both required.");
      return;
    }
    if (
      !window.confirm(
        "Send this email to every subscribed user right now? This can't be undone.",
      )
    ) {
      return;
    }

    setSending(true);
    setSendError(null);
    setSendResult(null);
    try {
      const res = await fetch(`${BACKEND}/api/announcements/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAdminAuthHeader() },
        body: JSON.stringify({ subject: subject.trim(), body: body.trim() }),
      });
      if (await handleUnauthorized(res)) return;
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send announcement.");
      setSendResult(data);
      setSubject("");
      setBody("");
      loadHistory();
    } catch (err) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (checking) return null;
  if (!authorized) return <Navigate to="/admin/login" replace />;

  return (
    <div className="container" style={{ padding: "36px 24px 80px" }}>
      {/* Admin tab bar */}
      <div style={{ display: "flex", gap: 4, borderBottom: "var(--border-w) solid var(--border)", marginBottom: 28 }}>
        {ADMIN_TABS.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: pathname === path ? "var(--gold)" : "var(--text-3)",
              borderBottom: pathname === path ? "2px solid var(--gold)" : "2px solid transparent",
              textDecoration: "none",
              marginBottom: -1,
              transition: "color .15s",
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 26,
            color: "var(--heading)",
          }}
        >
          Announcements
        </h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "var(--border-w) solid var(--border)",
            background: "transparent",
            color: "var(--text-3)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Log out
        </button>
      </div>

      <form
        onSubmit={handleSend}
        className="card"
        style={{ padding: "20px 22px", marginBottom: 20 }}
      >
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 17,
            color: "var(--heading)",
            marginBottom: 16,
          }}
        >
          Compose
        </h2>

        <label style={labelStyle}>Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. TE Semester exam schedule released"
          style={{ ...inputStyle, marginBottom: 14 }}
        />

        <label style={labelStyle}>Message</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          placeholder="Write the announcement body here…"
          style={{ ...inputStyle, marginBottom: 16, resize: "vertical" }}
        />

        {sendError && (
          <div
            style={{
              color: "#f87171",
              fontSize: 13,
              marginBottom: 14,
              padding: "8px 12px",
              background: "rgba(248,113,113,.08)",
              borderRadius: 8,
            }}
          >
            {sendError}
          </div>
        )}
        {sendResult && (
          <div
            style={{
              color: "#22c55e",
              fontSize: 13,
              marginBottom: 14,
              padding: "8px 12px",
              background: "rgba(34,197,94,.08)",
              borderRadius: 8,
            }}
          >
            Sent to {sendResult.sent} of {sendResult.total} subscribed users
            {sendResult.failed > 0 ? ` (${sendResult.failed} failed — check your Resend quota)` : ""}.
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="btn btn-primary"
          style={{ padding: "10px 22px" }}
        >
          {sending ? "Sending…" : "Send to all subscribed users"}
        </button>
      </form>

      <div className="card" style={{ padding: "20px 22px" }}>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 17,
            color: "var(--heading)",
            marginBottom: 14,
          }}
        >
          Past announcements
        </h2>

        {historyError && (
          <div style={{ color: "#f87171", fontSize: 13 }}>{historyError}</div>
        )}
        {historyLoading && (
          <div style={{ color: "var(--text-3)", fontSize: 13 }}>Loading…</div>
        )}
        {!historyLoading && history.length === 0 && !historyError && (
          <div style={{ color: "var(--text-3)", fontSize: 13 }}>
            No announcements sent yet.
          </div>
        )}

        <div style={{ display: "grid", gap: 8 }}>
          {history.map((a) => (
            <div
              key={a.id}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "var(--border-w) solid var(--border)",
                background: "var(--surface2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--heading)" }}>
                  {a.subject}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-3)", whiteSpace: "nowrap" }}>
                  {new Date(a.sent_at).toLocaleString()}
                </span>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-3)", margin: "0 0 6px", lineHeight: 1.5 }}>
                {a.body}
              </p>
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                Sent to {a.recipient_count} users
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
