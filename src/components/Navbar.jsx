import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { branchMeta } from "../data/branches";

const MoonIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const SunIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const BookIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);
const ChevronDown = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const GoogleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);
const ExternalLink = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

function NavLink({ to, children, pathname }) {
  const active = pathname === to;
  return (
    <Link
      to={to}
      style={{
        padding: "7px 11px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        color: active ? "var(--nav-text)" : "var(--nav-text-dim)",
        textDecoration: "none",
        background: active ? "var(--nav-active-bg)" : "transparent",
        transition: "all .18s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--nav-text)";
        e.currentTarget.style.background = "var(--nav-hover-bg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = active
          ? "var(--nav-text)"
          : "var(--nav-text-dim)";
        e.currentTarget.style.background = active
          ? "var(--nav-active-bg)"
          : "transparent";
      }}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const {
    isDark,
    toggleTheme,
    saved,
    pattern,
    switchPattern,
    user,
    signInWithGoogle,
    signOut,
  } = useApp();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const megaRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
      if (megaRef.current && !megaRef.current.contains(e.target))
        setMegaOpen(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const dropdownLinkStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text)",
    textDecoration: "none",
    borderBottom: "var(--border-w) solid var(--border)",
    transition: "background .12s",
  };

  return (
    <>
      <header
        style={{
          background: "var(--nav-bg)",
          position: "sticky",
          top: 0,
          zIndex: 200,
          borderBottom: "1px solid var(--nav-border)",
        }}
      >
        {/* ── Main row ── */}
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", height: 60, gap: 8 }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontFamily: "'Black Ops One', serif",
              color: "var(--nav-text)",
              fontSize: 20,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
              letterSpacing: "-0.3px",
            }}
          >
            SPPU<span style={{ color: "var(--gold)" }}>StudyHUB</span>
          </Link>

          {/* Pattern switcher */}
          <div className="pattern-pill" style={{ marginLeft: 6 }}>
            {["2019", "2024"].map((p) => (
              <button
                key={p}
                className={`pattern-opt ${pattern === p ? "active" : ""}`}
                onClick={() => switchPattern(p)}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div
            className="hide-sm"
            style={{
              width: 1,
              height: 18,
              background: "var(--nav-border)",
              marginLeft: 4,
            }}
          />

          {/* Desktop nav */}
          <nav
            className="hide-sm"
            style={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <NavLink to="/" pathname={pathname}>
              Home
            </NavLink>
            {user && (
              <NavLink to="/dashboard" pathname={pathname}>
                Dashboard
              </NavLink>
            )}
            {/* Browse mega trigger */}
            <div ref={megaRef} style={{ position: "relative" }}>
              <button
                onClick={() => setMegaOpen((o) => !o)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "9px 11px",
                  borderRadius: 8,
                  border: "none",
                  background: megaOpen ? "var(--nav-active-bg)" : "transparent",
                  color: megaOpen ? "var(--nav-text)" : "var(--nav-text-dim)",
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  transition: "all .18s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--nav-text)";
                  e.currentTarget.style.background = "var(--nav-hover-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = megaOpen
                    ? "var(--nav-text)"
                    : "var(--nav-text-dim)";
                  e.currentTarget.style.background = megaOpen
                    ? "var(--nav-active-bg)"
                    : "transparent";
                }}
              >
                Browse <ChevronDown />
              </button>
            </div>

            <NavLink to="/syllabus" pathname={pathname}>
              Syllabus PDFs
            </NavLink>
            <NavLink to="/tools" pathname={pathname}>
              Tools
            </NavLink>
            <NavLink to="/news" pathname={pathname}>
              News
            </NavLink>
            <NavLink to="/history" pathname={pathname}>
              AI History
            </NavLink>
            <NavLink to="/contributions" pathname={pathname}>
              Contributors
            </NavLink>
          </nav>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Right side actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="hide-sm"
              style={{
                width: 34,
                height: 34,
                borderRadius: 20,
                border: "1px solid var(--nav-icon-border)",
                background: "var(--nav-icon-bg)",
                color: "var(--nav-text-dim)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .18s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--nav-icon-bg-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--nav-icon-bg)")
              }
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Auth — desktop */}
            {!user ? (
              <button
                onClick={() => signInWithGoogle()}
                className="hide-sm"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 12px",
                  borderRadius: 20,
                  border: "1px solid var(--nav-icon-border)",
                  background: "var(--nav-icon-bg)",
                  color: "var(--nav-text)",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all .18s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--nav-icon-bg-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--nav-icon-bg)")
                }
              >
                <GoogleIcon /> Sign in
              </button>
            ) : (
              <div
                ref={userMenuRef}
                style={{ position: "relative" }}
                className="hide-sm"
              >
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "4px 10px 4px 4px",
                    borderRadius: 20,
                    border: "1px solid var(--nav-icon-border)",
                    background: userMenuOpen
                      ? "var(--nav-icon-bg-hover)"
                      : "var(--nav-icon-bg)",
                    cursor: "pointer",
                    transition: "all .18s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "var(--nav-icon-bg-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = userMenuOpen
                      ? "var(--nav-icon-bg-hover)"
                      : "var(--nav-icon-bg)")
                  }
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      (
                        user.user_metadata?.full_name?.[0] ??
                        user.email?.[0] ??
                        "U"
                      ).toUpperCase()
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--nav-text)",
                      maxWidth: 90,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.user_metadata?.full_name?.split(" ")[0] ??
                      user.email?.split("@")[0]}
                  </span>
                  <ChevronDown />
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: "var(--surface)",
                      border: "var(--border-w) solid var(--border)",
                      borderRadius: 12,
                      boxShadow: "var(--shadow-lg)",
                      minWidth: 200,
                      zIndex: 300,
                      overflow: "hidden",
                    }}
                  >
                    {/* User info header */}
                    <div
                      style={{
                        padding: "12px 14px 10px",
                        borderBottom: "var(--border-w) solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--heading)",
                        }}
                      >
                        {user.user_metadata?.full_name ??
                          user.email?.split("@")[0]}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text-4)",
                          marginTop: 2,
                        }}
                      >
                        {user.email}
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      style={{ ...dropdownLinkStyle }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--surface2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                      My Dashboard
                    </Link>

                    <Link
                      to="/saved"
                      style={{
                        ...dropdownLinkStyle,
                        justifyContent: "space-between",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--surface2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                        </svg>
                        Saved Subjects
                      </div>
                      {saved.length > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            background: "var(--gold-pale)",
                            color: "var(--gold-dim)",
                            padding: "1px 7px",
                            borderRadius: 10,
                          }}
                        >
                          {saved.length}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/history"
                      style={{ ...dropdownLinkStyle }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--surface2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                      AI History
                    </Link>

                    <button
                      onClick={signOut}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        padding: "9px 14px",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#f87171",
                        background: "transparent",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        transition: "background .12s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(248,113,113,.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="show-sm"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: "1px solid var(--nav-icon-border)",
                background: mobileOpen
                  ? "var(--nav-active-bg)"
                  : "var(--nav-icon-bg)",
                color: "var(--nav-text-dim)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              {mobileOpen ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                [0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 16,
                      height: 1.5,
                      background: "currentColor",
                      borderRadius: 1,
                      display: "block",
                    }}
                  />
                ))
              )}
            </button>
          </div>
        </div>

        {/* ── Mega menu ── */}
        {megaOpen && (
          <div
            style={{
              background: "var(--surface)",
              borderTop: "var(--border-w) solid var(--border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div
              className="container"
              style={{
                padding: "28px 24px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 32,
              }}
            >
              {/* Branches */}
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: "var(--text-4)",
                    marginBottom: 14,
                  }}
                >
                  Branches
                </p>
                <div style={{ display: "grid", gap: 4 }}>
                  {Object.values(branchMeta).map((b) => (
                    <Link
                      key={b.key}
                      to={`/branches/${b.key}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 11px",
                        borderRadius: 8,
                        textDecoration: "none",
                        transition: "background .15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--surface2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: b.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {b.abbr}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--text)",
                          }}
                        >
                          {b.short}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                          B.E. Engineering
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* By Year */}
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: "var(--text-4)",
                    marginBottom: 14,
                  }}
                >
                  By Year
                </p>
                <div style={{ display: "grid", gap: 4 }}>
                  {[
                    {
                      path: "/first-year",
                      label: "First Year (FE)",
                      sub: "Common for all branches",
                    },
                    {
                      path: "/branches?year=SE",
                      label: "Second Year (SE)",
                      sub: "Semester 3 and 4",
                    },
                    {
                      path: "/branches?year=TE",
                      label: "Third Year (TE)",
                      sub: "Semester 5 and 6",
                    },
                    {
                      path: "/branches?year=BE",
                      label: "Final Year (BE)",
                      sub: "Semester 7 and 8",
                    },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 11px",
                        borderRadius: 8,
                        textDecoration: "none",
                        transition: "background .15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--surface2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: "var(--surface3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <BookIcon />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--text)",
                          }}
                        >
                          {item.label}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                          {item.sub}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Syllabus PDF card */}
                <Link
                  to="/syllabus"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 16,
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: "rgba(99,102,241,.08)",
                    border: "1px solid rgba(99,102,241,.25)",
                    textDecoration: "none",
                    transition: "all .18s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(99,102,241,.16)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(99,102,241,.08)")
                  }
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--heading)",
                      }}
                    >
                      Syllabus PDFs
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                      All branches · 2019 &amp; 2024 pattern
                    </div>
                  </div>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </Link>
              </div>

              {/* Quick Links */}
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: "var(--text-4)",
                    marginBottom: 14,
                  }}
                >
                  Quick Links
                </p>
                <div style={{ display: "grid", gap: 4 }}>
                  {[
                    {
                      path: "/tools",
                      label: "SPPU Tools",
                      sub: "SGPA, CGPA, attendance calculators",
                      icon: (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                        </svg>
                      ),
                    },
                    {
                      path: "/news",
                      label: "News and Updates",
                      sub: "Latest SPPU announcements",
                      icon: (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
                          <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
                        </svg>
                      ),
                    },
                    {
                      path: "/saved",
                      label: "Saved Subjects",
                      sub: `${saved.length} subject${saved.length !== 1 ? "s" : ""} bookmarked`,
                      icon: (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                        </svg>
                      ),
                    },
                    {
                      path: "/about",
                      label: "About and Contribute",
                      sub: "Share your notes with us",
                      icon: (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 00-3-3.87" />
                          <path d="M16 3.13a4 4 0 010 7.75" />
                        </svg>
                      ),
                    },
                    {
                      path: "/history",
                      label: "AI Answer History",
                      sub: "Your recent AI-explained questions",
                      icon: (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="12 8 12 12 14 14" />
                          <path d="M3.05 11a9 9 0 1 0 .5-4.5" />
                          <polyline points="3 3 3 9 9 9" />
                        </svg>
                      ),
                    },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 11px",
                        borderRadius: 8,
                        textDecoration: "none",
                        transition: "background .15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--surface2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: "var(--surface3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--text-3)",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--text)",
                          }}
                        >
                          {item.label}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                          {item.sub}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <a
                  href="https://results.unipune.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 16,
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: "var(--gold-pale)",
                    border: "1px solid var(--gold-dim)",
                    textDecoration: "none",
                    transition: "all .18s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--gold)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--gold-pale)")
                  }
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--heading)",
                      }}
                    >
                      Check SPPU Result
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                      results.unipune.ac.in
                    </div>
                  </div>
                  <ExternalLink />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile sidebar backdrop ── */}
      {mobileOpen && (
        <div
          className="show-sm"
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 250,
            background: "rgba(0,0,0,0.45)",
          }}
        />
      )}

      {/* ── Mobile sidebar panel ── */}
      <div
        className="show-sm"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 300,
          maxWidth: "85vw",
          zIndex: 260,
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform .25s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Panel header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            style={{
              fontFamily: "'Black Ops One', serif",
              fontSize: 18,
              color: "var(--nav-text)",
              textDecoration: "none",
            }}
          >
            SPPU<span style={{ color: "var(--gold)" }}>StudyHUB</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            style={{
              width: 32,
              height: 32,
              border: "none",
              background: "transparent",
              color: "var(--text-4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              fontSize: 22,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Profile / sign-in */}
        {user ? (
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                  overflow: "hidden",
                  border: "2px solid var(--border)",
                }}
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  (
                    user.user_metadata?.full_name?.[0] ??
                    user.email?.[0] ??
                    "U"
                  ).toUpperCase()
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--heading)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.user_metadata?.full_name ?? user.email?.split("@")[0]}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-3)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.email}
                </div>
              </div>
            </div>
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 14px",
                borderRadius: 8,
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--heading)",
                transition: "background .15s",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              My Dashboard
            </Link>
          </div>
        ) : (
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => {
                signInWithGoogle();
                setMobileOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid var(--nav-icon-border)",
                background: "var(--surface2)",
                color: "var(--text)",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
              }}
            >
              <GoogleIcon /> Sign in with Google
            </button>
          </div>
        )}

        {/* Nav links */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--text-4)",
              textTransform: "uppercase",
              letterSpacing: 1,
              padding: "6px 8px",
              marginBottom: 4,
            }}
          >
            Browse
          </p>
          {[
            ["/", "Home"],
            ["/first-year", "First Year (FE)"],
            ["/branches", "Browse Branches"],
          ].map(([path, label]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "9px 12px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "var(--text)",
                textDecoration: "none",
                background:
                  pathname === path ? "var(--surface2)" : "transparent",
                marginBottom: 2,
                transition: "background .12s",
              }}
            >
              {label}
            </Link>
          ))}

          {/* Syllabus card */}
          <Link
            to="/syllabus"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 12px",
              marginTop: 6,
              borderRadius: 10,
              background: "rgba(99,102,241,.08)",
              border: "1px solid rgba(99,102,241,.2)",
              textDecoration: "none",
              transition: "background .15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(99,102,241,.16)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(99,102,241,.08)")
            }
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "rgba(99,102,241,.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--heading)",
                }}
              >
                Syllabus PDFs
              </div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                All branches · 2019 &amp; 2024 pattern
              </div>
            </div>
          </Link>

          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--text-4)",
              textTransform: "uppercase",
              letterSpacing: 1,
              padding: "12px 8px 4px",
              marginBottom: 4,
            }}
          >
            Tools & Pages
          </p>
          {[
            ["/tools", "SPPU Tools"],
            ["/news", "News & Updates"],
            ["/history", "AI Answer History"],
            ["/contributions", "Contributors"],
            ["/about", "About & Contribute"],
            ["/saved", `Saved${saved.length > 0 ? ` (${saved.length})` : ""}`],
          ].map(([path, label]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "9px 12px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "var(--text)",
                textDecoration: "none",
                background:
                  pathname === path ? "var(--surface2)" : "transparent",
                marginBottom: 2,
                transition: "background .12s",
              }}
            >
              {label}
            </Link>
          ))}

          <a
            href="https://results.unipune.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 12px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: "var(--gold-dim)",
              textDecoration: "none",
              marginTop: 4,
            }}
          >
            Check SPPU Result <ExternalLink />
          </a>

          {/* Pattern switcher */}
          <div style={{ marginTop: 16, padding: "0 4px" }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-4)",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              Pattern
            </p>
            <div className="pattern-pill">
              {["2019", "2024"].map((p) => (
                <button
                  key={p}
                  className={`pattern-opt ${pattern === p ? "active" : ""}`}
                  onClick={() => switchPattern(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border)",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <button
            onClick={toggleTheme}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 12px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "var(--text-3)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              width: "100%",
              textAlign: "left",
            }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            {isDark ? "Switch to light mode" : "Switch to dark mode"}
          </button>
          {user && (
            <button
              onClick={() => {
                signOut();
                setMobileOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 12px",
                borderRadius: 8,
                border: "none",
                background: "transparent",
                color: "#f87171",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                width: "100%",
                textAlign: "left",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .hide-sm { display: none !important; } }
        @media (min-width: 769px) { .show-sm { display: none !important; } }
      `}</style>
    </>
  );
}
