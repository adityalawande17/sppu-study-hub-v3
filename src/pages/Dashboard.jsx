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
import ProfileForm from "../components/ProfileForm";
import SubjectProgressCard from "../components/SubjectProgressCard";
import CgpaTracker from "../components/CgpaTracker";
import ActivityHeatmap from "../components/ActivityHeatmap";

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

  // Computed before the early returns below so this hook always runs in the
  // same order — pass an empty list until the profile has actually loaded.
  const currentSubjects = profile
    ? getSubjectsFor(profile.branch, profile.current_semester, profile.pattern)
    : [];
  const { items: subjectProgress, loading: progressLoading, overallPct } =
    useSemesterProgress(currentSubjects);
  const { streak, activity, aiRemaining, aiLimit } = useQuickStats(!!user);

  if (sessionLoading || profileLoading) return null;
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
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              initial
            )}
          </div>
          <div>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 26,
                color: "var(--heading)",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {displayName}
            </h1>
            <p
              style={{
                color: "var(--text-3)",
                fontSize: 13,
                margin: "4px 0 0",
              }}
            >
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
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
            transition: "all .18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--surface2)";
            e.currentTarget.style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-3)";
          }}
        >
          Sign out
        </button>
      </div>

      {/* Your profile */}
      <div className="card" style={{ padding: "20px 22px", marginBottom: 24 }}>
        {!editingProfile ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {branchInfo && (
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: branchInfo.color,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {branchInfo.abbr}
                </span>
              )}
              <div>
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: "var(--heading)" }}
                >
                  {branchInfo?.short ?? profile.branch}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                  {semesterLabel(profile.current_semester)} · {profile.pattern} pattern
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditingProfile(true)}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-3)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--surface2)";
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--text-3)";
              }}
            >
              Change semester
            </button>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 17,
                  color: "var(--heading)",
                }}
              >
                Update your profile
              </h2>
              <button
                onClick={() => {
                  setEditingProfile(false);
                  setProfileError(null);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "var(--text-3)",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Cancel
              </button>
            </div>
            {profileError && (
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
                {profileError}
              </div>
            )}
            <ProfileForm
              initial={profile}
              onSubmit={handleProfileUpdate}
              submitting={savingProfile}
              submitLabel="Save changes"
            />
          </div>
        )}
      </div>

      {/* Activity heatmap */}
      <div style={{ marginBottom: 36 }}>
        <ActivityHeatmap activity={activity} />
      </div>

      {/* Current semester subjects */}
      <div style={{ marginBottom: 36 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20,
              color: "var(--heading)",
            }}
          >
            {semesterLabel(profile.current_semester)} Subjects
          </h2>
          {currentSubjects.length > 0 && (
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>
              {progressLoading ? "Loading…" : `${overallPct}% complete`}
            </span>
          )}
        </div>

        {currentSubjects.length === 0 ? (
          <div className="card" style={{ padding: "32px 24px", textAlign: "center" }}>
            <p style={{ color: "var(--text-3)", fontSize: 13 }}>
              No subjects found yet for {profile.branch.toUpperCase()} ·{" "}
              {semesterLabel(profile.current_semester)} · {profile.pattern} pattern.
              This branch/pattern/semester combination may not be added to the
              site yet.
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
                marginBottom: 12,
              }}
              className="subject-grid"
            >
              {subjectProgress.map(
                ({ subject, unitsDone, unitsTotal, questionsDone, questionsTotal }) => (
                  <SubjectProgressCard
                    key={subject.code}
                    subject={subject}
                    unitsDone={unitsDone}
                    unitsTotal={unitsTotal}
                    questionsDone={questionsDone}
                    questionsTotal={questionsTotal}
                    loading={progressLoading}
                  />
                ),
              )}
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 4,
                background: "var(--surface3)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${overallPct}%`,
                  height: "100%",
                  background: "var(--gold)",
                  transition: "width .2s",
                }}
              />
            </div>
          </>
        )}
      </div>

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
          <div
            key={stat.label}
            className="card"
            style={{ padding: "20px 22px" }}
          >
            <div style={{ fontSize: 22, marginBottom: 8 }}>{stat.icon}</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "var(--heading)",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 500 }}
            >
              {stat.label}
            </div>
            {stat.note && (
              <div
                style={{ fontSize: 11, color: "var(--text-4)", marginTop: 4 }}
              >
                {stat.note}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 36 }}>
        <CgpaTracker />
      </div>

      {/* Saved subjects */}
      <div>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 20,
            color: "var(--heading)",
            marginBottom: 16,
          }}
        >
          Saved Subjects
        </h2>

        {saved.length === 0 ? (
          <div
            className="card"
            style={{ padding: "40px 24px", textAlign: "center" }}
          >
            <p style={{ color: "var(--text-3)", marginBottom: 16 }}>
              No saved subjects yet. Hit the bookmark icon on any subject page.
            </p>
            <Link to="/branches" className="btn btn-primary">
              Browse Subjects
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {saved.map((s) => (
              <Link
                key={s.code}
                to={`/subject/${s.code}`}
                state={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  textDecoration: "none",
                  transition: "background .15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--surface2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--surface)")
                }
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--gold-dim)",
                    background: "var(--gold-pale)",
                    padding: "3px 8px",
                    borderRadius: 10,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {s.code}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--text)",
                  }}
                >
                  {s.name}
                </span>
                {s.branch && (
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--text-3)",
                      marginLeft: "auto",
                    }}
                  >
                    {s.branch}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .subject-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
