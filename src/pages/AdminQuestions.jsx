import { useState, useEffect, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { searchIndex } from "../data/branches";
import { feSearchIndex } from "../data/feSubjects";
import {
  getAdminToken,
  clearAdminToken,
  getAdminAuthHeader,
} from "../utils/adminAuth";

const BACKEND = import.meta.env.VITE_BACKEND_URL;
const allSubjects = [...feSearchIndex, ...searchIndex];

const EXAM_MONTHS = ["May", "November"];
const QUESTION_TYPES = ["long", "short", "numerical", "OR"];

function semesterNumber(sem) {
  const match = /\d+/.exec(sem || "");
  return match ? parseInt(match[0], 10) : null;
}

const inputStyle = {
  width: "100%",
  padding: "9px 11px",
  borderRadius: 8,
  border: "1px solid var(--border)",
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

export default function AdminQuestions() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [filter, setFilter] = useState("");
  const [selectedCode, setSelectedCode] = useState("");

  const [questions, setQuestions] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);

  const [form, setForm] = useState({
    unit: "",
    questionText: "",
    marks: "",
    examYear: "",
    examMonth: "",
    questionType: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successFlash, setSuccessFlash] = useState(false);

  // ── Auth check ──────────────────────────────────────────────
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

  const selectedSubject = useMemo(
    () => allSubjects.find((s) => s.code === selectedCode) ?? null,
    [selectedCode],
  );

  const filteredSubjects = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return allSubjects;
    return allSubjects.filter(
      (s) =>
        s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
    );
  }, [filter]);

  // ── Load existing questions when a subject is selected ────────
  useEffect(() => {
    if (!selectedCode) {
      setQuestions([]);
      return;
    }
    setListLoading(true);
    setListError(null);
    fetch(`${BACKEND}/api/questions/${selectedCode}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load questions."))))
      .then((data) => setQuestions(data.questions ?? []))
      .catch((err) => setListError(err.message))
      .finally(() => setListLoading(false));
  }, [selectedCode]);

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedSubject) {
      setFormError("Pick a subject first.");
      return;
    }
    if (!form.questionText.trim()) {
      setFormError("Question text is required.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setSuccessFlash(false);

    try {
      const res = await fetch(`${BACKEND}/api/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeader(),
        },
        body: JSON.stringify({
          subjectCode: selectedSubject.code,
          subjectName: selectedSubject.name,
          year: selectedSubject.yearKey,
          semester: semesterNumber(selectedSubject.sem),
          credits: selectedSubject.credits ?? null,
          pattern: selectedSubject.pattern,
          unit: form.unit ? parseInt(form.unit, 10) : null,
          questionText: form.questionText.trim(),
          marks: form.marks ? parseInt(form.marks, 10) : null,
          examYear: form.examYear ? parseInt(form.examYear, 10) : null,
          examMonth: form.examMonth || null,
          questionType: form.questionType || null,
        }),
      });

      if (await handleUnauthorized(res)) return;

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not add question.");

      setQuestions((prev) => [data.question, ...prev]);
      setForm((prev) => ({ ...prev, questionText: "", marks: "" }));
      setSuccessFlash(true);
      setTimeout(() => setSuccessFlash(false), 2000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this question?")) return;
    try {
      const res = await fetch(`${BACKEND}/api/questions/${id}`, {
        method: "DELETE",
        headers: getAdminAuthHeader(),
      });
      if (await handleUnauthorized(res)) return;
      if (!res.ok) throw new Error("Could not delete question.");
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setListError(err.message);
    }
  }

  if (checking) return null;
  if (!authorized) return <Navigate to="/admin/login" replace />;

  return (
    <div className="container" style={{ padding: "36px 24px 80px" }}>
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
          PYQ Question Manager
        </h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid var(--border)",
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

      {/* Subject picker */}
      <div className="card" style={{ padding: "20px 22px", marginBottom: 20 }}>
        <label style={labelStyle}>Search subject (code or name)</label>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="e.g. PCC-201-COM or Data Structures"
          style={{ ...inputStyle, marginBottom: 12 }}
        />
        <label style={labelStyle}>Subject</label>
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          style={inputStyle}
        >
          <option value="">— Select a subject —</option>
          {filteredSubjects.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name} ({s.code}) · {s.branch} {s.yearKey} · {s.pattern}
            </option>
          ))}
        </select>
      </div>

      {selectedSubject && (
        <>
          {/* Add question form */}
          <form
            onSubmit={handleSubmit}
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
              Add question — {selectedSubject.name}
            </h2>

            <label style={labelStyle}>Question text</label>
            <textarea
              value={form.questionText}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, questionText: e.target.value }))
              }
              rows={3}
              required
              style={{ ...inputStyle, marginBottom: 14, resize: "vertical" }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <label style={labelStyle}>Unit</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={form.unit}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Marks</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.marks}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, marks: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Exam year</label>
                <input
                  type="number"
                  min={2015}
                  max={2030}
                  value={form.examYear}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, examYear: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Exam month</label>
                <select
                  value={form.examMonth}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, examMonth: e.target.value }))
                  }
                  style={inputStyle}
                >
                  <option value="">—</option>
                  {EXAM_MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Question type</label>
                <select
                  value={form.questionType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      questionType: e.target.value,
                    }))
                  }
                  style={inputStyle}
                >
                  <option value="">—</option>
                  {QUESTION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formError && (
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
                {formError}
              </div>
            )}
            {successFlash && (
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
                Question added.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: "10px 22px" }}
            >
              {submitting ? "Adding…" : "Add question"}
            </button>
          </form>

          {/* Existing questions */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 17,
                color: "var(--heading)",
                marginBottom: 14,
              }}
            >
              Existing questions ({questions.length})
            </h2>

            {listError && (
              <div style={{ color: "#f87171", fontSize: 13 }}>{listError}</div>
            )}
            {listLoading && (
              <div style={{ color: "var(--text-3)", fontSize: 13 }}>
                Loading…
              </div>
            )}
            {!listLoading && questions.length === 0 && !listError && (
              <div style={{ color: "var(--text-3)", fontSize: 13 }}>
                No questions stored for this subject yet.
              </div>
            )}

            <div style={{ display: "grid", gap: 8 }}>
              {questions.map((q) => (
                <div
                  key={q.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "var(--surface2)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text)",
                        margin: "0 0 6px",
                        lineHeight: 1.55,
                      }}
                    >
                      {q.question_text}
                    </p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {q.unit && (
                        <span style={badgeStyle}>Unit {q.unit}</span>
                      )}
                      {q.marks && <span style={badgeStyle}>{q.marks}M</span>}
                      {q.exam_year && (
                        <span style={badgeStyle}>
                          {q.exam_month ? `${q.exam_month} ` : ""}
                          {q.exam_year}
                        </span>
                      )}
                      {q.question_type && (
                        <span style={badgeStyle}>{q.question_type}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(q.id)}
                    style={{
                      flexShrink: 0,
                      padding: "6px 12px",
                      borderRadius: 7,
                      border: "1px solid rgba(248,113,113,.3)",
                      background: "rgba(248,113,113,.08)",
                      color: "#f87171",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const badgeStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text-3)",
  background: "var(--surface3)",
  padding: "2px 8px",
  borderRadius: 10,
};
