import { useParams, useLocation, Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { useApp } from "../context/AppContext";
import UnitAccordion from "../components/UnitAccordion";
import PracticalAccordion from "../components/PracticalAccordion";
import { searchIndex } from "../data/branches";
import { feSearchIndex } from "../data/feSubjects";
import subjectData from "../data/subjects/TE-CS-502.json";

//First year Subjects Common
//sem 1
// import m1 from "../data/subjects/fe/BSC-101-BES.json";
// import phy from "../data/subjects/fe/BSC-102-BES.json";
// import chem from "../data/subjects/fe/BSC-103-BES.json";
// import bee from "../data/subjects/fe/ESC-101-ETC.json";
// import beee from "../data/subjects/fe/ESC-102-ELE.json";
// import eg from "../data/subjects/fe/ESC-103-MEC.json";
// import mech from "../data/subjects/fe/ESC-104-CVL.json";
// import fpl from "../data/subjects/fe/ESC-105-COM.json";
// import workshop from "../data/subjects/fe/VSE-101.json";
// import comm from "../data/subjects/fe/AEC-101.json";
// import cc1 from "../data/subjects/fe/CCC-101.json";

//sem 2
// import m2 from "../data/subjects/fe/BSC-151-BES.json";
// import pps from "../data/subjects/fe/PCC-151-ITT.json";
// import dt from "../data/subjects/fe/VSE-102.json";
// import iks from "../data/subjects/fe/IKS-151.json";
// import cc2 from "../data/subjects/fe/CCC-151.json";

const modules = import.meta.glob("../data/subjects/**/*.json", { eager: true });

const subjectFiles = {};

for (const path in modules) {
  const data = modules[path].default;

  // Use code inside JSON if available
  if (data?.code) {
    subjectFiles[data.code] = data;
  } else {
    // fallback → filename
    const fileName = path.split("/").pop().replace(".json", "");
    subjectFiles[fileName] = data;
  }
}

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
const defaultPYQ = [
  { year: "2024", exam: "Nov / Dec 2024", url: "#" },
  { year: "2024", exam: "April / May 2024", url: "#" },
  { year: "2023", exam: "Nov / Dec 2023", url: "#" },
  { year: "2023", exam: "April / May 2023", url: "#" },
  { year: "2022", exam: "Nov / Dec 2022", url: "#" },
  { year: "2022", exam: "April / May 2022", url: "#" },
  { year: "2021", exam: "Nov / Dec 2021", url: "#" },
  { year: "2020", exam: "Nov / Dec 2020", url: "#" },
];

export default function Subject() {
  const { code } = useParams();
  const { state } = useLocation();
  const { toggleSaved, isSaved } = useApp();

  const subject = state ||
    allIndex.find((s) => s.code === code) || {
      code,
      name: code,
      branch: "",
      sem: "",
      credits: 0,
    };
  const saved = isSaved(code);

  // Use the per-subject JSON file if available, fall back to defaults
  // add one line per subject file you create (below)

  // const subjectFiles = {
  //   "TE-CS-502": subjectData,
  //   "BSC-101-BES": m1,
  //   "BSC-102-BES": phy,
  //   "BSC-103-BES": chem,
  //   "ESC-101-ETC": bee, // Basic Electronics
  //   "ESC-102-ELE": beee, // Basic Electrical
  //   "ESC-103-MEC": eg,
  //   "ESC-104-CVL": mech,
  //   "ESC-105-COM": fpl,
  //   "VSE-101": workshop,
  //   "AEC-101": comm,
  //   "CCC-101": cc1,

  //   "BSC-151-BES": m2,
  //   "PCC-151-ITT": pps,
  //   "VSE-102": dt,
  //   "IKS-151": iks,
  //   "CCC-151": cc2,
  // };
  const content = subjectFiles[code] || null;
  const practicals = content?.practicals || undefined; // undefined → PracticalAccordion uses its own defaults
  const pyq = content?.pyq || defaultPYQ;
  const books = content?.books || [];
  const units = content?.units || undefined;

  useSEO({
    title: `${subject.name} Notes & Papers — SPPU ${subject.branch} ${subject.sem} | sppuwalestudent`,
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--text-4)",
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
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
        </div>
      </div>

      <div className="ad-slot">
        <div>
          <p className="ad-label">Advertisement</p>
          <p>Google AdSense</p>
        </div>
      </div>

      <div className="material-grid">
        {/* Notes */}
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
            <UnitAccordion units={units} />
          </div>
        </div>

        {/* PYQ */}
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
              Official SPPU end-semester papers. Practicing these helps
              understand the exam pattern and important topics.
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
                gap: 10,
              }}
            >
              {pyq.map((p, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: 14,
                    background: "var(--surface2)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--gold-dim)";
                    e.currentTarget.style.background = "var(--gold-pale)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--surface2)";
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: 22,
                      color: "var(--heading)",
                    }}
                  >
                    {p.year}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-3)",
                      lineHeight: 1.5,
                    }}
                  >
                    End Semester
                    <br />
                    {p.exam}
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: "auto",
                      padding: "7px 0",
                      background: "var(--navy)",
                      color: "#fff",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      transition: "opacity .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = ".82")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    <DlIcon /> Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Practicals */}
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
            <PracticalAccordion practicals={practicals} />
          </div>
        </div>

        {/* Books */}
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
                    border: "1px solid var(--border)",
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
                        border: "1px solid var(--border)",
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
      </div>

      <div className="ad-slot" style={{ marginBottom: 40 }}>
        <div>
          <p className="ad-label">Advertisement</p>
          <p>Google AdSense</p>
        </div>
      </div>
    </div>
  );
}
