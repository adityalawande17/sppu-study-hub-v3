import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { useApp } from "../context/AppContext";
import { branchMeta } from "../data/branches";
import { trendingItems } from "../data/trending";
import { newsItems, categoryLabels } from "../data/news";
import ContributeModal from "../components/ContributeModal";
import SyllabusModal from "../components/SyllabusModal";

const typeColor = {
  Notes: { bg: "#dbeafe", color: "#1e40af" },
  PYQ: { bg: "#fef3c7", color: "#92400e" },
  Practical: { bg: "#dcfce7", color: "#166534" },
};

export default function Home() {
  const navigate = useNavigate();
  const { pattern } = useApp();
  const [contributeOpen, setContributeOpen] = useState(false);
  const [syllabusYear, setSyllabusYear] = useState(null);

  useSEO({
    title:
      "SPPUStudyHUB - SPPU Previous Year Question Papers, Notes, everything one stop",
    description:
      "Free SPPU engineering notes, previous year question papers and practical tutorials for all branches. 2019 and 2024 pattern. Savitribai Phule Pune University.",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "sppuwalestudent",
      url: "https://sppuwalestudent.com",
    },
  });

  const recentNews = newsItems.slice(0, 3);

  return (
    <div className="page-wrap">
      {/* ── Hero ───────────────────────────────────────────── */}
      <div
        style={{
          padding: "52px 0 44px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          alignItems: "center",
        }}
        className="hero-grid fade-up"
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "var(--gold-pale)",
              border: "1px solid var(--gold-dim)",
              borderRadius: 20,
              padding: "5px 13px",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--gold-dim)",
              marginBottom: 18,
              letterSpacing: 0.3,
            }}
          >
            Savitribai Phule Pune University
          </div>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 46,
              lineHeight: 1.12,
              color: "var(--heading)",
              marginBottom: 16,
              letterSpacing: "-0.5px",
            }}
          >
            Everything you need.
            <br />
            <span style={{ fontStyle: "italic", color: "var(--gold-dim)" }}>
              One place.
            </span>
          </h1>
          <p
            style={{
              color: "var(--text-3)",
              fontSize: 16,
              lineHeight: 1.75,
              marginBottom: 28,
              maxWidth: 420,
            }}
          >
            Notes, question papers, and practical tutorials for every SPPU
            engineering subject. Both 2019 and 2024 patterns. Free forever.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              to="/branches"
              className="btn btn-primary"
              style={{ fontSize: 15, padding: "11px 22px" }}
            >
              Browse Branches
            </Link>
            <Link
              to="/first-year"
              className="btn btn-outline"
              style={{ fontSize: 15, padding: "11px 22px" }}
            >
              First Year
            </Link>
            <Link
              to="/tools"
              className="btn btn-ghost"
              style={{
                fontSize: 15,
                padding: "11px 18px",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 010 14.14M4.93 19.07a10 10 0 010-14.14" />
              </svg>
              SPPU Tools
            </Link>
          </div>
        </div>

        {/* Hero visual — dark card */}
        <div
          style={{
            background: "var(--navy)",
            borderRadius: 20,
            padding: 28,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background grid pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,.04) 1px, transparent 0)",
              backgroundSize: "28px 28px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              position: "relative",
            }}
          >
            {[
              ["200+", "Study Materials", "#3b82f6"],
              ["7", "Branches", "#0d9488"],
              ["100+", "Question Papers", "#f59e0b"],
              ["Free", "Always", "#16a34a"],
            ].map(([num, label, color]) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 12,
                  padding: "18px 14px",
                  textAlign: "center",
                  borderTop: `3px solid ${color}`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 28,
                    color: "#fff",
                    display: "block",
                    lineHeight: 1,
                  }}
                >
                  {num}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,.45)",
                    marginTop: 5,
                    display: "block",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          {/* Result CTA inside hero card */}
          <a
            href="https://results.unipune.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
              padding: "12px 14px",
              background: "rgba(240,165,0,.12)",
              border: "1px solid rgba(240,165,0,.25)",
              borderRadius: 10,
              textDecoration: "none",
              transition: "all .2s",
              position: "relative",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(240,165,0,.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(240,165,0,.12)")
            }
          >
            <div>
              <div
                style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)" }}
              >
                Check SPPU Result
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>
                results.unipune.ac.in
              </div>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      <div className="ad-slot">
        <div>
          <p className="ad-label">Advertisement</p>
          <p>Google AdSense</p>
        </div>
      </div>

      {/* ── Trending ───────────────────────────────────────── */}
      <div className="section-header fade-up fade-up-1">
        <h2 className="section-title">Trending This Week</h2>
        <span className="section-sub">Most accessed materials</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          marginBottom: 8,
        }}
        className="trending-grid fade-up fade-up-2"
      >
        {trendingItems.map((item, i) => (
          <div
            key={item.code}
            className="card card-interactive"
            onClick={() => navigate(`/subject/${item.code}`, { state: item })}
            style={{ padding: 18, position: "relative", overflow: "hidden" }}
          >
            {/* Large rank watermark */}
            <div
              style={{
                position: "absolute",
                top: -4,
                right: 10,
                fontFamily: "'DM Serif Display', serif",
                fontSize: 64,
                color: "var(--border)",
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {i + 1}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: 10,
                background: typeColor[item.type]?.bg,
                color: typeColor[item.type]?.color,
                display: "inline-block",
                marginBottom: 10,
              }}
            >
              {item.type}
            </span>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--heading)",
                marginBottom: 3,
                paddingRight: 30,
                lineHeight: 1.4,
              }}
            >
              {item.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>
              {item.branch.split(" ").slice(0, 2).join(" ")} · {item.sem}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginTop: 12,
              }}
            >
              <span
                style={{ fontSize: 11, color: "var(--text-4)", flexShrink: 0 }}
              >
                {item.downloads}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 3,
                  background: "var(--border)",
                  borderRadius: 2,
                }}
              >
                <div
                  style={{
                    width: `${item.pct}%`,
                    height: "100%",
                    background: "var(--gold)",
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Year selector ──────────────────────────────────── */}
      <div className="section-header fade-up fade-up-2">
        <h2 className="section-title">Select Your Year</h2>
        <span className="section-sub">Current pattern: {pattern}</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 8,
        }}
        className="year-grid fade-up fade-up-3"
      >
        {[
          {
            key: "FE",
            tag: "All Branches",
            label: "First Year",
            desc: "FE — Common syllabus",
            path: "/first-year",
            accent: "#f59e0b",
          },
          {
            key: "SE",
            tag: "Second Year",
            label: "SE",
            desc: "Semester 3 and 4",
            accent: "#3b82f6",
          },
          {
            key: "TE",
            tag: "Third Year",
            label: "TE",
            desc: "Semester 5 and 6",
            accent: "#0d9488",
          },
          {
            key: "BE",
            tag: "Final Year",
            label: "BE",
            desc: "Semester 7 and 8",
            accent: "#9333ea",
          },
        ].map((yr) => (
          <div
            key={yr.key}
            className="card card-interactive"
            style={{
              padding: "20px 16px",
              textAlign: "center",
              borderTop: `3px solid ${yr.accent}`,
              position: "relative",
              overflow: "hidden",
            }}
            onClick={() =>
              yr.path ? navigate(yr.path) : navigate("/branches")
            }
          >
            <div
              style={{
                position: "absolute",
                top: -16,
                right: -10,
                fontFamily: "'DM Serif Display', serif",
                fontSize: 72,
                color: "var(--surface3)",
                lineHeight: 1,
                pointerEvents: "none",
              }}
            >
              {yr.label}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: yr.accent,
                marginBottom: 8,
                display: "block",
              }}
            >
              {yr.tag}
            </span>
            <div
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 26,
                color: "var(--heading)",
                marginBottom: 4,
                position: "relative",
              }}
            >
              {yr.label}
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-3)",
                lineHeight: 1.5,
                marginBottom: 14,
                position: "relative",
              }}
            >
              {yr.desc}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSyllabusYear(yr.key);
              }}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: yr.accent,
                background: "transparent",
                border: `1px solid ${yr.accent}`,
                borderRadius: 16,
                padding: "4px 11px",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "all .15s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = yr.accent;
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = yr.accent;
              }}
            >
              Syllabus PDF
            </button>
          </div>
        ))}
      </div>

      {/* ── Branches ───────────────────────────────────────── */}
      <div className="section-header fade-up fade-up-3">
        <h2 className="section-title">Browse by Branch</h2>
        <Link
          to="/branches"
          style={{
            fontSize: 13,
            color: "var(--gold-dim)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          View all →
        </Link>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 8,
        }}
        className="branch-grid fade-up fade-up-4"
      >
        {Object.values(branchMeta).map((b) => (
          <Link
            key={b.key}
            to={`/branches/${b.key}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 18px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              textDecoration: "none",
              transition: "all .2s",
              borderLeft: `3px solid ${b.color}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
              e.currentTarget.style.transform = "translateX(3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.transform = "";
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: b.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
                fontFamily: "'DM Serif Display', serif",
              }}
            >
              {b.abbr}
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--heading)",
                  marginBottom: 2,
                }}
              >
                {b.short}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                SE · TE · BE
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── News strip ─────────────────────────────────────── */}
      <div className="section-header fade-up fade-up-4">
        <h2 className="section-title">Latest Updates</h2>
        <Link
          to="/news"
          style={{
            fontSize: 13,
            color: "var(--gold-dim)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          All updates →
        </Link>
      </div>
      <div
        style={{ display: "grid", gap: 8, marginBottom: 8 }}
        className="fade-up fade-up-5"
      >
        {recentNews.map((item) => {
          const cat = categoryLabels[item.category];
          return (
            <div
              key={item.id}
              className="news-card"
              onClick={() => item.link && window.open(item.link, "_blank")}
            >
              <div className="news-dot" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                    flexWrap: "wrap",
                  }}
                >
                  <span className={`badge ${cat.badge}`}>{cat.label}</span>
                  <span style={{ fontSize: 12, color: "var(--text-4)" }}>
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--heading)",
                    marginBottom: 3,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-3)",
                    lineHeight: 1.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item.description}
                </div>
              </div>
              {item.link && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-4)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Contribute banner ──────────────────────────────── */}
      <div
        style={{
          background: "var(--navy)",
          borderRadius: 16,
          padding: "32px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          margin: "32px 0",
          position: "relative",
          overflow: "hidden",
        }}
        className="fade-up fade-up-5"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,.03) 1px, transparent 0)",
            backgroundSize: "24px 24px",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <h3
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 22,
              color: "#fff",
              marginBottom: 6,
            }}
          >
            Help your fellow students
          </h3>
          <p
            style={{
              color: "rgba(255,255,255,.55)",
              fontSize: 14,
              lineHeight: 1.6,
              maxWidth: 440,
            }}
          >
            Have notes, solved papers, or practicals? Share them with the SPPU
            community and help thousands of students study better.
          </p>
        </div>
        <button
          onClick={() => setContributeOpen(true)}
          className="btn btn-gold"
          style={{
            flexShrink: 0,
            fontSize: 15,
            padding: "12px 24px",
            position: "relative",
          }}
        >
          Contribute Materials
        </button>
      </div>

      <div className="ad-slot" style={{ marginBottom: 40 }}>
        <div>
          <p className="ad-label">Advertisement</p>
          <p>Google AdSense</p>
        </div>
      </div>

      <ContributeModal
        open={contributeOpen}
        onClose={() => setContributeOpen(false)}
      />
      <SyllabusModal
        open={!!syllabusYear}
        onClose={() => setSyllabusYear(null)}
        year={syllabusYear}
        pattern={pattern}
      />

      <style>{`
        @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important;gap:28px!important}.trending-grid{grid-template-columns:repeat(2,1fr)!important}.branch-grid{grid-template-columns:repeat(2,1fr)!important}.year-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:600px){.hero-grid h1{font-size:32px!important}.trending-grid{grid-template-columns:1fr!important}.branch-grid{grid-template-columns:1fr!important}}
        @media(max-width:400px){.year-grid{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
