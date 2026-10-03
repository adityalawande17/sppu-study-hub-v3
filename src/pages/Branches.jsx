import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { branchMeta } from "../data/branches";
import BranchLogo from "../components/BranchLogo";

export default function Branches() {
  useSEO({
    title:
      "SPPU Engineering Branches — CS IT AIDS AIML ME Civil EE ETC | SPPUStudyHUB",
    description:
      "Browse SPPU engineering study materials by branch. Computer Science, IT, Mechanical, Civil, Electrical, E and TC. SE, TE and BE subjects with notes and question papers.",
  });
  return (
    <div className="page-wrap branches-page">
      <div
        className="section-header"
        style={{ borderTop: "none", paddingTop: 28, marginBottom: 28 }}
      >
        <h1 className="section-title">Engineering Branches</h1>
        <span className="section-sub">Select a branch to browse subjects</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 14,
          marginBottom: 40,
        }}
        className="branch-grid branches-grid"
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
              border: "var(--border-w) solid var(--border)",
              borderRadius: 14,
              textDecoration: "none",
              transition: "all .2s",
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
            <BranchLogo branch={b} size={46} />
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
    </div>
  );
}
