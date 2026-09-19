import { useState, useEffect } from "react";
import { Navigate, useNavigate, Link, useLocation } from "react-router-dom";
import {
  getAdminToken,
  clearAdminToken,
  getAdminAuthHeader,
} from "../utils/adminAuth";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const ADMIN_TABS = [
  { path: "/admin/questions", label: "PYQ Questions" },
  { path: "/admin/announcements", label: "Announcements" },
  { path: "/admin/notes", label: "Peer Notes" },
];

const badgeStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text-3)",
  background: "var(--surface3)",
  padding: "2px 8px",
  borderRadius: 10,
};

const viewButtonStyle = {
  padding: "6px 12px",
  borderRadius: 7,
  border: "var(--border-w) solid var(--border)",
  background: "transparent",
  color: "var(--text-3)",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "Inter, sans-serif",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};

const addButtonStyle = {
  padding: "6px 12px",
  borderRadius: 7,
  border: "1px solid rgba(34,197,94,.3)",
  background: "rgba(34,197,94,.08)",
  color: "#22c55e",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "Inter, sans-serif",
};

const rejectButtonStyle = {
  padding: "6px 12px",
  borderRadius: 7,
  border: "1px solid rgba(248,113,113,.3)",
  background: "rgba(248,113,113,.08)",
  color: "#f87171",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "Inter, sans-serif",
};

export default function AdminNotes() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [notes, setNotes] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);

  // ── Auth check — identical pattern to AdminQuestions.jsx ──────────
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

  function handleLogout() {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  }

  // Covers a token that was valid on page load but expired/was revoked by
  // the time an action actually hits the backend — same helper AdminQuestions.jsx uses.
  async function handleUnauthorized(res) {
    if (res.status === 401) {
      clearAdminToken();
      navigate("/admin/login", { replace: true });
      return true;
    }
    return false;
  }

  // ── YOUR FUNCTION ──────────────────────────────────────────────
  // Fetch the pending queue once the admin is confirmed authorized. Steps:
  //   1. Only actually fetch when `authorized` is true — skip while still
  //      checking, or if never authorized (return early otherwise).
  //   2. setListLoading(true), setListError(null).
  //   3. GET `${BACKEND}/api/peer-notes/pending`, headers: getAdminAuthHeader().
  //   4. if (await handleUnauthorized(res)) return.
  //   5. If !res.ok, throw or setListError and return.
  //   6. Parse JSON, setNotes(data.notes ?? []).
  //   7. On any error: setListError with a message.
  //   8. finally: setListLoading(false).
  useEffect(() => {
    if (!authorized) return;

    async function fetchPendingNotes() {
      setListLoading(true);
      setListError(null);

      try {
        const res = await fetch(`${BACKEND}/api/peer-notes/pending`, {
          headers: getAdminAuthHeader(),
        });

        if (await handleUnauthorized(res)) return;

        if (!res.ok) {
          throw new Error("Could not fetch pending notes.");
        }

        const data = await res.json();
        setNotes(data.notes ?? []);
      } catch (error) {
        console.error("Failed to fetch pending notes:", error);
        setListError(error.message || "Could not fetch pending notes.");
      } finally {
        setListLoading(false);
      }
    }

    fetchPendingNotes();
  }, [authorized]);

  // ── YOUR FUNCTION ──────────────────────────────────────────────
  // Approve a note (the "Add" button). Steps:
  //   1. POST `${BACKEND}/api/peer-notes/${id}/approve`, headers: getAdminAuthHeader().
  //   2. if (await handleUnauthorized(res)) return.
  //   3. If !res.ok: parse the error and setListError(...), then return —
  //      leave the note in the list since it wasn't actually approved.
  //   4. On success: remove it from `notes` locally —
  //      setNotes((prev) => prev.filter((n) => n.id !== id))
  //      — no need to refetch the whole list.
  async function handleApprove(id) {
    try {
      const res = await fetch(`${BACKEND}/api/peer-notes/${id}/approve`, {
        method: "POST",
        headers: getAdminAuthHeader(),
      });

      if (await handleUnauthorized(res)) return;

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setListError(data.error ?? "Could not approve note.");
        return;
      }

      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to approve note:", error);
      setListError("Could not approve note.");
    }
  }

  // ── YOUR FUNCTION ──────────────────────────────────────────────
  // Reject (delete) a note. Same shape as handleApprove, but:
  //   1. window.confirm("Reject this note?") first — return early if cancelled.
  //   2. DELETE `${BACKEND}/api/peer-notes/${id}`, headers: getAdminAuthHeader().
  //   3. Same handleUnauthorized / error-handling / remove-from-list pattern
  //      as handleApprove above.
  async function handleReject(id) {
    const confirmed = window.confirm("Reject this note?");

    if (!confirmed) return;

    try {
      const res = await fetch(`${BACKEND}/api/peer-notes/${id}`, {
        method: "DELETE",
        headers: getAdminAuthHeader(),
      });

      if (await handleUnauthorized(res)) return;

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setListError(data.error ?? "Could not reject note.");
        return;
      }

      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to reject note:", error);
      setListError("Could not reject note.");
    }
  }

  if (checking) return null;
  if (!authorized) return <Navigate to="/admin/login" replace />;

  return (
    <div className="container" style={{ padding: "36px 24px 80px" }}>
      {/* Admin tab bar */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "var(--border-w) solid var(--border)",
          marginBottom: 28,
        }}
      >
        {ADMIN_TABS.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: pathname === path ? "var(--gold)" : "var(--text-3)",
              borderBottom:
                pathname === path
                  ? "2px solid var(--gold)"
                  : "2px solid transparent",
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
          Peer Notes Moderation
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

      <div className="card" style={{ padding: "20px 22px" }}>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 17,
            color: "var(--heading)",
            marginBottom: 14,
          }}
        >
          Pending notes ({notes.length})
        </h2>

        {listError && (
          <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>
            {listError}
          </div>
        )}
        {listLoading && (
          <div style={{ color: "var(--text-3)", fontSize: 13 }}>Loading…</div>
        )}
        {!listLoading && notes.length === 0 && !listError && (
          <div style={{ color: "var(--text-3)", fontSize: 13 }}>
            Nothing pending review.
          </div>
        )}

        <div style={{ display: "grid", gap: 8 }}>
          {notes.map((note) => (
            <div
              key={note.id}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "var(--border-w) solid var(--border)",
                background: "var(--surface2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--heading)",
                    margin: "0 0 4px",
                  }}
                >
                  {note.title}
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={badgeStyle}>{note.subject_code}</span>
                  <span style={badgeStyle}>
                    {note.is_anonymous ? "Anonymous" : note.uploader_name}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <a
                  href={note.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={viewButtonStyle}
                >
                  View
                </a>
                <button
                  onClick={() => handleApprove(note.id)}
                  style={addButtonStyle}
                >
                  Add
                </button>
                <button
                  onClick={() => handleReject(note.id)}
                  style={rejectButtonStyle}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
