import { useState, useEffect } from "react";
import PeerNotesUpload from "./PeerNotesUpload";
import { useApp } from "../context/AppContext";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const cardStyle = {
  background: "var(--surface2)",
  border: "var(--border-w) solid var(--border)",
  borderRadius: 10,
  padding: "14px 16px",
};

export default function PeerNotes({ subjectCode, pattern }) {
  const { user, signInWithGoogle } = useApp();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  // ── YOUR FUNCTION ──────────────────────────────────────────────
  // Fetch approved notes for this subject when the component mounts (and
  // whenever subjectCode changes). Steps:
  //   1. If !BACKEND (VITE_BACKEND_URL isn't set), setUnavailable(true) and
  //      setLoading(false), then return early — don't attempt a fetch at all.
  //   2. Otherwise, GET `${BACKEND}/api/peer-notes?subjectCode=${subjectCode}`.
  //   3. On success (res.ok): parse the JSON, setNotes(data.notes).
  //   4. On ANY failure — network error (fetch throws), or res.ok is false —
  //      setUnavailable(true). This is the important rule from the plan:
  //      the public site must keep working with the backend down, so this
  //      section needs to disappear silently, not show a broken error state.
  //      Don't render an error message here — the `if (unavailable) return null`
  //      below already handles making the whole section vanish.
  //   5. Always setLoading(false) in a finally block, whichever path you took.
  useEffect(() => {
    async function fetchNotes() {
      if (!BACKEND) {
        setUnavailable(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${BACKEND}/api/peer-notes?subjectCode=${encodeURIComponent(
            subjectCode,
          )}`,
        );

        if (!res.ok) {
          setUnavailable(true);
          return;
        }

        const data = await res.json();
        setNotes(data.notes);
      } catch (error) {
        console.error("Failed to fetch peer notes", error);
        setUnavailable(true);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [subjectCode]);

  function handleUploadClick() {
    if (!user) {
      signInWithGoogle(window.location.pathname);
      return;
    }
    setUploadOpen(true);
  }

  function handleUploaded() {
    // The newly uploaded note isn't approved yet, so it won't appear in
    // `notes` (which only ever holds approved notes from the GET route)
    // until an admin approves it. Nothing to update here — the upload
    // modal already shows its own "submitted" state before closing.
  }

  if (unavailable) return null;

  return (
    <div className="mat-section">
      <div className="mat-section-head">
        <div className="mat-section-title">
          Student Notes {!loading && `(${notes.length})`}
        </div>
        <button onClick={handleUploadClick} className="btn btn-outline">
          Upload Notes
        </button>
      </div>

      <div className="mat-section-body">
        {loading && (
          <div style={{ color: "var(--text-3)", fontSize: 13 }}>Loading…</div>
        )}

        {!loading && notes.length === 0 && (
          <div style={{ color: "var(--text-3)", fontSize: 13 }}>
            Be the first to upload notes for this subject
          </div>
        )}

        {!loading && notes.length > 0 && (
          <div style={{ display: "grid", gap: 10 }}>
            {notes.map((note) => (
              <div key={note.id} style={cardStyle}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--heading)",
                    marginBottom: 4,
                  }}
                >
                  {note.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-3)",
                    marginBottom: 8,
                  }}
                >
                  {note.is_anonymous ? "Anonymous" : note.uploader_name}
                </div>
                <a
                  href={note.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 13,
                    color: "var(--gold-dim)",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Download →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <PeerNotesUpload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        subjectCode={subjectCode}
        pattern={pattern}
        onUploaded={handleUploaded}
      />
    </div>
  );
}
