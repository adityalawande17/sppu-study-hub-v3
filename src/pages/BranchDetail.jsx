import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { useApp } from "../context/AppContext";
import { branchMeta, branchData } from "../data/branches";
import SubjectItem from "../components/SubjectItem";
import BranchLogo from "../components/BranchLogo";
import Icon from "../components/layout/icons";


const YEAR_NAMES = {
  SE: "Second Year (SE)",
  TE: "Third Year (TE)",
  BE: "Fourth Year (BE)",
};
const YEARS = ["SE", "TE", "BE"];

// Year column with no syllabus yet: same heading as the others, then a notice box
function ComingSoonYear({ yr }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ padding: "10px 16px", borderRadius: 10, marginBottom: 14, textAlign: "left" }}>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 15,
            color: "#fff",
            margin: 0,
          }}
        >
          {YEAR_NAMES[yr]}
        </h2>
      </div>
      <div
        style={{
          padding: "18px 16px",
          border: "var(--border-w) solid var(--border)",
          borderRadius: 12,
          background: "var(--surface2)",
          fontSize: 13,
          lineHeight: 1.6,
          color: "var(--text-3)",
        }}
      >
        Not released by SPPU University yet. Will be added as soon as it is released.
      </div>
    </div>
  );
}

const DlIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function BranchDetail() {
  const { branchKey } = useParams();
  const navigate = useNavigate();
  const { pattern } = useApp();
  const [activeYear, setActiveYear] = useState("SE");

  const meta = branchMeta[branchKey];
  const has2024Data = !!branchData["2024"]?.[branchKey];
  const data = branchData[pattern]?.[branchKey] || branchData["2019"][branchKey];
  const showPatternNotice = pattern === "2024" && !has2024Data;

  useSEO({
    title: meta
      ? `${meta.name} Notes and Question Papers — SPPU ${pattern} | SPPUStudyHUB`
      : "Branch | SPPUStudyHUB",
    description: meta
      ? `Free notes, question papers and practicals for SPPU ${meta.name}. SE, TE and BE subjects. ${pattern} pattern.`
      : "",
    schema: meta ? {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${meta.name} — SPPU ${pattern} Study Materials`,
      description: `Free notes and question papers for SPPU ${meta.name} ${pattern} pattern`,
      url: `https://sppustudyhub.in/branches/${branchKey}`,
    } : undefined,
  });

  if (!meta || !data)
    return (
      <div
        className="page-wrap"
        style={{ paddingTop: 60, textAlign: "center" }}
      >
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28,
            color: "var(--heading)",
            marginBottom: 12,
          }}
        >
          Branch not found
        </h2>
        <Link to="/branches" className="btn btn-primary">
          Back to Branches
        </Link>
      </div>
    );

  return (
    <div className="page-wrap">
      {/* 2024 pattern not yet available notice */}
      {showPatternNotice && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            marginBottom: 16,
            background: "var(--gold-pale)",
            border: "1px solid var(--border-2)",
            borderRadius: 8,
            fontSize: 13,
            color: "var(--text-2)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold-dim)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          2024 pattern syllabus isn't mapped yet for this branch — showing 2019 pattern subjects.
        </div>
      )}

      <button
        type="button"
        className="subject-back-btn"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <Icon name="arrowLeft" size={18} />
        Back
      </button>

      {/* Branch header */}
      <div className="branch-header">
        <div className="branch-header-main">
          <BranchLogo branch={meta} size={52} />
          <div>
            <h1 className="branch-page-title">{meta.name}</h1>
            <div className="subject-meta">
              <span>
                <span className="meta-dot" /> {pattern} Pattern
              </span>
              <span>
                <span className="meta-dot" /> SPPU
              </span>
            </div>
          </div>
        </div>
        <Link to="/syllabus" className="syllabus-dl-btn">
          <DlIcon /> Syllabus PDF
        </Link>
      </div>

      {/* Mobile-only year tabs */}
      <div className="branch-year-tabs">
        {YEARS.map((yr) => (
          (
            <button
              key={yr}
              onClick={() => setActiveYear(yr)}
              style={{
                flex: 1,
                padding: "9px 0",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
                border: "none",
                borderBottom: activeYear === yr ? `2px solid ${meta.color}` : "2px solid transparent",
                background: "transparent",
                color: activeYear === yr ? "var(--heading)" : "var(--text-3)",
                transition: "all .15s",
              }}
            >
              {data[yr]?.label?.split(" ")[0] || YEAR_NAMES[yr].split(" ")[0]}
            </button>
          )
        ))}
      </div>

      {/* Mobile-only: single year content */}
      <div className="branch-mobile-year">
        {(() => {
          const yearData = data[activeYear];
          if (!yearData) return <ComingSoonYear yr={activeYear} />;
          return (
            <>
              {yearData.semesters.map((sem, i) => (
                <div key={sem.label} style={{ marginBottom: i < yearData.semesters.length - 1 ? 14 : 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 8px" }}>
                    {sem.label}
                  </p>
                  <div style={{ display: "grid", gap: 6 }}>
                    {sem.subjects.map((s) => (
                      <SubjectItem
                        key={s.code}
                        subject={s}
                        branch={meta.name}
                        branchKey={branchKey}
                        yearKey={activeYear}
                        sem={sem.label}
                        accentColor={meta.color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          );
        })()}
      </div>

      {/* Desktop-only: all three year columns */}
      <div
        className="branch-desktop-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${YEARS.length}, minmax(0, 1fr))`,
          gap: 16,
          alignItems: "start",
        }}
      >
        {YEARS.map((yr) => {
          const yearData = data[yr];
          if (!yearData) return <ComingSoonYear key={yr} yr={yr} />;
          return (
            <div key={yr} style={{ minWidth: 0 }}>
              {/* Year header */}
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  marginBottom: 14,
                  textAlign: "left",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 15,
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  {yearData.label || yr}
                </h2>
              </div>

              {/* Both semesters stacked with no gap between them */}
              {yearData.semesters.map((sem, i) => (
                <div
                  key={sem.label}
                  style={{
                    marginBottom: i < yearData.semesters.length - 1 ? 14 : 0,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-4)",
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      margin: "0 0 8px",
                    }}
                  >
                    {sem.label}
                  </p>
                  <div style={{ display: "grid", gap: 6 }}>
                    {sem.subjects.map((s) => (
                      <SubjectItem
                        key={s.code}
                        subject={s}
                        branch={meta.name}
                        branchKey={branchKey}
                        yearKey={yr}
                        sem={sem.label}
                        accentColor={meta.color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* <div className="ad-slot" style={{ marginBottom: 40 }}>
        <div>
          <p className="ad-label">Advertisement</p>
          <p>Google AdSense</p>
        </div>
      </div> */}
    </div>
  );
}
