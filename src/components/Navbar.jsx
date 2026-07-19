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
        color: active ? "#fff" : "rgba(255,255,255,.78)",
        textDecoration: "none",
        background: active ? "rgba(255,255,255,.12)" : "transparent",
        transition: "all .18s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.background = "rgba(255,255,255,.09)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = active ? "#fff" : "rgba(255,255,255,.78)";
        e.currentTarget.style.background = active
          ? "rgba(255,255,255,.12)"
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

  const dropdownLinkStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text)",
    textDecoration: "none",
    borderBottom: "1px solid var(--border)",
    transition: "background .12s",
  };

  return (
    <>
      <header
        style={{
          background: "var(--navy)",
          position: "sticky",
          top: 0,
          zIndex: 200,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
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
              color: "#fff",
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
              background: "rgba(255,255,255,.12)",
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
                  background: megaOpen
                    ? "rgba(255,255,255,.12)"
                    : "transparent",
                  color: megaOpen ? "#fff" : "rgba(255,255,255,.78)",
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  transition: "all .18s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.background = "rgba(255,255,255,.09)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = megaOpen
                    ? "#fff"
                    : "rgba(255,255,255,.78)";
                  e.currentTarget.style.background = megaOpen
                    ? "rgba(255,255,255,.12)"
                    : "transparent";
                }}
              >
                Browse <ChevronDown />
              </button>
            </div>

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
            {user && (
              <NavLink to="/dashboard" pathname={pathname}>
                Dashboard
              </NavLink>
            )}
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
              style={{
                width: 34,
                height: 34,
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,.15)",
                background: "rgba(255,255,255,.07)",
                color: "rgba(255,255,255,.8)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .18s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.14)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.07)")
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
                  border: "1px solid rgba(255,255,255,.15)",
                  background: "rgba(255,255,255,.07)",
                  color: "rgba(255,255,255,.85)",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all .18s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,.14)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,.07)")
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
                    border: "1px solid rgba(255,255,255,.15)",
                    background: userMenuOpen
                      ? "rgba(255,255,255,.14)"
                      : "rgba(255,255,255,.07)",
                    cursor: "pointer",
                    transition: "all .18s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,.14)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = userMenuOpen
                      ? "rgba(255,255,255,.14)"
                      : "rgba(255,255,255,.07)")
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
                      color: "rgba(255,255,255,.85)",
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
                      border: "1px solid var(--border)",
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
                        borderBottom: "1px solid var(--border)",
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
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,.15)",
                background: "rgba(255,255,255,.07)",
                color: "rgba(255,255,255,.8)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              {[0, 1, 2].map((i) => (
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
              ))}
            </button>
          </div>
        </div>

        {/* ── Mega menu ── */}
        {megaOpen && (
          <div
            style={{
              background: "var(--surface)",
              borderTop: "1px solid var(--border)",
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

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div
            style={{
              background: "var(--surface)",
              borderTop: "1px solid var(--border)",
              padding: "16px 20px 24px",
            }}
          >
            {/* Pattern */}
            <div style={{ marginBottom: 16 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
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

            {/* Nav links */}
            <div style={{ display: "grid", gap: 2, marginBottom: 4 }}>
              {[
                ["/", "Home"],
                ["/first-year", "First Year"],
                ["/branches", "Browse Branches"],
                ["/tools", "Tools"],
                ["/news", "News"],
                ["/history", "AI History"],
                ["/about", "About"],
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
                    transition: "background .15s",
                    background:
                      pathname === path ? "var(--surface2)" : "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      pathname === path ? "var(--surface2)" : "transparent")
                  }
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
                }}
              >
                Check Result <ExternalLink />
              </a>
            </div>

            {/* Mobile auth */}
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid var(--border)",
              }}
            >
              {!user ? (
                <button
                  onClick={() => signInWithGoogle()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
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
              ) : (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
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
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        {user.user_metadata?.full_name ??
                          user.email?.split("@")[0]}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {[
                    ["/dashboard", "My Dashboard"],
                    [
                      "/saved",
                      `Saved Subjects${saved.length > 0 ? ` (${saved.length})` : ""}`,
                    ],
                    ["/history", "AI History"],
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
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--surface2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {label}
                    </Link>
                  ))}

                  <button
                    onClick={() => {
                      signOut();
                      setMobileOpen(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: "transparent",
                      textAlign: "left",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#f87171",
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(248,113,113,.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 768px) { .hide-sm { display: none !important; } }
        @media (min-width: 769px) { .show-sm { display: none !important; } }
      `}</style>
    </>
  );
}
