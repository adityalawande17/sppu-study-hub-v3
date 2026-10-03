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
  const { user, isDark, toggleTheme, pattern, switchPattern, signInWithGoogle, signOut } =
    useApp();

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "";
  const initial = displayName.charAt(0).toUpperCase() || "?";

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

        <nav className="shell-nav">
          <Section title="Study">
            {STUDY.map((item) => (
              <div key={item.to}>
                <NavItem {...item} pathname={pathname} onNavigate={onClose} />
                {item.branches && (
                  <div className="shell-sublist">
                    <div className="pattern-pill shell-pattern">
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
          <button className="shell-link" onClick={toggleTheme}>
            <Icon name={isDark ? "sun" : "moon"} />
            <span>{isDark ? "Light mode" : "Dark mode"}</span>
          </button>

          {user ? (
            <div className="shell-user">
              <span className="shell-avatar">{initial}</span>
              <span>{displayName}</span>
              <button onClick={signOut} aria-label="Sign out">
                <Icon name="logout" />
              </button>
            </div>
          ) : (
            <button
              className="shell-signin"
              onClick={() => signInWithGoogle(window.location.pathname)}
            >
              Sign in with Google
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
