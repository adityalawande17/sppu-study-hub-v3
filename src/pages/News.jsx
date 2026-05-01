import { useState } from "react";
import { useSEO } from "../hooks/useSEO";
import { newsItems, categoryLabels } from "../data/news";

const allCats = ["all", "result", "exam", "syllabus", "notice", "new"];
const catLabels = {
  all: "All",
  result: "Results",
  exam: "Exams",
  syllabus: "Syllabus",
  notice: "Notices",
  new: "New Content",
};

export default function News() {
  const [filter, setFilter] = useState("all");

  useSEO({
    title: "SPPU News and Updates | SPPUStudyHUB",
    description:
      "Latest SPPU news and updates — results declared, exam timetables, syllabus changes, hall tickets, and new study material uploads.",
  });

  const filtered =
    filter === "all"
      ? newsItems
      : newsItems.filter((n) => n.category === filter);

  return (
    <div className="page-wrap">
      <div
        style={{
          padding: "28px 0 22px",
          borderBottom: "1px solid var(--border)",
          marginBottom: 24,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 30,
              color: "var(--heading)",
              marginBottom: 6,
            }}
          >
            News and Updates
          </h1>
          <p style={{ color: "var(--text-3)", fontSize: 14 }}>
            Latest SPPU announcements, results, exam schedules and new content.
          </p>
        </div>
        <a
          href="https://unipune.ac.in"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{ fontSize: 13, gap: 5 }}
        >
          SPPU Official Website
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
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

      {/* Result CTA */}
      <div className="result-cta" style={{ marginBottom: 22 }}>
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              marginBottom: 3,
            }}
          >
            Check Your SPPU Result
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>
            Results are published on the official university portal at
            results.unipune.ac.in
          </div>
        </div>
        <a
          href="https://results.unipune.ac.in"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-gold"
          style={{ fontSize: 14, flexShrink: 0 }}
        >
          Check Result →
        </a>
      </div>

      {/* Category filter */}
      <div
        style={{ display: "flex", gap: 7, marginBottom: 20, flexWrap: "wrap" }}
      >
        {allCats.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: `1px solid ${filter === cat ? "var(--navy)" : "var(--border)"}`,
              background: filter === cat ? "var(--navy)" : "var(--surface)",
              color: filter === cat ? "#fff" : "var(--text-3)",
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            {catLabels[cat]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--text-3)",
          }}
        >
          <p>No updates in this category yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10, marginBottom: 40 }}>
          {filtered.map((item) => {
            const cat = categoryLabels[item.category];
            return (
              <div
                key={item.id}
                className="news-card"
                onClick={() => item.link && window.open(item.link, "_blank")}
                style={{ cursor: item.link ? "pointer" : "default" }}
              >
                <div className="news-dot" style={{ marginTop: 4 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 5,
                      flexWrap: "wrap",
                    }}
                  >
                    <span className={`badge ${cat.badge}`}>{cat.label}</span>
                    <span style={{ fontSize: 12, color: "var(--text-4)" }}>
                      {new Date(item.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--heading)",
                      marginBottom: 5,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-3)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </div>
                </div>
                {item.link && (
                  <div
                    style={{
                      flexShrink: 0,
                      alignSelf: "flex-start",
                      marginTop: 4,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--text-4)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="ad-slot" style={{ marginTop: 20, marginBottom: 40 }}>
        <div>
          <p className="ad-label">Advertisement</p>
          <p>Google AdSense</p>
        </div>
      </div>
    </div>
  );
}
