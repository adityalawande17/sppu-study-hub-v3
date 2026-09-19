import { useState } from "react";
import Modal from "./Modal";
import { useApp } from "../context/AppContext";
import { getAuthHeader } from "../utils/supabaseAuth";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "docx"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB, matches backend/routes/peerNotes.js
export const MAX_TITLE_LENGTH = 120;

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

export default function PeerNotesUpload({
  open,
  onClose,
  subjectCode,
  pattern,
  onUploaded,
}) {
  const { user } = useApp();

  const defaultName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "";

  const [title, setTitle] = useState("");
  const [uploaderName, setUploaderName] = useState(defaultName);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function resetForm() {
    setTitle("");
    setUploaderName(defaultName);
    setIsAnonymous(false);
    setFile(null);
    setError(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  // ── YOUR FUNCTION ──────────────────────────────────────────────
  // Validate a selected file client-side, mirroring backend/routes/peerNotes.js
  // exactly (same ALLOWED_EXTENSIONS, same MAX_FILE_SIZE):
  //   - extension (from selectedFile.name, case-insensitive) must be in
  //     ALLOWED_EXTENSIONS
  //   - selectedFile.size must be <= MAX_FILE_SIZE
  // Return an error message (string) if invalid, or null if it's fine.
  function validateFile(selectedFile) {
    const extension = selectedFile.name.split(".").pop().toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return "File type not supported.";
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return "File size must be 10MB or less";
    }
    return null;
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileError = validateFile(selectedFile);
    if (fileError) {
      setError(fileError);
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  }

  // ── YOUR FUNCTION ──────────────────────────────────────────────
  // Handle the actual submit. Steps:
  //   1. e.preventDefault()
  //   2. Validate before hitting the network — file required, title required
  //      and <= MAX_TITLE_LENGTH, uploaderName required unless isAnonymous.
  //      On any failure: setError(...) and return early.
  //   3. Build a FormData: file, subjectCode, title, isAnonymous (as the
  //      STRING "true"/"false" — that's what the backend checks against),
  //      and uploaderName ONLY when not anonymous (don't append it at all
  //      when isAnonymous is true).
  //   4. setSubmitting(true), clear any previous error first.
  //   5. POST to `${BACKEND}/api/peer-notes/upload`, headers from
  //      `await getAuthHeader()` (it's async — don't forget the await),
  //      body: the FormData. Do NOT set a Content-Type header yourself — the
  //      browser sets the multipart boundary automatically for FormData
  //      bodies, and setting it manually breaks that.
  //   6. On success (res.ok): resetForm(), call onUploaded(data.note), then
  //      onClose().
  //   7. On failure: setError(data.error ?? "Upload failed.").
  //   8. In a finally block: setSubmitting(false).
  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      setError("Please select a file.");
      return;
    }

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (title.trim().length > MAX_TITLE_LENGTH) {
      setError(`Title must be ${MAX_TITLE_LENGTH} characters or less`);
      return;
    }
    if (!isAnonymous && !uploaderName.trim()) {
      setError("Your name is required unless you upload anonymously");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("subjectCode", subjectCode);
    formData.append("title", title.trim());
    formData.append("isAnonymous", String(isAnonymous));

    if (!isAnonymous) {
      formData.append("uploaderName", uploaderName.trim());
    }
    setError(null);
    setSubmitting(true);

    try {
      const headers = await getAuthHeader();

      const res = await fetch(`${BACKEND}/api/peer-notes/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        resetForm();
        onUploaded(data.note);
        onClose();
      } else {
        setError(data.error ?? "Upload failed.");
      }
    } catch (error) {
      console.error("Peer note upload failed:", error);
      setError("Could not upload note.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Upload Notes">
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            placeholder="e.g. Unit 3 handwritten notes"
            style={inputStyle}
          />
        </div>

        {!isAnonymous && (
          <div>
            <label style={labelStyle}>Your name</label>
            <input
              type="text"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              style={inputStyle}
            />
          </div>
        )}

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "var(--text-3)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          Upload anonymously
        </label>

        <div>
          <label style={labelStyle}>
            File (PDF, JPG, PNG, or DOCX — max 10MB)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.docx"
            onChange={handleFileChange}
            style={{ fontSize: 13, fontFamily: "Inter, sans-serif" }}
          />
        </div>

        {error && (
          <div
            style={{
              color: "#f87171",
              fontSize: 13,
              padding: "8px 12px",
              background: "rgba(248,113,113,.08)",
              borderRadius: 8,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ padding: "10px 22px" }}
        >
          {submitting ? "Uploading…" : "Upload"}
        </button>
      </form>
    </Modal>
  );
}
