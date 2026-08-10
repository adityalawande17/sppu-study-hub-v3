import { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { useApp } from "../context/AppContext";
import UnitAccordion from "../components/UnitAccordion";
import PracticalAccordion from "../components/PracticalAccordion";
import PYQAccordion from "../components/PYQAccordion";
import ShareBar from "../components/ShareBar";
import { searchIndex } from "../data/branches";
import { feSearchIndex } from "../data/feSubjects";

const modules = import.meta.glob("../data/subjects/**/*.json");

const allIndex = [...feSearchIndex, ...searchIndex];

const DlIcon = () => (
  <svg
    width="11"
    height="11"
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
const BookmarkFill = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);
const BookmarkEmpty = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

// defaultPracticals now live inside PracticalAccordion itself
/*const defaultPYQ = [
  { year: "2024", exam: "Nov / Dec 2024", url: "#" },
  { year: "2024", exam: "April / May 2024", url: "#" },
  { year: "2023", exam: "Nov / Dec 2023", url: "#" },
  { year: "2023", exam: "April / May 2023", url: "#" },
  { year: "2022", exam: "Nov / Dec 2022", url: "#" },
  { year: "2022", exam: "April / May 2022", url: "#" },
  { year: "2021", exam: "Nov / Dec 2021", url: "#" },
  { year: "2020", exam: "Nov / Dec 2020", url: "#" },
]; */

export default function Subject() {
  const { code } = useParams();
  const { state } = useLocation();
  const { toggleSaved, isSaved, switchPattern, pattern } = useApp();
  const navigate = useNavigate();

  const subject = state ||
    allIndex.find((s) => s.code === code) || {
      code,
      name: code,
      branch: "",
      sem: "",
      credits: 0,
    };
  const saved = isSaved(code);

  const [content, setContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);
  useEffect(() => {
    setContent(null);
    setContentLoading(true);
    const path = Object.keys(modules).find(p =>
      p.split("/").pop().replace(".json", "") === code
    );
    if (!path) { setContentLoading(false); return; }
    modules[path]().then(m => { setContent(m.default ?? null); setContentLoading(false); });
  }, [code]);
  //const practicals = content?.practicals || undefined; // undefined → PracticalAccordion uses its own defaults
  //const pyq = content?.pyq || defaultPYQ;
  const books = content?.books || [];
  //const units = content?.units || undefined;

  const hasUnits = content?.units && content.units.length > 0;
  const hasPracticals = content?.practicals && content.practicals.length > 0;
  const hasPYQ = content?.pyq && content.pyq.length > 0;
  const hasBooks = content?.books && content.books.length > 0;

  const units = hasUnits ? content.units : null;
  const practicals = hasPracticals ? content.practicals : null;
  const pyq = hasPYQ ? content.pyq : null;

  const hasAnyContent = hasUnits || hasPracticals || hasPYQ;
  const is2024Pattern = pattern === "2024";

  useSEO({
    title: `${subject.name} Notes & Papers — SPPU ${subject.branch} ${subject.sem} | SPPUStudyHUB`,
    description: `Free notes, question papers and practicals for ${subject.name} (${subject.code}). SPPU ${subject.branch} ${subject.sem}. Download unit-wise PDFs.`,
    schema: {
      "@context": "https://schema.org",
      "@type": "Course",
      name: subject.name,
      description: `Free study materials for ${subject.name} - SPPU`,
      provider: {
        "@type": "Organization",
        name: "Savitribai Phule Pune University",
      },
    },
  });

  const isFirstYear = subject.branch === "First Year";

  return (
    <div className="page-wrap">
      <div className="breadcrumb">
        <Link to="/" className="bc-link">
          Home
        </Link>
        <span className="bc-sep">›</span>
        <Link
          to={isFirstYear ? "/first-year" : "/branches"}
          className="bc-link"
        >
          {isFirstYear ? "First Year" : "Branches"}
        </Link>
        {!isFirstYear && subject.branchKey && (
          <>
            <span className="bc-sep">›</span>
            <Link to={`/branches/${subject.branchKey}`} className="bc-link">
              {subject.branch}
            </Link>
          </>
        )}
        <span className="bc-sep">›</span>
        <span
          style={{
            color: "var(--text-3)",
            maxWidth: 200,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {subject.name}
        </span>
      </div>

      <div className="subject-header">
        <h1>{subject.name}</h1>
        <div className="subject-meta">
          {subject.branch && (
            <span>
              <span className="meta-dot" /> {subject.branch}
            </span>
          )}
          {subject.sem && (
            <span>
              <span className="meta-dot" /> {subject.sem}
            </span>
          )}
          {subject.credits > 0 && (
            <span>
              <span className="meta-dot" /> {subject.credits} Credits
            </span>
          )}
          <span>
            <span className="meta-dot" /> SPPU
          </span>
        </div>
        <div className="subject-action-row">
          <div
            style={{
              fontSize: 12,
              color: "var(--text-4)",
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              background: "var(--surface2)",
              border: "var(--border-w) solid var(--border)",
              borderRadius: 16,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#16a34a",
                display: "inline-block",
              }}
            />
            Updated: {subject.updated || "Jan 2025"}
          </div>
          <button
            onClick={() => toggleSaved(subject)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 13px",
              border: `1px solid ${saved ? "var(--gold-dim)" : "var(--border-2)"}`,
              borderRadius: 8,
              background: saved ? "var(--gold-pale)" : "var(--surface)",
              color: saved ? "var(--gold-dim)" : "var(--text-3)",
              fontSize: 13,
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            {saved ? <BookmarkFill /> : <BookmarkEmpty />}
            {saved ? "Saved" : "Save"}
          </button>
          <div className="subject-action-right">
            <ShareBar title={`${subject.name} — Notes & Question Papers`} />
          </div>
        </div>
      </div>

      {/* <div className="ad-slot">
        <div>
          <p className="ad-label">Advertisement</p>
          <p>Google AdSense</p>
        </div>
      </div> */}

      {is2024Pattern && (
        <div
          style={{
            background: "var(--gold-pale)",
            border: "1px solid var(--gold-dim)",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--heading)",
                margin: "0 0 5px",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              Content missing for this subject?
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-3)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              The <strong>2019 pattern</strong> covers the same syllabus as 2024
              — notes and question papers from 2019 are fully applicable here.
              Switch pattern to browse available resources.
            </p>
          </div>
          <button
            onClick={() => {
              switchPattern("2019");
              navigate("/branches");
            }}
            style={{
              flexShrink: 0,
              padding: "9px 18px",
              borderRadius: 8,
              border: "1px solid var(--gold-dim)",
              background: "var(--gold)",
              color: "#111",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              whiteSpace: "nowrap",
              transition: "opacity .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Switch to 2019 Pattern →
          </button>
        </div>
      )}

      <div className="material-grid">
        {/* ✅ EMPTY STATE */}
        {!hasAnyContent && !contentLoading && (
          <div
            style={{
              border: "var(--border-w) solid var(--border)",
              borderRadius: 14,
              padding: "28px 24px",
              background: "var(--surface2)",
              textAlign: "center",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "var(--gold-pale)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--heading)", marginBottom: 8 }}>
              No content yet for this subject
            </div>
            <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.65, marginBottom: 20 }}>
              Do you have notes, a question paper, or practical files for this subject?
              Even a single question paper helps a fellow student — share what you have and we'll publish it.
            </p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfU-ODbKRwF-5kpThogiLVHKcOWggi3lVJDDnoP3eBHo33nmw/viewform?usp=sharing&ouid=102365635652061337866"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", textDecoration: "none", fontSize: 13 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Contribute content
            </a>
          </div>
        )}

        {/* PYQ */}
        {hasPYQ && (
          <div className="mat-section">
            <div className="mat-section-head">
              <div className="mat-section-title">
                Previous Year Question Papers{" "}
                <span className="badge badge-pyq">PYQ</span>
              </div>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                University exam papers
              </span>
            </div>
            <div className="mat-section-body">
              <div className="info-strip">
                Note : Section might also contain question papers from 2019
                pattern, as the syllabus is same can refer them as well.
              </div>
              <PYQAccordion
                pyq={pyq}
                subjectCode={code}
                subjectName={subject.name}
              />
            </div>
          </div>
        )}

        {/* Notes */}
        {hasUnits && (
          <div className="mat-section">
            <div className="mat-section-head">
              <div className="mat-section-title">
                Unit Notes <span className="badge badge-notes">Notes</span>
              </div>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                Unit 1 to 6
              </span>
            </div>
            <div className="mat-section-body">
              <UnitAccordion units={units} subjectCode={code} />
            </div>
          </div>
        )}

        {/* Practicals */}
        {hasPracticals && (
          <div className="mat-section">
            <div className="mat-section-head">
              <div className="mat-section-title">
                Practical Material{" "}
                <span className="badge badge-practical">Lab</span>
              </div>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                {practicals
                  ? `${practicals.length} practicals`
                  : "Step-by-step guides"}
              </span>
            </div>
            <div className="mat-section-body">
              {hasPracticals && <PracticalAccordion practicals={practicals} />}
            </div>
          </div>
        )}

        {/* Books */}
        {hasBooks && (
          <div className="mat-section">
            <div className="mat-section-head">
              <div className="mat-section-title">
                Recommended Textbooks{" "}
                <span className="badge badge-books">Books</span>
              </div>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                Affiliate links
              </span>
            </div>
            <div className="mat-section-body">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                {(books.length > 0
                  ? books
                  : [
                      {
                        title: "Standard Reference Textbook",
                        author: "Standard Author",
                        edition: "SPPU Edition",
                        price: "Rs. 450",
                        amazonUrl: "#",
                        flipkartUrl: "#",
                      },
                      {
                        title: "Exam Guide and Solved Papers",
                        author: "SPPU 2019 Pattern",
                        edition: "Latest Edition",
                        price: "Rs. 280",
                        amazonUrl: "#",
                        flipkartUrl: "#",
                      },
                    ]
                ).map((b, i) => (
                  <div
                    key={i}
                    style={{
                      background: "var(--surface)",
                      border: "var(--border-w) solid var(--border)",
                      borderRadius: 12,
                      padding: 15,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      transition: "all .18s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--gold-dim)";
                      e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 52,
                          background: "var(--navy)",
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 8,
                          fontWeight: 700,
                          color: "var(--gold)",
                          letterSpacing: 0.3,
                          textAlign: "center",
                          flexShrink: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        REF
                        <br />
                        BOOK
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--heading)",
                            lineHeight: 1.4,
                          }}
                        >
                          {b.title}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--text-3)",
                            marginTop: 3,
                          }}
                        >
                          {b.author}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--gold-dim)",
                            marginTop: 4,
                          }}
                        >
                          {b.price}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 6,
                        marginTop: "auto",
                      }}
                    >
                      <a
                        href={b.amazonUrl}
                        target="_blank"
                        rel="noopener sponsored"
                        style={{
                          display: "block",
                          textAlign: "center",
                          padding: "7px 0",
                          background: "var(--navy)",
                          color: "#fff",
                          borderRadius: 7,
                          fontSize: 11,
                          fontWeight: 500,
                          textDecoration: "none",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Amazon
                      </a>
                      <a
                        href={b.flipkartUrl}
                        target="_blank"
                        rel="noopener sponsored"
                        style={{
                          display: "block",
                          textAlign: "center",
                          padding: "7px 0",
                          background: "var(--surface2)",
                          color: "var(--heading)",
                          borderRadius: 7,
                          fontSize: 11,
                          fontWeight: 500,
                          textDecoration: "none",
                          border: "var(--border-w) solid var(--border)",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Flipkart
                      </a>
                    </div>
                    <p
                      style={{
                        fontSize: 10,
                        color: "var(--text-4)",
                        textAlign: "center",
                        margin: 0,
                      }}
                    >
                      Affiliate link — supports this site
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
