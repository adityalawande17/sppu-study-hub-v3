import { useApp } from "../context/AppContext";
import { Link, Navigate } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

export default function Dashboard() {
  useSEO({
    title: "My Dashboard — SPPUStudyHub",
    description: "Your saved subjects and study activity on SPPUStudyHub.",
  });

  const { user, signOut, saved } = useApp();

  // Redirect to home if not logged in
  if (!user) return <Navigate to="/" replace />;

  const displayName = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Student";
  const avatarUrl = user.user_metadata?.avatar_url ?? null;
  const initial = displayName[0].toUpperCase();

  return (
    <div className="container" style={{ padding: "40px 24px 80px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, color: "#fff",
            flexShrink: 0, overflow: "hidden",
          }}>
            {avatarUrl
              ? <img src={avatarUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initial
            }
          </div>
          <div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 26, color: "var(--heading)", margin: 0, lineHeight: 1.2,
            }}>
              {displayName}
            </h1>
            <p style={{ color: "var(--text-3)", fontSize: 13, margin: "4px 0 0" }}>{user.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          style={{
            padding: "8px 16px", borderRadius: 8,
            border: "1px solid var(--border)",
            background: "transparent", color: "var(--text-3)",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "Inter, sans-serif", transition: "all .18s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.color = "var(--text)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-3)"; }}
        >
          Sign out
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 36 }}>
        {[
          { label: "Saved Subjects", value: saved.length, icon: "🔖" },
          { label: "AI Explanations", value: "—", icon: "✨", note: "Coming soon" },
          { label: "Questions This Month", value: "—", icon: "📊", note: "Coming soon" },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--heading)", lineHeight: 1, marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 500 }}>{stat.label}</div>
            {stat.note && <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 4 }}>{stat.note}</div>}
          </div>
        ))}
      </div>

      {/* Saved subjects */}
      <div>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 20, color: "var(--heading)",
          marginBottom: 16,
        }}>
          Saved Subjects
        </h2>

        {saved.length === 0 ? (
          <div className="card" style={{ padding: "40px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔖</div>
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
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  textDecoration: "none", transition: "background .15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
              >
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "var(--gold-dim)",
                  background: "var(--gold-pale)", padding: "3px 8px",
                  borderRadius: 10, whiteSpace: "nowrap", flexShrink: 0,
                }}>
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
    </div>
  );
}
