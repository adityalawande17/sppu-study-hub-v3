import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { saveToHistory } from "../utils/aiHistory";
import { getAuthHeader } from "../utils/supabaseAuth";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

function DlIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function AIIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12 8 12 12 14 14" />
      <path d="M3.05 11a9 9 0 1 0 .5-4.5" />
      <polyline points="3 3 3 9 9 9" />
    </svg>
  );
}

function matchesPaper(q, paper) {
  if (q.exam_year !== parseInt(paper.year)) return false;
  if (!q.exam_month) return false;
  return paper.exam.toLowerCase().includes(q.exam_month.toLowerCase());
}

export default function PYQAccordion({ pyq, subjectCode, subjectName }) {
  const { user, signInWithGoogle } = useApp();
  const [activeIdx, setActiveIdx] = useState(null);
  const [dbQuestions, setDbQuestions] = useState([]);
  const [aiStates, setAiStates] = useState({});
  const [paperAiStates, setPaperAiStates] = useState({});
  const [doneQuestionIds, setDoneQuestionIds] = useState(new Set());

  useEffect(() => {
    if (!BACKEND) return;
    fetch(`${BACKEND}/api/questions/${subjectCode}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.questions?.length) setDbQuestions(data.questions); })
      .catch(() => {});
  }, [subjectCode]);

  useEffect(() => {
    if (!BACKEND || !user) return;
    (async () => {
      const authHeader = await getAuthHeader();
      fetch(`${BACKEND}/api/progress/${subjectCode}`, { headers: authHeader })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => { if (data?.questionIds) setDoneQuestionIds(new Set(data.questionIds)); })
        .catch(() => {});
    })();
  }, [subjectCode, user]);

  async function toggleQuestionDone(questionId) {
    const wasDone = doneQuestionIds.has(questionId);
    setDoneQuestionIds((prev) => {
      const next = new Set(prev);
      if (wasDone) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
    try {
      const authHeader = await getAuthHeader();
      await fetch(`${BACKEND}/api/progress/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ questionId, completed: !wasDone }),
      });
    } catch {
      // revert on failure
      setDoneQuestionIds((prev) => {
        const next = new Set(prev);
        if (wasDone) next.add(questionId);
        else next.delete(questionId);
        return next;
      });
    }
  }

  // Lock body scroll when panel is open
  useEffect(() => {
    if (activeIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeIdx]);

  function handleClose() {
    if (activeIdx !== null) {
      setPaperAiStates((prev) => ({ ...prev, [activeIdx]: {} }));
      setAiStates({});
    }
    setActiveIdx(null);
  }

  async function streamAI(body, onChunk) {
    const authHeader = await getAuthHeader();
    const res = await fetch(`${BACKEND}/api/ai/explain/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Request failed");
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";
    outer: while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        let parsed;
        try { parsed = JSON.parse(line.slice(6)); } catch { continue; }
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.done) break outer;
        if (parsed.text) { fullText += parsed.text; onChunk(fullText); }
      }
    }
    return fullText;
  }

  async function explainQuestion(qId, questionText, marks, unit, paper) {
    setAiStates((prev) => ({ ...prev, [qId]: { ...prev[qId], loading: true, error: null, answer: null } }));
    try {
      const fullAnswer = await streamAI(
        {
          questionText, subjectCode,
          marks: marks ? parseInt(marks) : null,
          unit: unit ? parseInt(unit) : null,
          examYear: paper?.year ? parseInt(paper.year) : null,
          examMonth: paper?.exam ? paper.exam.split(" ")[0] : null,
        },
        (partial) => setAiStates((prev) => ({ ...prev, [qId]: { ...prev[qId], loading: false, answer: partial } }))
      );
      setAiStates((prev) => ({ ...prev, [qId]: { ...prev[qId], loading: false, answer: fullAnswer } }));
      saveToHistory({
        question: questionText, answer: fullAnswer, cached: false,
        subjectCode, subjectName,
        paperExam: paper?.exam ?? null, paperYear: paper?.year ?? null,
        marks: marks ? parseInt(marks) : null, unit: unit ? parseInt(unit) : null,
      }, user).catch(() => {});
    } catch (err) {
      setAiStates((prev) => ({ ...prev, [qId]: { ...prev[qId], loading: false, error: err.message } }));
    }
  }

  async function explainForPaper(idx, paper) {
    const s = paperAiStates[idx] ?? {};
    if (!s.question?.trim()) return;
    setPaperAiStates((prev) => ({ ...prev, [idx]: { ...prev[idx], loading: true, answer: null, error: null } }));
    try {
      const fullAnswer = await streamAI(
        {
          questionText: s.question.trim(), subjectCode,
          marks: s.marks ? parseInt(s.marks) : null,
          unit: s.unit ? parseInt(s.unit) : null,
          examYear: paper?.year ? parseInt(paper.year) : null,
          examMonth: paper?.exam ? paper.exam.split(" ")[0] : null,
        },
        (partial) => setPaperAiStates((prev) => ({ ...prev, [idx]: { ...prev[idx], answer: partial } }))
      );
      setPaperAiStates((prev) => ({ ...prev, [idx]: { ...prev[idx], loading: false, answer: fullAnswer } }));
      saveToHistory({
        question: s.question.trim(), answer: fullAnswer, cached: false,
        subjectCode, subjectName,
        paperExam: paper?.exam ?? null, paperYear: paper?.year ?? null,
        marks: s.marks ? parseInt(s.marks) : null, unit: s.unit ? parseInt(s.unit) : null,
      }, user).catch(() => {});
    } catch (err) {
      setPaperAiStates((prev) => ({ ...prev, [idx]: { ...prev[idx], loading: false, error: err.message } }));
    }
  }

  const activePaper = activeIdx !== null ? pyq[activeIdx] : null;
  const activeQuestions = activePaper ? dbQuestions.filter((q) => matchesPaper(q, activePaper)) : [];
  const ps = activeIdx !== null ? (paperAiStates[activeIdx] ?? {}) : {};

  return (
    <>
      {/* Chip grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
        gap: 10,
      }}>
        {pyq.map((p, i) => {
          const isActive = activeIdx === i;
          return (
            <div
              key={i}
              style={{
                border: `1px solid ${isActive ? "rgba(124,58,237,.4)" : "var(--border)"}`,
                borderRadius: 10,
                padding: 14,
                background: isActive ? "rgba(124,58,237,.06)" : "var(--surface2)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "var(--gold-dim)";
                  e.currentTarget.style.background = "var(--gold-pale)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "var(--surface2)";
                }
              }}
            >
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "var(--heading)" }}>
                {p.year}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5, flex: 1 }}>
                End Semester<br />{p.exam}
              </div>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "7px 0",
                  background: "var(--navy)", color: "#fff",
                  borderRadius: 8, fontSize: 12, fontWeight: 500,
                  fontFamily: "Inter, sans-serif", textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 5, transition: "opacity .15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = ".82")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <DlIcon /> Download
              </a>
              <button
                onClick={() => setActiveIdx(isActive ? null : i)}
                style={{
                  padding: "6px 0",
                  background: isActive ? "rgba(124,58,237,.15)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(124,58,237,.4)" : "var(--border)"}`,
                  borderRadius: 8, fontSize: 11, fontWeight: 600,
                  color: isActive ? "#a78bfa" : "var(--text-3)",
                  cursor: "pointer", fontFamily: "Inter, sans-serif",
                  width: "100%", transition: "all .15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                <AIIcon /> Ask AI
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: 0.4,
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  color: "#fff", padding: "1px 5px", borderRadius: 5,
                  lineHeight: 1.5,
                }}>
                  BETA
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Slide-in AI panel */}
      {activeIdx !== null && activePaper && (
        <>
          <style>{`
            @keyframes pyq-slide-in {
              from { transform: translateX(100%); opacity: 0; }
              to   { transform: translateX(0);    opacity: 1; }
            }
            @keyframes pyq-fade-in {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
          `}</style>

          {/* Backdrop */}
          <div
            onClick={handleClose}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,.45)",
              zIndex: 1000,
              animation: "pyq-fade-in .2s ease",
            }}
          />

          {/* Panel */}
          <div style={{
            position: "fixed",
            top: 0, right: 0,
            width: "min(460px, 100vw)",
            height: "100dvh",
            background: "var(--bg, #0f1117)",
            borderLeft: "1px solid rgba(124,58,237,.25)",
            zIndex: 1001,
            display: "flex",
            flexDirection: "column",
            boxShadow: "-16px 0 48px rgba(0,0,0,.4)",
            animation: "pyq-slide-in .25s cubic-bezier(.16,1,.3,1)",
          }}>

            {/* Panel header */}
            <div style={{
              padding: "18px 20px 14px",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <AIIcon size={15} />
                    <span style={{
                      fontSize: 15, fontWeight: 700,
                      color: "var(--heading)", fontFamily: "Inter, sans-serif",
                    }}>
                      Ask AI
                    </span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                      color: "#fff", padding: "2px 6px", borderRadius: 5,
                    }}>
                      BETA
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 6 }}>
                    End Semester · {activePaper.exam}
                  </div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 11, color: "var(--text-4)",
                    background: "rgba(124,58,237,.08)",
                    border: "1px solid rgba(124,58,237,.2)",
                    borderRadius: 7, padding: "3px 9px",
                  }}>
                    <HistoryIcon />
                    Explanations saved to{" "}
                    <Link
                      to="/history"
                      onClick={handleClose}
                      style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 600 }}
                    >
                      AI History
                    </Link>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  title="Close"
                  style={{
                    flexShrink: 0,
                    width: 32, height: 32,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid var(--border)", borderRadius: 8,
                    background: "transparent", color: "var(--text-3)",
                    cursor: "pointer", fontSize: 18, lineHeight: 1,
                    transition: "all .15s", fontFamily: "Inter, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#f87171";
                    e.currentTarget.style.color = "#f87171";
                    e.currentTarget.style.background = "rgba(248,113,113,.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-3)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
              {!user ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>
                    <AIIcon size={32} />
                  </div>
                  <p style={{ color: "var(--text-3)", fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
                    Sign in to get AI explanations for<br />questions from this paper
                  </p>
                  <button
                    onClick={() => signInWithGoogle(window.location.pathname)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "10px 22px", borderRadius: 9,
                      border: "1px solid var(--border)", background: "var(--surface2)",
                      color: "var(--text)", fontSize: 13, fontWeight: 600,
                      cursor: "pointer", fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Sign in with Google
                  </button>
                </div>
              ) : (
                <>
                  {/* DB questions for this paper */}
                  {activeQuestions.length > 0 && (
                    <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
                      <p style={{ fontSize: 11, color: "var(--text-4)", margin: "0 0 4px", fontWeight: 600, letterSpacing: 0.2 }}>
                        QUESTIONS FROM THIS PAPER
                      </p>
                      {activeQuestions.map((q) => {
                        const as = aiStates[q.id] ?? {};
                        const isDone = doneQuestionIds.has(q.id);
                        return (
                          <div key={q.id} style={{
                            padding: "10px 12px", borderRadius: 10,
                            border: `1px solid ${isDone ? "rgba(34,197,94,.35)" : "var(--border)"}`,
                            background: isDone ? "rgba(34,197,94,.06)" : "var(--surface2)",
                            display: "flex", flexDirection: "column", gap: 8,
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                              <label style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: 1, cursor: "pointer" }}>
                                <input
                                  type="checkbox"
                                  checked={isDone}
                                  onChange={() => toggleQuestionDone(q.id)}
                                  style={{ marginTop: 3, flexShrink: 0, cursor: "pointer" }}
                                  title="Mark as done"
                                />
                                <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.65, margin: 0 }}>
                                  {q.question_text}
                                </p>
                              </label>
                              <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                                {q.marks && (
                                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", background: "var(--surface3)", padding: "2px 7px", borderRadius: 10 }}>
                                    {q.marks}M
                                  </span>
                                )}
                                {q.unit && (
                                  <span style={{ fontSize: 11, color: "var(--text-4)", background: "var(--surface3)", padding: "2px 7px", borderRadius: 10 }}>
                                    U{q.unit}
                                  </span>
                                )}
                              </div>
                            </div>
                            {as.answer ? (
                              <div style={{ borderLeft: "3px solid #7c3aed", borderRadius: "0 8px 8px 0", padding: "10px 14px", background: "rgba(124,58,237,.07)" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", letterSpacing: 0.3, marginBottom: 8 }}>AI ANSWER</div>
                                <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text)", margin: 0, whiteSpace: "pre-wrap" }}>{as.answer}</p>
                              </div>
                            ) : (
                              <button
                                onClick={() => explainQuestion(q.id, q.question_text, q.marks, q.unit, activePaper)}
                                disabled={as.loading}
                                style={{
                                  alignSelf: "flex-start",
                                  display: "flex", alignItems: "center", gap: 5,
                                  padding: "5px 12px", borderRadius: 7,
                                  border: "1px solid rgba(124,58,237,.3)",
                                  background: "rgba(124,58,237,.08)",
                                  color: "#a78bfa", fontSize: 12, fontWeight: 600,
                                  cursor: as.loading ? "not-allowed" : "pointer",
                                  fontFamily: "Inter, sans-serif",
                                  opacity: as.loading ? 0.7 : 1,
                                }}
                              >
                                {as.loading ? "Generating…" : <><AIIcon /> Explain</>}
                              </button>
                            )}
                            {as.error && (
                              <div style={{ color: "#f87171", fontSize: 12, padding: "6px 10px", background: "rgba(248,113,113,.08)", borderRadius: 7 }}>
                                {as.error}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Free-form textarea */}
                  {activeQuestions.length > 0 && (
                    <p style={{ fontSize: 11, color: "var(--text-4)", margin: "0 0 8px", fontWeight: 600, letterSpacing: 0.2 }}>
                      OR TYPE YOUR OWN QUESTION
                    </p>
                  )}
                  <textarea
                    value={ps.question ?? ""}
                    onChange={(e) => setPaperAiStates((prev) => ({ ...prev, [activeIdx]: { ...prev[activeIdx], question: e.target.value } }))}
                    placeholder="Type or paste a question from this paper…"
                    rows={4}
                    style={{
                      width: "100%", resize: "vertical",
                      padding: "10px 12px", borderRadius: 8,
                      border: "1px solid rgba(124,58,237,.3)",
                      background: "var(--surface2)", color: "var(--text)",
                      fontSize: 13, fontFamily: "Inter, sans-serif",
                      outline: "none", boxSizing: "border-box", lineHeight: 1.6,
                    }}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <input
                      type="number"
                      value={ps.marks ?? ""}
                      onChange={(e) => setPaperAiStates((prev) => ({ ...prev, [activeIdx]: { ...prev[activeIdx], marks: e.target.value } }))}
                      placeholder="Marks (e.g. 6)"
                      min={1} max={20}
                      style={{
                        width: 130, padding: "8px 10px", borderRadius: 8,
                        border: "1px solid var(--border)", background: "var(--surface2)",
                        color: "var(--text)", fontSize: 13, fontFamily: "Inter, sans-serif", outline: "none",
                      }}
                    />
                    <input
                      type="number"
                      value={ps.unit ?? ""}
                      onChange={(e) => setPaperAiStates((prev) => ({ ...prev, [activeIdx]: { ...prev[activeIdx], unit: e.target.value } }))}
                      placeholder="Unit (e.g. 3)"
                      min={1} max={8}
                      style={{
                        width: 120, padding: "8px 10px", borderRadius: 8,
                        border: "1px solid var(--border)", background: "var(--surface2)",
                        color: "var(--text)", fontSize: 13, fontFamily: "Inter, sans-serif", outline: "none",
                      }}
                    />
                    <button
                      onClick={() => explainForPaper(activeIdx, activePaper)}
                      disabled={ps.loading || !ps.question?.trim()}
                      style={{
                        padding: "8px 20px", borderRadius: 8,
                        background: ps.loading || !ps.question?.trim() ? "var(--surface3)" : "#7c3aed",
                        color: ps.loading || !ps.question?.trim() ? "var(--text-4)" : "#fff",
                        border: "none", fontSize: 13, fontWeight: 600,
                        cursor: ps.loading || !ps.question?.trim() ? "not-allowed" : "pointer",
                        fontFamily: "Inter, sans-serif", transition: "all .15s",
                      }}
                    >
                      {ps.loading ? "Generating…" : "Explain"}
                    </button>
                    <span style={{ fontSize: 11, color: "var(--text-4)", marginLeft: "auto" }}>3 free / day</span>
                  </div>

                  {ps.error && (
                    <div style={{ color: "#f87171", fontSize: 13, marginTop: 12, padding: "8px 12px", background: "rgba(248,113,113,.08)", borderRadius: 8 }}>
                      {ps.error}
                    </div>
                  )}

                  {ps.answer && (
                    <div style={{
                      marginTop: 14, borderLeft: "3px solid #7c3aed",
                      borderRadius: "0 8px 8px 0", padding: "12px 16px",
                      background: "rgba(124,58,237,.07)",
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", letterSpacing: 0.3, marginBottom: 8 }}>AI ANSWER</div>
                      <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text)", margin: 0, whiteSpace: "pre-wrap" }}>
                        {ps.answer}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
