import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--navy)",
        color: "rgba(255,255,255,.5)",
        padding: "40px 0 28px",
        borderTop: "1px solid rgba(255,255,255,.06)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40,
            marginBottom: 32,
          }}
          className="footer-grid"
        >
          <div>
            <div
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: "#fff",
                fontSize: 20,
                marginBottom: 10,
                letterSpacing: "-0.3px",
              }}
            >
              SPPU<span style={{ color: "var(--gold)" }}>Study</span>Hub
            </div>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.65,
                color: "rgba(255,255,255,.4)",
                maxWidth: 280,
              }}
            >
              Free study materials for SPPU engineering students. Notes,
              question papers, and practicals for all branches and years.
            </p>
          </div>
          {[
            {
              head: "Study",
              links: [
                ["First Year", "/first-year"],
                ["Branches", "/branches"],
                ["Tools", "/tools"],
                ["News", "/news"],
              ],
            },
            {
              head: "Branches",
              links: [
                ["Computer Science", "/branches/cs"],
                ["Information Tech", "/branches/it"],
                ["Mechanical", "/branches/me"],
                ["Civil", "/branches/ce"],
              ],
            },
            {
              head: "Info",
              links: [
                ["About Us", "/about"],
                ["Contact", "/contact"],
                ["Privacy Policy", "/privacy"],
                ["Terms of Use", "/terms"],
              ],
            },
          ].map((col) => (
            <div key={col.head}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,.25)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 14,
                }}
              >
                {col.head}
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                {col.links.map(([label, path]) => (
                  <Link
                    key={path}
                    to={path}
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,.45)",
                      textDecoration: "none",
                      transition: "color .15s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "var(--gold)")}
                    onMouseLeave={(e) =>
                      (e.target.style.color = "rgba(255,255,255,.45)")
                    }
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.06)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,.25)",
              lineHeight: 1.5,
              maxWidth: 600,
            }}
          >
            All content is for educational purposes only. Not affiliated with
            Savitribai Phule Pune University.
          </p>
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,.2)",
              whiteSpace: "nowrap",
            }}
          >
            2026 SPPUStudyHUB
          </p>
        </div>
      </div>
      <style>{`@media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important;gap:24px!important}}@media(max-width:480px){.footer-grid{grid-template-columns:1fr!important}}`}</style>
    </footer>
  );
}
