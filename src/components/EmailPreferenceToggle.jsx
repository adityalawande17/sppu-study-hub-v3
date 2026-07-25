import { useState, useEffect } from "react";
import { getAuthHeader } from "../utils/supabaseAuth";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function EmailPreferenceToggle() {
  const [optedOut, setOptedOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const authHeader = await getAuthHeader();
        const res = await fetch(`${BACKEND}/api/announcements/preferences`, {
          headers: authHeader,
        });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setOptedOut(data.optedOut);
        }
      } catch {
        // leave default (subscribed) on failure
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggle() {
    const next = !optedOut;
    setSaving(true);
    setOptedOut(next);
    try {
      const authHeader = await getAuthHeader();
      await fetch(`${BACKEND}/api/announcements/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ optedOut: next }),
      });
    } catch {
      setOptedOut(!next);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div
      className="card"
      style={{
        padding: "16px 18px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--heading)" }}>
          Email announcements
        </div>
        <div style={{ fontSize: 12, color: "var(--text-3)" }}>
          Exam schedules, results, and important notices from SPPUStudyHUB.
        </div>
      </div>
      <button
        onClick={toggle}
        disabled={saving}
        style={{
          padding: "7px 14px",
          borderRadius: 8,
          border: "var(--border-w) solid var(--border)",
          background: optedOut ? "transparent" : "var(--gold-pale)",
          color: optedOut ? "var(--text-3)" : "var(--gold-dim)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "Inter, sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        {optedOut ? "Subscribe" : "Subscribed ✓"}
      </button>
    </div>
  );
}
