import { useState } from "react";
import { branchMeta } from "../data/branches";
import { YEARS, semesterFor, yearForSemester, halfForSemester } from "../utils/semester";

export default function ProfileForm({ initial, onSubmit, submitLabel, submitting }) {
  const [branch, setBranch] = useState(initial?.branch ?? "");
  const [pattern, setPattern] = useState(initial?.pattern ?? "2024");
  const [year, setYear] = useState(
    initial?.current_semester ? yearForSemester(initial.current_semester) : "",
  );
  const [half, setHalf] = useState(
    initial?.current_semester ? halfForSemester(initial.current_semester) : 1,
  );
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!branch || !year) {
      setError("Pick your branch and year.");
      return;
    }
    const currentSemester = semesterFor(year, half);
    setError(null);
    onSubmit({ branch, pattern, currentSemester });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label style={labelStyle}>Branch</label>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 8,
          marginBottom: 18,
        }}
      >
        {Object.values(branchMeta).map((b) => {
          const selected = branch === b.key;
          return (
            <button
              type="button"
              key={b.key}
              onClick={() => setBranch(b.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 12px",
                borderRadius: 10,
                border: `1px solid ${selected ? b.color : "var(--border)"}`,
                background: selected ? b.pale : "var(--surface2)",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "all .15s",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: b.color,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {b.abbr}
              </span>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>
                {b.short}
              </span>
            </button>
          );
        })}
      </div>

      <label style={labelStyle}>Pattern</label>
      <div className="pattern-pill" style={{ marginBottom: 18 }}>
        {["2019", "2024"].map((p) => (
          <button
            type="button"
            key={p}
            className={`pattern-opt ${pattern === p ? "active" : ""}`}
            onClick={() => setPattern(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <label style={labelStyle}>Year</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {YEARS.map((y) => (
          <button
            type="button"
            key={y}
            onClick={() => setYear(y)}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: `1px solid ${year === y ? "var(--gold-dim)" : "var(--border)"}`,
              background: year === y ? "var(--gold-pale)" : "var(--surface2)",
              color: year === y ? "var(--gold-dim)" : "var(--text)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all .15s",
            }}
          >
            {y}
          </button>
        ))}
      </div>

      {year && (
        <>
          <label style={labelStyle}>Which semester of {year}?</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {[1, 2].map((h) => (
              <button
                type="button"
                key={h}
                onClick={() => setHalf(h)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: `1px solid ${half === h ? "var(--gold-dim)" : "var(--border)"}`,
                  background: half === h ? "var(--gold-pale)" : "var(--surface2)",
                  color: half === h ? "var(--gold-dim)" : "var(--text)",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all .15s",
                }}
              >
                Semester {semesterFor(year, h)}
              </button>
            ))}
          </div>
        </>
      )}

      {error && (
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
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary"
        style={{ padding: "10px 22px" }}
      >
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--text-3)",
  marginBottom: 8,
};
