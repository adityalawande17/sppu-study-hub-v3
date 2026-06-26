import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { useApp } from "../context/AppContext";
import { branchMeta } from "../data/branches";
import { newsItems, categoryLabels } from "../data/news";
import ContributeModal from "../components/ContributeModal";
import SyllabusModal from "../components/SyllabusModal";

export default function Home() {
  const navigate = useNavigate();
  const { pattern } = useApp();
  const [contributeOpen, setContributeOpen] = useState(false);
  const [syllabusYear, setSyllabusYear] = useState(null);
  const [noticeDismissed, setNoticeDismissed] = useState(
    () => sessionStorage.getItem("notice_dismissed") === "1",
  );

  useSEO({
    title:
      "SPPUStudyHUB - SPPU Previous Year Question Papers, Notes, everything one stop",
    description:
      "Free SPPU engineering notes, previous year question papers and practical tutorials for all branches. 2019 and 2024 patterns. Savitribai Phule Pune University.",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "SPPUStudyHUB",
      url: "https://sppustudyhub.in",
    },
  });

  const recentNews = newsItems.slice(0, 3);

  function dismissNotice() {
    sessionStorage.setItem("notice_dismissed", "1");
    setNoticeDismissed(true);
  }

  return (
    <div className="page-wrap">
      {/* ── Content notice popup ── */}
      {!noticeDismissed && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 500,
            width: 320,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--gold)",
            borderRadius: 12,
            padding: "14px 16px",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            animation: "fadeUp .35s ease both",
          }}
          className="content-notice-popup"
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              flexShrink: 0,
              background: "var(--gold-pale)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--gold-dim)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--heading)",
                marginBottom: 3,
              }}
            >
              We're still adding content
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-3)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              We're sorry if the subject you're looking for doesn't have content
              yet. We're working hard on adding quality notes, question papers
              and more.
            </p>
          </div>
          <button
            onClick={dismissNotice}
            title="Dismiss"
            style={{
              flexShrink: 0,
              width: 24,
              height: 24,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-4)",
              fontSize: 18,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              transition: "all .15s",
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--surface2)";
              e.currentTarget.style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-4)";
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────── */}
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
        {/* Left — redesigned */}
        <div>
          {/* Live indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 22,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                flexShrink: 0,
                background: "#22c55e",
                boxShadow: "0 0 0 3px rgba(34,197,94,.22)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-3)",
                letterSpacing: 0.2,
              }}
            >
              2019 &amp; 2024 patterns &nbsp;·&nbsp; 7 branches &nbsp;·&nbsp;
              Free forever
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 50,
              lineHeight: 1.08,
              color: "var(--heading)",
              marginBottom: 18,
              letterSpacing: "-0.6px",
            }}
          >
            Everything
            <br />
            you need.
            <br />
            <span style={{ color: "var(--gold-dim)" }}>One place.</span>
          </h1>

          {/* Description */}
          <p
            style={{
              color: "var(--text-3)",
              fontSize: 15,
              lineHeight: 1.8,
              marginBottom: 24,
              maxWidth: 400,
            }}
          >
            Notes, question papers, and practical tutorials for every SPPU
            engineering subject — both patterns, all branches.
          </p>

          {/* Feature chips */}
          <div
            style={{
              display: "flex",
              gap: 7,
              flexWrap: "wrap",
              marginBottom: 28,
            }}
          >
            {[
              { label: "Notes & Materials", dot: "#3b82f6" },
              { label: "Question Papers", dot: "#ee9575" },
              { label: "SPPU Tools", dot: "#0d9488" },
              { label: "AI Explain", dot: "#a78bfa" },
            ].map(({ label, dot }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  padding: "5px 13px",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--text-3)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: dot,
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
                {label}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            <Link
              to="/branches"
              className="btn btn-primary"
              style={{ fontSize: 14, padding: "11px 24px" }}
            >
              Browse Branches →
            </Link>
            <Link
              to="/first-year"
              className="btn btn-outline"
              style={{ fontSize: 14, padding: "11px 22px" }}
            >
              First Year
            </Link>
            <Link
              to="/tools"
              className="btn btn-ghost"
              style={{ fontSize: 14, padding: "11px 18px" }}
            >
              SPPU Tools
            </Link>
          </div>
        </div>

        {/* Right — hero card */}
        <div
          style={{
            background: "var(--navy)",
            borderRadius: 10,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Dot grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,.035) 1px, transparent 0)",
              backgroundSize: "26px 26px",
              pointerEvents: "none",
            }}
          />

          <div style={{ padding: "26px 26px 22px", position: "relative" }}>
            {/* Header label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              {/* <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "rgba(0, 204, 240, 0.1)",
                  border: "1px solid rgba(0, 204, 240, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
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
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                </svg>
              </div> */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,.4)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Platform at a glance
              </span>
            </div>

            {/* Stats — 3 column bordered box */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 14,
                overflow: "hidden",
                marginBottom: 18,
              }}
            >
              {[
                { num: "200+", label: "Study\nMaterials", color: "#3b82f6" },
                { num: "100+", label: "Question\nPapers", color: "#7d6d9b" },
                { num: "7", label: "Engineering\nBranches", color: "#0d9488" },
              ].map(({ num, label, color }, i) => (
                <div
                  key={label}
                  style={{
                    padding: "18px 10px",
                    textAlign: "center",
                    background: "rgba(255,255,255,.04)",
                    borderLeft:
                      i > 0 ? "1px solid rgba(255,255,255,.08)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: 30,
                      color,
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {num}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,.38)",
                      lineHeight: 1.4,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Feature checklist */}
            <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
              {[
                {
                  text: "Notes & PYQs for every SPPU subject",
                  color: "#3b82f6",
                },
                { text: "AI-powered question explanations", color: "#a78bfa" },
                {
                  text: "2019 and 2024 patterns fully covered",
                  color: "#f7bd59",
                },
                {
                  text: "Completely free forever",
                  color: "#22c55e",
                },
              ].map(({ text, color }) => (
                <div
                  key={text}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: `${color}20`,
                      border: `1px solid ${color}50`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={color}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,.62)",
                      lineHeight: 1.4,
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Result CTA */}
            <a
              href="https://results.unipune.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "rgba(0, 204, 240, 0.1)",
                border: "1px solid rgba(0, 204, 240, 0.1)",
                borderRadius: 11,
                textDecoration: "none",
                transition: "all .2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(0, 135, 159, 0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(0, 204, 240, 0.1)")
              }
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--gold)",
                  }}
                >
                  Check SPPU Result
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,.35)",
                    marginTop: 2,
                  }}
                >
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
      </div>

      {/* <div className="ad-slot">
        <div>
          <p className="ad-label">Advertisement</p>
          <p>Google AdSense</p>
        </div>
      </div> */}

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
            label: "FE",
            desc: "FE — Common syllabus",
            path: "/first-year",
            accent: "#8da7db",
          },
          {
            key: "SE",
            tag: "Second Year",
            label: "SE",
            desc: "Semester 3 and 4",
            accent: "#0e4eb4",
          },
          {
            key: "TE",
            tag: "Third Year",
            label: "TE",
            desc: "Semester 5 and 6",
            accent: "#4b55a8",
          },
          {
            key: "BE",
            tag: "Final Year",
            label: "BE",
            desc: "Semester 7 and 8",
            accent: "#33a4ea",
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

      {/* <div className="ad-slot" style={{ marginBottom: 40 }}>
        <div>
          <p className="ad-label">Advertisement</p>
          <p>Google AdSense</p>
        </div>
      </div> */}

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
        @media(max-width:900px){
          .hero-grid{grid-template-columns:1fr!important;gap:28px!important}
          .branch-grid{grid-template-columns:repeat(2,1fr)!important}
          .year-grid{grid-template-columns:repeat(2,1fr)!important}
        }
        @media(max-width:600px){
          .hero-grid h1{font-size:32px!important}
          .branch-grid{grid-template-columns:1fr!important}
        }
        @media(max-width:400px){.year-grid{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
