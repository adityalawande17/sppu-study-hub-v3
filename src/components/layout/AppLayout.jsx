import { createContext, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "./Sidebar";
import RightRail from "./RightRail";
import Icon from "./icons";

const MOBILE_QUERY = "(max-width: 767px)";

// Lets the homepage navbar open the phone drawer without owning its state
const ShellDrawerContext = createContext(null);
export function useShellDrawer() {
  return useContext(ShellDrawerContext);
}

export default function AppLayout({ children }) {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches
  );
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Homepage stands alone on desktop; on phones it gets the same drawer sidebar as the other pages
  if (isHome && !isMobile) {
    return children;
  }

  if (isAdmin) {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }

  // On phones the homepage navbar carries the menu button, so no second bar is shown
  return (
    <ShellDrawerContext.Provider value={{ openDrawer: () => setDrawerOpen(true) }}>
      <div className="shell">
        <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        <div className="shell-center">
          {!isHome && (
            <div className="shell-mobilebar">
              <Link to="/" className="shell-mobile-brand">
                SPPU<span>StudyHUB</span>
              </Link>
              <button
                className="shell-menu-btn"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
              >
                <Icon name="menu" size={20} />
              </button>
            </div>
          )}
          {children}
        </div>

        {!isHome && <RightRail />}
      </div>
    </ShellDrawerContext.Provider>
  );
}
