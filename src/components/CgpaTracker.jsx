import { useState, useEffect } from "react";
import { getAuthHeader } from "../utils/supabaseAuth";
import { YEARS, semesterFor } from "../utils/semester";
import {
  averageSgpa,
  percentageFromCgpa,
  yearCgpa,
  classLabel,
  neededSgpaForTarget,
} from "../utils/cgpa";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const inputStyle = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 7,
  border: "1px solid var(--border)",
  background: "var(--surface2)",
  color: "var(--text)",
  fontSize: 12,
  fontFamily: "Inter, sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: 10,
  fontWeight: 600,
  color: "var(--text-3)",
  marginBottom: 4,
};

function StatBox({ label, value }) {
  return (
    <div className="card" style={{ padding: "10px 10px", textAlign: "center" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--heading)" }}>{value}</div>
      <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function CgpaTracker() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const authHeader = await getAuthHeader();
        const res = await fetch(`${BACKEND}/api/academic`, { headers: authHeader });
        const data = res.ok ? await res.json() : { records: [] };
        const initial = {};
        (data.records ?? []).forEach((r) => {
          initial[r.semester] = String(r.sgpa);
        });
        setValues(initial);
      } catch {
        // leave blank on failure
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleChange(sem, val) {
    setValues((prev) => ({ ...prev, [sem]: val }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const authHeader = await getAuthHeader();
      const entries = Object.entries(values).filter(([, v]) => v !== "" && v != null);
      for (const [sem, val] of entries) {
        const sgpa = parseFloat(val);
        if (!Number.isFinite(sgpa) || sgpa < 0 || sgpa > 10) continue;
        await fetch(`${BACKEND}/api/academic`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify({ semester: parseInt(sem, 10), sgpa }),
        });
      }
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } catch {
      setError("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const records = Object.entries(values)
    .filter(([, v]) => v !== "" && v != null && Number.isFinite(parseFloat(v)))
    .map(([sem, v]) => ({ semester: parseInt(sem, 10), sgpa: parseFloat(v) }));

  const overallCgpa = averageSgpa(records);
  const overallPct = percentageFromCgpa(overallCgpa);
  const overallClass = classLabel(overallPct);
  const distinctionTarget = neededSgpaForTarget(records, 70);

  if (loading) {
    return (
      <div className="card" style={{ padding: "14px 16px" }}>
        <p style={{ color: "var(--text-3)", fontSize: 12 }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "14px 16px" }}>
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 16,
          color: "var(--heading)",
          marginBottom: 12,
        }}
      >
        CGPA Tracker
      </h2>

      <form onSubmit={handleSave}>
        {YEARS.map((year) => (
          <div key={year} style={{ marginBottom: 8 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                color: "var(--text-4)",
                marginBottom: 5,
              }}
            >
              {year}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2].map((half) => {
                const sem = semesterFor(year, half);
                return (
                  <div key={sem} style={{ flex: 1 }}>
                    <label style={labelStyle}>Semester {sem}</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.01}
                      value={values[sem] ?? ""}
                      onChange={(e) => handleChange(sem, e.target.value)}
                      placeholder="SGPA"
                      style={inputStyle}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {error && (
          <div
            style={{
              color: "#f87171",
              fontSize: 12,
              marginBottom: 10,
              padding: "6px 10px",
              background: "rgba(248,113,113,.08)",
              borderRadius: 7,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: "7px 16px", fontSize: 13 }}>
            {saving ? "Saving…" : "Save"}
          </button>
          {savedFlash && (
            <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>Saved.</span>
          )}
        </div>
      </form>

      {records.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <StatBox label="Overall CGPA" value={overallCgpa.toFixed(2)} />
            <StatBox label="Percentage" value={`${overallPct.toFixed(1)}%`} />
            <StatBox label="Class" value={overallClass} />
          </div>

          <div style={{ display: "grid", gap: 3, marginBottom: 12 }}>
            {YEARS.map((year) => {
              const cgpa = yearCgpa(records, year);
              if (cgpa === null) return null;
              return (
                <div
                  key={year}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "var(--text-3)",
                  }}
                >
                  <span>{year} CGPA</span>
                  <span>
                    {cgpa.toFixed(2)} ({percentageFromCgpa(cgpa).toFixed(1)}%)
                  </span>
                </div>
              );
            })}
          </div>

          {!distinctionTarget.achieved && distinctionTarget.remaining > 0 && (
            <div
              style={{
                fontSize: 11,
                color: "var(--text-3)",
                padding: "7px 9px",
                background: "var(--gold-pale)",
                borderRadius: 7,
              }}
            >
              {distinctionTarget.alreadyGuaranteed
                ? "You're already guaranteed a Distinction based on entered SGPAs."
                : distinctionTarget.achievable
                  ? `Need an average SGPA of ${distinctionTarget.neededAvg.toFixed(2)} in your remaining ${distinctionTarget.remaining} semester(s) for a Distinction.`
                  : "Distinction is no longer mathematically achievable based on entered SGPAs."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
