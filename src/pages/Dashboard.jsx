import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Link, Navigate } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { branchMeta } from "../data/branches";
import { semesterLabel } from "../utils/semester";
import { getAuthHeader } from "../utils/supabaseAuth";
import { getSubjectsFor } from "../utils/subjectLookup";
import { useSemesterProgress } from "../hooks/useSemesterProgress";
import { useQuickStats } from "../hooks/useQuickStats";
import PageLoader from "../components/PageLoader";
import ProfileForm from "../components/ProfileForm";
import SubjectProgressCard from "../components/SubjectProgressCard";
import CgpaTracker from "../components/CgpaTracker";
import ActivityHeatmap from "../components/ActivityHeatmap";
import EmailPreferenceToggle from "../components/EmailPreferenceToggle";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function Dashboard() {
  useSEO({
    title: "My Dashboard - SPPUStudyHub",
    description: "Your saved subjects and study activity on SPPUStudyHub.",
  });

  const { user, sessionLoading, signOut, saved, profile, profileLoading, setProfile } =
    useApp();
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const currentSubjects = profile
    ? getSubjectsFor(profile.branch, profile.current_semester, profile.pattern)
    : [];
  const { items: subjectProgress, loading: progressLoading, overallPct } =
    useSemesterProgress(currentSubjects);
  const { streak, activity, aiRemaining, aiLimit } = useQuickStats(!!user);

  if (sessionLoading || profileLoading)
    return (
      <div className="container" style={{ padding: "40px 24px 80px" }}>
        <PageLoader label="Loading your dashboard…" />
      </div>
    );
  if (!user) return <Navigate to="/" replace />;
  if (!profile) return <Navigate to="/onboarding" replace />;

  const displayName =
    user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Student";
  const avatarUrl = user.user_metadata?.avatar_url ?? null;
  const initial = displayName[0].toUpperCase();
  const branchInfo = branchMeta[profile.branch];

  async function handleProfileUpdate(payload) {
    setSavingProfile(true);
    setProfileError(null);
    try {
      const authHeader = await getAuthHeader();
      const res = await fetch(`${BACKEND}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save changes.");
      setProfile(data.profile);
      setEditingProfile(false);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <div className="container" style={{ padding: "40px 24px 80px" }}>

      {/* ── Two-column layout ── */}
      <div className="dash-layout" style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 36 }}>

        {/* ── LEFT COLUMN (1/3) ── */}
        <div className="dash-left" style={{ flex: "0 0 33%", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Profile card */}
          <div className="card" style={{ padding: "20px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
              <div
                style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, fontWeight: 700, color: "#fff",
                  flexShrink: 0, overflow: "hidden",
                  border: "3px solid var(--border)",
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : initial}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--heading)", lineHeight: 1.3 }}>
                  {displayName}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 3 }}>
                  {user.email}
                </div>
              </div>
              <button
                onClick={signOut}
                style={{
                  width: "100%", padding: "7px 0",
                  borderRadius: 8, border: "var(--border-w) solid var(--border)",
                  background: "transparent", color: "var(--text-3)",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "Inter, sans-serif", transition: "all .15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.color = "var(--text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-3)"; }}
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Branch + semester card */}
          <div className="card" style={{ padding: "18px 20px" }}>
            {!editingProfile ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  {branchInfo && (
                    <span
                      style={{
                        width: 36, height: 36, borderRadius: 9,
                        background: branchInfo.color, color: "#fff",
                        fontSize: 12, fontWeight: 700, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {branchInfo.abbr}
                    </span>
                  )}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--heading)", lineHeight: 1.3 }}>
                      {branchInfo?.short ?? profile.branch}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                      {semesterLabel(profile.current_semester)} · {profile.pattern} pattern
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setEditingProfile(true)}
                  style={{
                    width: "100%", padding: "7px 0",
                    borderRadius: 8, border: "var(--border-w) solid var(--border)",
                    background: "transparent", color: "var(--text-3)",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                    fontFamily: "Inter, sans-serif", transition: "all .15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.color = "var(--text)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-3)"; }}
                >
                  Change semester
                </button>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15, color: "var(--heading)" }}>
                    Update profile
                  </span>
                  <button
                    onClick={() => { setEditingProfile(false); setProfileError(null); }}
                    style={{ border: "none", background: "transparent", color: "var(--text-3)", fontSize: 12, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                  >
                    Cancel
                  </button>
                </div>
                {profileError && (
                  <div style={{ color: "#f87171", fontSize: 12, marginBottom: 12, padding: "7px 10px", background: "rgba(248,113,113,.08)", borderRadius: 7 }}>
                    {profileError}
                  </div>
                )}
                <ProfileForm
                  initial={profile}
                  onSubmit={handleProfileUpdate}
                  submitting={savingProfile}
                  submitLabel="Save"
                />
              </>
            )}
          </div>

          {/* CGPA Tracker */}
          <div style={{ flex: 1 }}>
            <CgpaTracker />
          </div>

          {/* Email preferences */}
          <EmailPreferenceToggle />

        </div>

        {/* ── RIGHT COLUMN (2/3) ── */}
        <div className="dash-right" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Activity heatmap */}
          <ActivityHeatmap activity={activity} />

          {/* Current semester subjects */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "var(--heading)", margin: 0 }}>
                {semesterLabel(profile.current_semester)} Subjects
              </h2>
              {currentSubjects.length > 0 && (
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                  {progressLoading ? "Loading…" : `${overallPct}% complete`}
                </span>
              )}
            </div>

            {currentSubjects.length === 0 ? (
              <div className="card" style={{ padding: "28px 20px", textAlign: "center" }}>
                <p style={{ color: "var(--text-3)", fontSize: 13 }}>
                  No subjects found for {profile.branch.toUpperCase()} ·{" "}
                  {semesterLabel(profile.current_semester)} · {profile.pattern} pattern.
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                  {subjectProgress.map(({ subject, unitsDone, unitsTotal, questionsDone, questionsTotal }) => (
                    <SubjectProgressCard
                      key={subject.code}
                      subject={subject}
                      unitsDone={unitsDone}
                      unitsTotal={unitsTotal}
                      questionsDone={questionsDone}
                      questionsTotal={questionsTotal}
                      loading={progressLoading}
                    />
                  ))}
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "var(--surface3)", overflow: "hidden" }}>
                  <div style={{ width: `${overallPct}%`, height: "100%", background: "var(--gold)", transition: "width .2s" }} />
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* ── Below: Stats, Email pref, Saved ── */}

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
          marginBottom: 36,
        }}
      >
        {[
          { label: "Saved Subjects", value: saved.length },
          { label: "Study Streak", value: `${streak} day${streak !== 1 ? "s" : ""}` },
          { label: "AI Calls Left Today", value: `${aiRemaining}/${aiLimit}` },
          {
            label: "Questions Done This Sem",
            value: subjectProgress.reduce((sum, i) => sum + i.questionsDone, 0),
          },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--heading)", lineHeight: 1, marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 500 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Saved subjects */}
      <div style={{ marginTop: 36 }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "var(--heading)", marginBottom: 16 }}>
          Saved Subjects
        </h2>

        {saved.length === 0 ? (
          <div className="card" style={{ padding: "40px 24px", textAlign: "center" }}>
            <p style={{ color: "var(--text-3)", marginBottom: 16 }}>
              No saved subjects yet. Hit the bookmark icon on any subject page.
            </p>
            <Link to="/branches" className="btn btn-primary">Browse Subjects</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {saved.map((s) => (
              <Link
                key={s.code}
                to={`/subject/${s.code}`}
                state={s}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", borderRadius: 10,
                  border: "var(--border-w) solid var(--border)",
                  background: "var(--surface)", textDecoration: "none",
                  transition: "background .15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--gold-dim)", background: "var(--gold-pale)", padding: "3px 8px", borderRadius: 10, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {s.code}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>
                  {s.name}
                </span>
                {s.branch && (
                  <span style={{ fontSize: 12, color: "var(--text-3)", marginLeft: "auto" }}>
                    {s.branch}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dash-layout { flex-direction: column !important; gap: 0 !important; }
          .dash-left { flex: unset !important; width: 100% !important; margin-bottom: 20px; }
          .dash-right { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
