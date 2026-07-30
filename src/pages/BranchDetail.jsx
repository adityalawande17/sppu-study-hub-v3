import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { useApp } from "../context/AppContext";
import { branchMeta, branchData } from "../data/branches";
import SubjectItem from "../components/SubjectItem";
import SyllabusModal from "../components/SyllabusModal";

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
  const { pattern } = useApp();
  const [syllabusOpen, setSyllabusOpen] = useState(false);

  const meta = branchMeta[branchKey];
  const data =
    branchData[pattern]?.[branchKey] || branchData["2019"][branchKey];

  useSEO({
    title: meta
      ? `${meta.name} Notes and Question Papers — SPPU ${pattern} | SPPUStudyHUB`
      : "Branch | SPPUStudyHUB",
    description: meta
      ? `Free notes, question papers and practicals for SPPU ${meta.name}. SE, TE and BE subjects. ${pattern} pattern.`
      : "",
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
      <div className="breadcrumb">
        <Link to="/" className="bc-link">
          Home
        </Link>
        <span className="bc-sep">›</span>
        <Link to="/branches" className="bc-link">
          Branches
        </Link>
        <span className="bc-sep">›</span>
        <span>{meta.short}</span>
      </div>

      {/* Branch header with accent */}
      <div
        style={{
          padding: "20px 0 22px",
          borderBottom: "var(--border-w) solid var(--border)",
          marginBottom: 22,
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: meta.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'DM Serif Display', serif",
              flexShrink: 0,
            }}
          >
            {meta.abbr}
          </div>
          <div>
            <h1
              className="branch-page-title"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 26,
                color: "var(--heading)",
                marginBottom: 6,
              }}
            >
              {meta.name}
            </h1>
            <div className="subject-meta">
              <span>
                <span className="meta-dot" /> {pattern} Pattern
              </span>
              <span>
                <span className="meta-dot" /> SPPU
              </span>
              <span>
                <span className="meta-dot" /> Pune
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSyllabusOpen(true)}
          className="syllabus-dl-btn"
          style={{ alignSelf: "flex-start" }}
        >
          <DlIcon /> Syllabus PDF
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          alignItems: "start",
        }}
      >
        {["SE", "TE", "BE"].map((yr) => {
          const yearData = data[yr];
          if (!yearData) return <div key={yr} />;
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
      <SyllabusModal
        open={syllabusOpen}
        onClose={() => setSyllabusOpen(false)}
        year="SE"
        pattern={pattern}
      />
    </div>
  );
}
