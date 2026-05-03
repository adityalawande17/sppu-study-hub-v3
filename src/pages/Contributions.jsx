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

      {/* Contributors grid */}
      {contributors.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--text-3)",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>🙌</div>
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 14,
            marginBottom: 40,
          }}
        >
          {contributors.map((c, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "18px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                transition: "all .2s",
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
              {/* Avatar */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--navy)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--gold)",
                  flexShrink: 0,
                  fontFamily: "'DM Serif Display', serif",
                }}
              >
                {c.avatar ? (
                  <img
                    src={c.avatar}
                    alt={c.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  c.name.charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--heading)",
                    marginBottom: 2,
                  }}
                >
                  {c.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-3)",
                    marginBottom: 8,
                  }}
                >
                  {c.branch} · {c.year}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {c.subjects.map((s, j) => (
                    <span
                      key={j}
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: "var(--gold-pale)",
                        color: "var(--gold-dim)",
                        border: "1px solid var(--gold-dim)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--text-4)", marginTop: 8 }}
                >
                  {c.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ContributeModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
