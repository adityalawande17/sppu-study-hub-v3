import { useState } from "react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "sppu_cookie_consent";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(CONSENT_KEY) !== "accepted";
    } catch {
      return true;
    }
  });

  function acceptCookies() {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {}
    setVisible(false);
  }

  function declineCookies() {
    try {
      localStorage.setItem(CONSENT_KEY, "declined");
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="cookie-consent-banner"
      role="region"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        left: 24,
        bottom: 24,
        zIndex: 520,
        width: "min(560px, calc(100vw - 48px))",
        background: "var(--surface)",
        border: "var(--border-w) solid var(--border)",
        borderRadius: 14,
        boxShadow: "var(--shadow-lg)",
        padding: "15px 16px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        animation: "fadeUp .35s ease both",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          flexShrink: 0,
          background: "var(--gold-pale)",
          color: "var(--gold-dim)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="8" cy="9" r="1" />
          <circle cx="15" cy="8" r="1" />
          <circle cx="16" cy="15" r="1" />
          <circle cx="10" cy="16" r="1" />
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--heading)",
            marginBottom: 3,
          }}
        >
          We use cookies
        </div>
        <p
          style={{
            margin: 0,
            color: "var(--text-3)",
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          We use cookies and browser storage to remember preferences, improve
          the site, and support ads. Read our{" "}
          <Link
            to="/privacy"
            style={{
              color: "var(--gold-dim)",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <button
          className="btn btn-ghost"
          onClick={declineCookies}
          style={{
            borderRadius: 999,
            padding: "9px 14px",
            fontSize: 12,
            whiteSpace: "nowrap",
          }}
        >
          Decline
        </button>
        <button
          className="btn btn-primary"
          onClick={acceptCookies}
          style={{
            borderRadius: 999,
            padding: "9px 16px",
            fontSize: 12,
            whiteSpace: "nowrap",
          }}
        >
          Accept
        </button>
      </div>

      <style>{`
        @media(max-width:680px){
          .cookie-consent-banner{
            left:16px!important;
            right:16px!important;
            bottom:16px!important;
            width:auto!important;
            align-items:flex-start!important;
            flex-wrap:wrap!important;
          }
          .cookie-consent-banner > div:last-of-type{
            width:100%!important;
          }
          .cookie-consent-banner > div:last-of-type .btn{
            flex:1!important;
            justify-content:center!important;
          }
        }
      `}</style>
    </div>
  );
}
