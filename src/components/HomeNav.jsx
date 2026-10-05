import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useShellDrawer } from "./layout/AppLayout";
import Icon from "./layout/icons";

const PATTERNS = ["2019", "2024"];

const LINKS = [
  { to: "/branches", label: "Browse subjects" },
  { to: "/tools", label: "Tools" },
  { to: "/community-notes", label: "Community Notes" },
  { to: "/news", label: "News" },
  { to: "/blog", label: "Blog" },
];

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function HomeNav() {
  const { user, signInWithGoogle, signOut, pattern, switchPattern } = useApp();
  const { pathname } = useLocation();
  const drawer = useShellDrawer();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "";
  const initial = displayName.charAt(0).toUpperCase() || "?";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="home-nav">
      <Link to="/" className="home-nav-brand">
        SPPU<span>StudyHUB</span>
      </Link>

      <div className="pattern-pill home-nav-pill">
        {PATTERNS.map((p) => (
          <button
            key={p}
            className={`pattern-opt ${pattern === p ? "active" : ""}`}
            onClick={() => switchPattern(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <nav className="home-nav-links" aria-label="Main">
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to}>
            {l.label}
          </Link>
        ))}
      </nav>

      {drawer && (
        <button className="home-nav-menu-btn" onClick={drawer.openDrawer} aria-label="Open menu">
          <Icon name="menu" size={20} />
        </button>
      )}

      {user ? (
        <div className="home-nav-user" ref={menuRef}>
          <button
            className="home-nav-avatar"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Account menu"
          >
            {initial}
          </button>
          {menuOpen && (
            <div className="home-nav-menu" role="menu">
              <div className="home-nav-menu-name">{displayName}</div>
              <Link to="/dashboard" role="menuitem">
                <Icon name="dashboard" />
                <span>Dashboard</span>
              </Link>
              <Link to="/saved" role="menuitem">
                <Icon name="bookmark" />
                <span>Saved</span>
              </Link>
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  signOut();
                }}
              >
                <Icon name="logout" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="home-nav-signin" onClick={() => signInWithGoogle(window.location.pathname)}>
          <GoogleIcon />
          Sign in with Google
        </button>
      )}
    </header>
  );
}
