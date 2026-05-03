import { useState } from "react";
import { useSEO } from "../hooks/useSEO";
import ContributeModal from "../components/ContributeModal";

export default function About() {
  const [open, setOpen] = useState(false);
  useSEO({
    title: "About SPPUStudyHUB — Free Solved Question Papers, Notes",
    description:
      "About SPPUStudyHub — free SPPU engineering study hub providing notes, question papers and practical tutorials for Pune University students.",
  });

  return (
    <div className="page-wrap">
      <div className="subject-header" style={{ paddingTop: 28 }}>
        <h1>About SPPUStudyHUB</h1>
        <p style={{ color: "var(--text-3)", fontSize: 14, marginTop: 6 }}>
          Your free resource hub for SPPU engineering students
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
          marginBottom: 28,
        }}
        className="about-grid"
      >
        {[
          {
            title: "Our Mission",
            text: "SPPU StudyHub was created to give every SPPU engineering student easy access to quality study materials without any cost. Academic resources should be freely available to all students regardless of background.",
          },
          {
            title: "What We Offer",
            text: "Unit-wise notes, step-by-step practical tutorials, previous year question papers, SPPU syllabus PDFs, student tools like SGPA calculators, and the latest SPPU news — all in one place. Updated for both 2019 and 2024 patterns.",
          },
          {
            title: "Disclaimer",
            text: "All materials are for educational purposes only. We do not claim ownership of any university materials. Students should verify information against official SPPU resources. ",
          },
          {
            title: "Contribute",
            text: "Have notes, solved papers, or practical files? Share them with the SPPU community. Fill in the contribute form and our team will review and publish your materials within a week.",
            action: true,
          },
        ].map((c) => (
          <div
            key={c.title}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 24,
            }}
          >
            <h3
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 19,
                color: "var(--heading)",
                marginBottom: 10,
              }}
            >
              {c.title}
            </h3>
            <p
              style={{ color: "var(--text-3)", fontSize: 14, lineHeight: 1.75 }}
            >
              {c.text}
            </p>
            {c.action && (
              <button
                className="btn btn-primary"
                style={{ fontSize: 14, padding: "9px 18px", marginTop: 14 }}
                onClick={() => setOpen(true)}
              >
                Contribute Now
              </button>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          background: "var(--navy)",
          borderRadius: 14,
          padding: "30px 32px",
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
          <h3
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20,
              color: "#fff",
              marginBottom: 5,
            }}
          >
            Share your study materials
          </h3>
          <p style={{ color: "rgba(255,255,255,.5)", fontSize: 14 }}>
            Help thousands of SPPU students by contributing your notes.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="btn btn-gold"
          style={{ flexShrink: 0, position: "relative" }}
        >
          Contribute
        </button>
      </div>

      <div className="ad-slot" style={{ marginBottom: 40 }}>
        <div>
          <p className="ad-label">Advertisement</p>
          <p>Google AdSense</p>
        </div>
      </div>
      <ContributeModal open={open} onClose={() => setOpen(false)} />
      <style>{`@media(max-width:640px){.about-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
