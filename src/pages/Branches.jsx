import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { branchMeta } from "../data/branches";

export default function Branches() {
  useSEO({
    title: "SPPU Engineering Branches — CS IT ME Civil EE ETC | SPPUStudyHUB",
    description:
      "Browse SPPU engineering study materials by branch. Computer Science, IT, Mechanical, Civil, Electrical, E and TC. SE, TE and BE subjects with notes and question papers.",
  });
  return (
    <div className="page-wrap">
      <div
        className="section-header"
        style={{ borderTop: "none", paddingTop: 28 }}
      >
        <h1 className="section-title">Engineering Branches</h1>
        <span className="section-sub">Select a branch to browse subjects</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          marginBottom: 40,
        }}
        className="branch-grid"
      >
        {Object.values(branchMeta).map((b) => (
          <Link
            key={b.key}
            to={`/branches/${b.key}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "20px 18px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              textDecoration: "none",
              transition: "all .2s",
              borderLeft: `4px solid ${b.color}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.transform = "";
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                background: b.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
                fontFamily: "'DM Serif Display', serif",
              }}
            >
              {b.abbr}
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--heading)",
                  marginBottom: 2,
                }}
              >
                {b.short}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-3)" }}>
                B.E. {b.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <style>{`@media(max-width:900px){.branch-grid{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:480px){.branch-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
