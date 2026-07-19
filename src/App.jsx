import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NoticeStrip from "./components/NoticeStrip";
import BottomNav from "./components/BottomNav";
import ScrollToTop from "./components/ScrollToTop";
import GoogleAnalytics from "./components/GoogleAnalytics";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/global.css";
import { Analytics } from "@vercel/analytics/react";

const Home = lazy(() => import("./pages/Home"));
const FirstYear = lazy(() => import("./pages/FirstYear"));
const Branches = lazy(() => import("./pages/Branches"));
const BranchDetail = lazy(() => import("./pages/BranchDetail"));
const Subject = lazy(() => import("./pages/Subject"));
const Tools = lazy(() => import("./pages/Tools"));
const News = lazy(() => import("./pages/News"));
const Saved = lazy(() => import("./pages/Saved"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Contributions = lazy(() => import("./pages/Contributions"));
const History = lazy(() => import("./pages/History"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminQuestions = lazy(() => import("./pages/AdminQuestions"));

// Remounting the boundary on every route change means navigating to a
// different (working) page recovers automatically after a crash, rather
// than staying stuck on the fallback until a full page reload.
function RouteErrorBoundary({ children }) {
  const location = useLocation();
  return <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>;
}

function NotFound() {
  return (
    <div
      style={{
        maxWidth: 1140,
        margin: "0 auto",
        padding: "80px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 96,
          color: "var(--border)",
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        404
      </div>
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 28,
          color: "var(--navy)",
          marginBottom: 10,
        }}
      >
        Page not found
      </h2>
      <p style={{ color: "var(--text-3)", marginBottom: 28 }}>
        The page you are looking for does not exist.
      </p>
      <a href="/" className="btn btn-primary">
        Back to Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Analytics />
        <GoogleAnalytics />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <NoticeStrip />
          <Navbar />
          <main style={{ flex: 1 }}>
            <RouteErrorBoundary>
              <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/first-year" element={<FirstYear />} />
                  <Route path="/branches" element={<Branches />} />
                  <Route path="/branches/:branchKey" element={<BranchDetail />} />
                  <Route path="/subject/:code" element={<Subject />} />
                  <Route path="/tools" element={<Tools />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/saved" element={<Saved />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/contributions" element={<Contributions />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/questions" element={<AdminQuestions />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </RouteErrorBoundary>
          </main>
          <Footer />
          <BottomNav />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
