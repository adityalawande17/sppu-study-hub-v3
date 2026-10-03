import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { useApp } from "../context/AppContext";
import { useLoginCount } from "../hooks/useLoginCount";
import { branchMeta } from "../data/branches";
import Icon from "../components/layout/icons";
import CookieConsentBanner from "../components/CookieConsentBanner";
import LoginPromoModal from "../components/LoginPromoModal";

// One divider between every section, same gap above and below.
const dividerStyle = {
  borderTop: "var(--border-w) solid var(--border)",
  margin: "40px 0",
};

const features = [
  {
    icon: "file",
    title: "Notes & PYQs",
    desc: "Unit-wise notes and previous-year question papers for every SPPU subject, 2019 and 2024 patterns.",
  },
  {
    icon: "tool",
    title: "AI explanations",
    desc: "Exam-style answers to PYQs, generated with Claude and cached so repeat questions are instant.",
  },
  {
    icon: "users",
    title: "Community Notes",
    desc: "Students share their own notes. An admin reviews each upload before it goes live.",
  },
  {
    icon: "layers",
    title: "Practicals",
    desc: "Step-by-step practical guides and lab resources for the subjects that have them.",
  },
  {
    icon: "clock",
    title: "Progress tracking",
    desc: "Mark units and questions as done and see how far through each subject you are.",
  },
  {
    icon: "grid",
    title: "CGPA tracker",
    desc: "Log your semester SGPA and watch your CGPA update automatically.",
  },
];

const faqs = [
  {
    q: "Is SPPUStudyHUB free to use?",
    a: "Yes. Notes, question papers and practicals are free, with no premium tier.",
  },
  {
    q: "Which branches and patterns are covered?",
    a: "All major engineering branches across both the 2019 and 2024 patterns.",
  },
  {
    q: "Do I need an account?",
    a: "No. Browsing needs no sign-in. A free Google sign-in unlocks progress tracking, the CGPA tracker and AI explanations.",
  },
  {
    q: "How do I upload my own notes?",
    a: 'Open any subject page and click "Upload Notes" in the Community Notes section. Every upload is reviewed by an admin before it goes live.',
  },
  {
    q: "Are the previous-year question papers verified?",
    a: "Yes. PYQs are added and checked by the team before they are published.",
  },
  {
    q: "How do AI explanations work?",
    a: "Pick a question from a subject's PYQ list and click Explain. Each account gets a limited number of explanations per day.",
  },
];

export default function Home() {
  const { user, sessionLoading, signInWithGoogle } = useApp();
  const loginCount = useLoginCount();
  const [noticeDismissed, setNoticeDismissed] = useState(
    () => sessionStorage.getItem("notice_dismissed") === "1",
  );
  const [loginPromoOpen, setLoginPromoOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (sessionLoading || user) return;
    if (localStorage.getItem("sppu_login_promo_seen") === "1") return;
    setLoginPromoOpen(true);
  }, [user, sessionLoading]);

  function dismissLoginPromo() {
    try {
      localStorage.setItem("sppu_login_promo_seen", "1");
    } catch {}
    setLoginPromoOpen(false);
  }

  function dismissNotice() {
    sessionStorage.setItem("notice_dismissed", "1");
    setNoticeDismissed(true);
  }

  useSEO({
    title: "SPPUStudyHUB - SPPU Notes, Question Papers and AI Explanations",
    description:
      "Free SPPU engineering notes, previous-year question papers, practicals and AI explanations for all branches. 2019 and 2024 patterns.",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "SPPUStudyHUB",
      url: "https://sppustudyhub.in",
    },
  });

  const branchCount = Object.keys(branchMeta).length;
  const previewSubjects = Object.values(branchMeta).slice(0, 4);

  return (
    <div className="home">
      {/* Content notice popup */}
      {!noticeDismissed && (
        <div className="home-notice">
          <div className="home-notice-title">Calling Mechanical &amp; Civil students!</div>
          <p>
            We're looking for students from Mechanical and Civil branches to help us add
            content.{" "}
            <Link to="/contact" onClick={dismissNotice}>
              Contact us
            </Link>{" "}
            if you'd like to contribute!
          </p>
          <button onClick={dismissNotice} title="Dismiss" aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-copy">
          <div className="home-eyebrow">
            <span className="home-dot" />
            {loginCount !== null
              ? `${loginCount.toLocaleString("en-IN")}+ students have signed in`
              : "Free for every SPPU engineering student"}
          </div>
          <h1>
            <em>One stop</em>
            <br />
            learning platform
            <br />
            for SPPU engineers
          </h1>
          <p className="home-lede">
            Notes, previous-year question papers, practicals and AI explanations for every
            SPPU engineering subject, in both patterns.
          </p>
          <div className="home-ctas">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">
                Open dashboard →
              </Link>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => signInWithGoogle(window.location.pathname)}
              >
                Start for free →
              </button>
            )}
            <Link to="/branches" className="btn btn-outline">
              Browse subjects
            </Link>
          </div>
        </div>

        <div className="home-preview" aria-hidden="true">
          <div className="home-preview-head">
            <span>Your subjects</span>
            <span className="home-preview-pill">2024 pattern</span>
          </div>
          {previewSubjects.map((b) => (
            <div key={b.key} className="home-preview-row">
              <span className="home-preview-abbr" style={{ background: b.color }}>
                {b.abbr}
              </span>
              <span>{b.short}</span>
              <Icon name="home" size={14} />
            </div>
          ))}
          <div className="home-preview-note">
            <span className="home-preview-pill">New</span>
            <span>Community Notes are live on every subject page</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="home-stats">
        {loginCount !== null && (
          <div className="home-stat">
            <div className="home-stat-value">{loginCount.toLocaleString("en-IN")}+</div>
            <div className="home-stat-label">students signed in</div>
          </div>
        )}
        <div className="home-stat">
          <div className="home-stat-value">{branchCount}</div>
          <div className="home-stat-label">engineering branches</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-value">2</div>
          <div className="home-stat-label">patterns: 2019 and 2024</div>
        </div>
      </section>

      <div style={dividerStyle} />

      {/* Features */}
      <section>
        <h2 className="home-section-title">Everything you need for the semester</h2>
        <p className="home-section-sub">Built around how SPPU exams are actually written.</p>
        <div className="home-features">
          {features.map((f) => (
            <div key={f.title} className="home-feature">
              <span className="home-feature-icon">
                <Icon name={f.icon} size={16} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={dividerStyle} />

      {/* Community Notes */}
      <section className="home-community">
        <div>
          <span className="home-eyebrow">New</span>
          <h2 className="home-section-title">Community Notes</h2>
          <p className="home-section-sub">
            Upload your notes for any subject. An admin reviews each one, then it appears on
            that subject's page for every student.
          </p>
          <div className="home-checks">
            {["Free to share", "Admin reviewed", "Credited or anonymous"].map((t) => (
              <span key={t}>
                <Icon name="file" size={13} /> {t}
              </span>
            ))}
          </div>
        </div>
        <Link to="/community-notes" className="btn btn-primary">
          How it works →
        </Link>
      </section>

      <div style={dividerStyle} />

      {/* FAQ */}
      <section>
        <h2 className="home-section-title">Frequently asked questions</h2>
        <div className="home-faq">
          {faqs.map((faq, i) => {
            const open = openFaq === i;
            return (
              <div key={faq.q} className="home-faq-item">
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                >
                  <span>{faq.q}</span>
                  <span className={`home-faq-chevron${open ? " is-open" : ""}`} />
                </button>
                {open && <p>{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <LoginPromoModal open={loginPromoOpen} onClose={dismissLoginPromo} />
      <CookieConsentBanner />
    </div>
  );
}
