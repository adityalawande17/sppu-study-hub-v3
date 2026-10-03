import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "./Sidebar";
import RightRail from "./RightRail";
import Icon from "./icons";

export default function AppLayout({ children }) {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  if (isAdmin) {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }

  return (
    <div className="shell">
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="shell-center">
        <div className="shell-mobilebar">
          <button
            className="shell-menu-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" size={20} />
          </button>
          <Link to="/" className="shell-mobile-brand">
            SPPU<span>StudyHUB</span>
          </Link>
        </div>
        {children}
      </div>

      <RightRail />
    </div>
  );
}
