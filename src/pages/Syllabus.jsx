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
  const [pattern, setPattern] = useState("2024");

  useSEO({
    title: `SPPU Syllabus PDFs — ${pattern} Pattern | SPPUStudyHUB`,
    description: `Download official Savitribai Phule Pune University syllabus PDFs for the ${pattern} pattern, for First, Second, Third and Final year — Computer Engineering, Information Technology, AI & DS, Mechanical, Civil, Electrical, and ENTC.`,
    schema: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `SPPU Syllabus — ${pattern} Pattern`,
      description: `Official SPPU engineering syllabus PDFs for the ${pattern} pattern`,
      url: "https://sppustudyhub.in/syllabus",
      itemListElement: YEARS.flatMap((y) => syllabusLinks[pattern]?.[y] ?? [])
        .filter((b) => b.url !== "#")
        .map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${b.name} Syllabus — SPPU ${pattern} Pattern`,
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
          Pattern
        </p>
        <div className="pattern-pill syllabus-pattern-pill">
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

      {/* One section per year, stacked: First, Second, Third, Final */}
      {YEARS.map((y) => {
        // SPPU has not released the 2024 final-year syllabus yet
        const comingSoonYear = pattern === "2024" && y === "BE";
        const branches =
          comingSoonYear
            ? [{ name: "Final Year (BE) — 2024 Pattern", note: "Coming soon from SPPU University", url: "#" }]
            : syllabusLinks[pattern]?.[y] ?? [];
        return (
          <section key={y} style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--heading)",
                marginBottom: 16,
              }}
            >
              {yearLabels[y]} — {pattern} Pattern
            </h2>

            {/* First year has a single PDF, so it keeps one full-width row */}
            <div
              className="syllabus-grid"
              style={y === "FE" ? { gridTemplateColumns: "minmax(0, 1fr)" } : undefined}
            >
              {branches.map((b) => {
                const unavailable = b.url === "#";
                return (
                  <div
                    key={b.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 16px",
                      border: "var(--border-w) solid var(--border)",
                      borderRadius: 12,
                      background: "var(--surface2)",
                      // the 4th-year placeholder sits in the third column
                      ...(comingSoonYear ? { gridColumn: 3 } : {}),
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
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
                          padding: "8px 14px",
                          borderRadius: 8,
                          border: "none",
                          background: "var(--gold)",
                          color: "#ffffff",
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                          transition: "background .15s",
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--gold-dim)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "var(--gold)";
                        }}
                      >
                        <DownloadIcon /> Download PDF
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Disclaimer */}
      <p
        style={{
          marginTop: 12,
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
