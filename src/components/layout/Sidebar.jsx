import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { branchMeta } from "../../data/branches";
import Icon from "./icons";

const STUDY = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/branches", label: "Browse branches", icon: "grid", branches: true },
  { to: "/first-year", label: "First year (FE)", icon: "layers" },
  { to: "/syllabus", label: "Syllabus PDFs", icon: "file" },
  { to: "/community-notes", label: "Community Notes", icon: "users" },
];

const EXPLORE = [
  { to: "/tools", label: "Tools", icon: "tool" },
  { to: "/news", label: "News", icon: "bell" },
  { to: "/blog", label: "Blog", icon: "edit" },
  { to: "/contributions", label: "Contributors", icon: "heart" },
];

const MY_SPACE = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/saved", label: "Saved", icon: "bookmark" },
  { to: "/history", label: "AI history", icon: "clock" },
];

function isActive(to, pathname) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function NavItem({ to, label, icon, pathname, onNavigate }) {
  const active = isActive(to, pathname);
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={`shell-link${active ? " is-active" : ""}`}
      aria-current={active ? "page" : undefined}
    >
      {icon && <Icon name={icon} />}
      <span>{label}</span>
    </Link>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="shell-section-title">{title}</div>
      <div className="shell-list">{children}</div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation();
  const { user, pattern, switchPattern, signInWithGoogle, signOut } =
    useApp();

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "";
  const initial = displayName.charAt(0).toUpperCase() || "?";
  const [branchesOpen, setBranchesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    function onPointerDown(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [userMenuOpen]);

  return (
    <>
      <div
        className={`shell-backdrop${open ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`shell-sidebar${open ? " is-open" : ""}`}
        aria-label="Site navigation"
      >
        <div className="shell-brand">
          <Link to="/" onClick={onClose}>
            SPPU<span>StudyHUB</span>
          </Link>
          <button className="shell-close" onClick={onClose} aria-label="Close menu">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div>
          <div className="shell-section-title">Pattern</div>
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

        <nav className="shell-nav">
          <Section title="Study">
            {STUDY.map((item) => (
              <div key={item.to}>
                {item.branches ? (
                  <button
                    className={`shell-link${pathname.startsWith("/branches") ? " is-active" : ""}`}
                    onClick={() => setBranchesOpen((o) => !o)}
                    aria-expanded={branchesOpen}
                  >
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                    <span className={`shell-caret${branchesOpen ? " is-open" : ""}`} />
                  </button>
                ) : (
                  <NavItem {...item} pathname={pathname} onNavigate={onClose} />
                )}
                {item.branches && branchesOpen && (
                  <div className="shell-sublist">
                    {Object.values(branchMeta).map((b) => (
                      <NavItem
                        key={b.key}
                        to={`/branches/${b.key}`}
                        label={b.short}
                        pathname={pathname}
                        onNavigate={onClose}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Section>

          <Section title="Explore">
            {EXPLORE.map((item) => (
              <NavItem key={item.to} {...item} pathname={pathname} onNavigate={onClose} />
            ))}
          </Section>

          {user && (
            <Section title="My space">
              {MY_SPACE.map((item) => (
                <NavItem key={item.to} {...item} pathname={pathname} onNavigate={onClose} />
              ))}
            </Section>
          )}
        </nav>

        <div className="shell-footer">

          {user ? (
            <div className="shell-user-wrap" ref={userMenuRef}>
              {userMenuOpen && (
                <div className="shell-user-menu" role="menu">
                  <Link to="/dashboard" className="shell-link" role="menuitem" onClick={onClose}>
                    <Icon name="dashboard" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/saved" className="shell-link" role="menuitem" onClick={onClose}>
                    <Icon name="bookmark" />
                    <span>Saved</span>
                  </Link>
                  <button
                    className="shell-link"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                    }}
                  >
                    <Icon name="logout" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
              <button
                className="shell-user"
                onClick={() => setUserMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <span className="shell-avatar">{initial}</span>
                <span>{displayName}</span>
                <span className={`shell-user-caret${userMenuOpen ? " is-open" : ""}`} />
              </button>
            </div>
          ) : (
            <button
              className="shell-signin"
              onClick={() => signInWithGoogle(window.location.pathname)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
