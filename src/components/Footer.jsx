import { Link } from "react-router-dom";

const COLUMNS = [
  {
    head: "Study",
    links: [
      ["First Year", "/first-year"],
      ["Branches", "/branches"],
      ["Syllabus PDFs", "/syllabus"],
      ["Blog", "/blog"],
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
      ["Contributors", "/contributions"],
      ["Community Notes", "/community-notes"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <div className="site-footer-logo">SPPUStudyHUB</div>
            <p>
              Free study materials for SPPU engineering students. Notes, question papers
              and practicals for all branches and years.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.head} className="site-footer-col">
              <h4>{col.head}</h4>
              <nav>
                {col.links.map(([label, path]) => (
                  <Link key={path} to={path}>
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="site-footer-bottom">
          <p>
            All content is for educational purposes only. Not affiliated with Savitribai
            Phule Pune University.
          </p>
          <p>2026 SPPUStudyHUB</p>
        </div>
      </div>
    </footer>
  );
}
