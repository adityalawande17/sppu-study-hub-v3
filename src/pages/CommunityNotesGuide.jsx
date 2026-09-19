import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

const steps = [
  {
    n: 1,
    title: "Upload your notes",
    desc: "Pick your subject, add a title, and upload a PDF, image, or Word doc — up to 10MB.",
  },
  {
    n: 2,
    title: "Held for review",
    desc: "Your upload isn't public yet — it sits in a queue until an admin looks at it.",
  },
  {
    n: 3,
    title: "Admin approves or removes it",
    desc: "An admin checks the file and either approves it or removes it. No in-between state.",
  },
  {
    n: 4,
    title: "Live for every student",
    desc: "Once approved, it appears on that subject's page for anyone to see and download.",
  },
];

export default function CommunityNotesGuide() {
  useSEO({
    title: "Community Notes | SPPUStudyHUB",
    description:
      "How SPPUStudyHUB's community notes work — upload, admin review, and sharing guidelines.",
  });

  return (
    <div className="page-wrap">
      <div className="subject-header" style={{ paddingTop: 28 }}>
        <h1>Community Notes</h1>
        <p style={{ color: "var(--text-3)", fontSize: 14, marginTop: 6 }}>
          Share your notes with every SPPU student on that subject's page —
          here's exactly how it works.
        </p>
      </div>

      <div style={{ display: "grid", gap: 14, marginBottom: 32 }}>
        {steps.map((step) => (
          <div
            key={step.n}
            style={{
              display: "flex",
              gap: 16,
              padding: "18px 20px",
              background: "var(--surface)",
              border: "var(--border-w) solid var(--border)",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--gold-pale)",
                border: "1px solid var(--gold-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'DM Serif Display', serif",
                fontSize: 15,
                color: "var(--gold-dim)",
              }}
            >
              {step.n}
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--heading)",
                  marginBottom: 4,
                }}
              >
                {step.title}
              </div>
              <div
                style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.6 }}
              >
                {step.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Warnings / guidelines — deliberately separate from the friendly
          step list above, since this is the block that actually matters
          legally/operationally. */}
      <div
        style={{
          background: "var(--gold-pale)",
          border: "1px solid var(--gold-dim)",
          borderRadius: 12,
          padding: "18px 22px",
          marginBottom: 32,
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--heading)",
            margin: "0 0 10px",
          }}
        >
          Before you upload
        </p>
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            color: "var(--text-3)",
            fontSize: 13,
            lineHeight: 1.8,
          }}
        >
          <li>
            Don't upload copyrighted material you don't have the right to
            share.
          </li>
          <li>Don't upload anything containing someone else's personal information.</li>
          <li>Don't upload offensive or harmful content.</li>
          <li>Admin can remove any note at any time, without notice.</li>
        </ul>
      </div>

      <div
        style={{
          background: "var(--navy)",
          borderRadius: 14,
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              marginBottom: 4,
            }}
          >
            Ready to share your notes?
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>
            Find your subject page and look for the Student Notes section.
          </div>
        </div>
        <Link to="/branches" className="btn btn-gold" style={{ flexShrink: 0 }}>
          Find your subject →
        </Link>
      </div>
    </div>
  );
}
