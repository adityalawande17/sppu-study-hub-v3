import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useSEO } from "../hooks/useSEO";
import { getAuthHeader } from "../utils/supabaseAuth";
import ProfileForm from "../components/ProfileForm";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function Onboarding() {
  useSEO({
    title: "Set up your profile - SPPUStudyHub",
    description: "Tell us your branch and semester to personalise your dashboard.",
  });

  const navigate = useNavigate();
  const { user, sessionLoading, profile, profileLoading, setProfile } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (sessionLoading || profileLoading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (profile) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(payload) {
    setSubmitting(true);
    setError(null);
    try {
      const authHeader = await getAuthHeader();
      const res = await fetch(`${BACKEND}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save profile.");
      setProfile(data.profile);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: 480, padding: "32px 28px" }}>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 22,
            color: "var(--heading)",
            marginBottom: 4,
          }}
        >
          Set up your profile
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>
          This personalises your dashboard — subjects, progress, and CGPA
          tracking for your branch and semester. You can change this anytime.
        </p>

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

        <ProfileForm
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Save & Continue"
        />
      </div>
    </div>
  );
}
