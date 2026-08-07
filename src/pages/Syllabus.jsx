import { useState } from "react";
import { useSEO } from "../hooks/useSEO";
import { syllabusLinks, yearLabels } from "../data/syllabusLinks";

const YEARS = ["FE", "SE", "TE", "BE"];
const PATTERNS = ["2019", "2024"];

const DownloadIcon = () => (
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

const ComingSoonBadge = () => (
  <span
    style={{
      fontSize: 11,
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: 8,
      background: "var(--surface3)",
      color: "var(--text-4)",
    }}
  >
    Coming soon
  </span>
);

export default function Syllabus() {
  const [pattern, setPattern] = useState("2019");
  const [activeYear, setActiveYear] = useState("FE");

  const branches = syllabusLinks[pattern]?.[activeYear] ?? [];

  useSEO({
    title: `SPPU ${yearLabels[activeYear]} Syllabus PDFs — ${pattern} Pattern | SPPUStudyHUB`,
    description: `Download official Savitribai Phule Pune University ${activeYear} syllabus PDFs for the ${pattern} pattern — Computer Engineering, Information Technology, AI & DS, Mechanical, Civil, Electrical, and ENTC.`,
    schema: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `SPPU ${yearLabels[activeYear]} Syllabus — ${pattern} Pattern`,
      description: `Official SPPU engineering syllabus PDFs for ${activeYear} ${pattern} pattern`,
      url: "https://sppustudyhub.in/syllabus",
      itemListElement: branches
        .filter((b) => b.url !== "#")
        .map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${b.name} ${yearLabels[activeYear]} Syllabus — SPPU ${pattern} Pattern`,
          url: b.url,
        })),
    },
  });

  return (
    <main className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-4)",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          SPPU Official
        </p>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "var(--heading)",
            marginBottom: 10,
            lineHeight: 1.25,
          }}
        >
          Syllabus PDFs
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-3)",
            maxWidth: 560,
            lineHeight: 1.6,
          }}
        >
          Official syllabus PDFs released by Savitribai Phule Pune University
          for all engineering branches, available for both 2019 and 2024
          patterns.
        </p>
      </div>

      {/* Pattern toggle */}
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text-4)",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 10,
          }}
        >
          Pattern
        </p>
        <div className="pattern-pill">
          {PATTERNS.map((p) => (
            <button
              key={p}
              className={`pattern-opt ${pattern === p ? "active" : ""}`}
              onClick={() => setPattern(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Year tabs */}
      <div style={{ marginBottom: 28 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text-4)",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 10,
          }}
        >
          Year
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {YEARS.map((y) => {
            const active = activeYear === y;
            return (
              <button
                key={y}
                onClick={() => setActiveYear(y)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                  background: active ? "var(--accent)" : "var(--surface2)",
                  color: active ? "#000000" : "var(--text)",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all .15s",
                }}
              >
                {y} — {yearLabels[y].split(" ")[0]}{" "}
                {yearLabels[y].split(" ")[1]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section title */}
      <h2
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "var(--heading)",
          marginBottom: 16,
        }}
      >
        {yearLabels[activeYear]} - {pattern} Pattern Syllabus
      </h2>

      {/* Branch cards */}
      <div style={{ display: "grid", gap: 10 }}>
        {branches.map((b) => {
          const unavailable = b.url === "#";
          return (
            <div
              key={b.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                border: "var(--border-w) solid var(--border)",
                borderRadius: 12,
                background: "var(--surface2)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--heading)",
                    marginBottom: b.note ? 3 : 0,
                  }}
                >
                  {b.name}
                </div>
                {b.note && (
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                    {b.note}
                  </div>
                )}
              </div>

              {unavailable ? (
                <ComingSoonBadge />
              ) : (
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--accent)",
                    background: "transparent",
                    color: "var(--accent)",
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    transition: "all .15s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent)";
                    e.currentTarget.style.color = "#000000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                >
                  <DownloadIcon /> Download PDF
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p
        style={{
          marginTop: 28,
          fontSize: 12,
          color: "var(--text-4)",
          lineHeight: 1.6,
        }}
      >
        All syllabus PDFs are sourced from official SPPU circulars and
        affiliated college websites. Links marked "Coming soon" will be added
        when the university publishes them.
      </p>
    </main>
  );
}
