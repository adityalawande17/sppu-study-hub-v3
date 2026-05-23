import { useState } from "react";
import { useSEO } from "../hooks/useSEO";
import { contributors } from "../data/contributors";
import ContributeModal from "../components/ContributeModal";

export default function Contributions() {
  const [open, setOpen] = useState(false);

  useSEO({
    title: "Contributors | SPPUStudyHUB",
    description:
      "Students who contributed notes, question papers and practicals to our platform.",
  });

  return (
    <div className="page-wrap">
      {/* Header */}
      <div className="subject-header" style={{ paddingTop: 28 }}>
        <h1>Contributors</h1>
        <p style={{ color: "var(--text-3)", fontSize: 14, marginTop: 6 }}>
          Students who helped build this platform by sharing their notes and
          materials.
        </p>
      </div>

      {/* Contribute CTA at top */}
      <div
        style={{
          background: "var(--navy)",
          borderRadius: 14,
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          marginBottom: 32,
          position: "relative",
          overflow: "hidden",
        }}
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
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              marginBottom: 4,
            }}
          >
            Want to see your name here?
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>
            Share your notes or question papers and help thousands of SPPU
            students.
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="btn btn-gold"
          style={{ flexShrink: 0, position: "relative" }}
        >
          Contribute Materials
        </button>
      </div>

      {/* Contributors count */}
      <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 16 }}>
        {contributors.length} student{contributors.length !== 1 ? "s" : ""} have
        contributed so far
      </div>

      {/* Contributors list */}
      {contributors.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--text-3)",
          }}
        >
          <h3
            style={{ fontSize: 20, color: "var(--heading)", marginBottom: 8 }}
          >
            Be the first contributor
          </h3>
          <p>
            No one has contributed yet. Share your notes and be the first name
            on this page.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
          {contributors.map((c, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--heading)", whiteSpace: "nowrap" }}>
                  {c.name}
                </div>
                {c.college && (
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                    {c.college}
                  </div>
                )}
              </div>
              {c.linkedin && (
                <a
                  href={c.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    border: "1px solid #0a66c2",
                    color: "#0a66c2",
                    textDecoration: "none",
                    flexShrink: 0,
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0a66c2";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#0a66c2";
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <ContributeModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
