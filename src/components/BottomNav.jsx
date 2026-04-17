import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

const items = [
  {
    path: "/",
    label: "Home",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: "/first-year",
    label: "FE",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
  },
  {
    path: "/branches",
    label: "Branches",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    path: "/tools",
    label: "Tools",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 010 14.14" />
        <path d="M4.93 19.07a10 10 0 010-14.14" />
      </svg>
    ),
  },
  {
    path: "/saved",
    label: "Saved",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { saved } = useApp();
  return (
    <>
      <nav
        className="bottom-nav-mobile"
        style={{
          display: "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 150,
          background: "var(--navy)",
          borderTop: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div style={{ display: "flex" }}>
          {items.map((item) => {
            const active =
              item.path === "/"
                ? pathname === "/"
                : pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 2px 6px",
                  textDecoration: "none",
                  color: active ? "var(--gold)" : "rgba(255,255,255,.45)",
                  fontSize: 9,
                  fontWeight: 600,
                  gap: 3,
                  letterSpacing: 0.3,
                  textTransform: "uppercase",
                  position: "relative",
                  transition: "color .15s",
                }}
              >
                {item.icon}
                {item.label}
                {item.path === "/saved" && saved.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      right: "calc(50% - 14px)",
                      width: 14,
                      height: 14,
                      background: "var(--gold)",
                      borderRadius: "50%",
                      fontSize: 8,
                      fontWeight: 700,
                      color: "#111",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1.5px solid var(--navy)",
                    }}
                  >
                    {saved.length}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
      <style>{`@media(max-width:640px){.bottom-nav-mobile{display:block!important}}`}</style>
    </>
  );
}
