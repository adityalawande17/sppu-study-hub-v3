import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NoticeStrip from "./components/NoticeStrip";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import FirstYear from "./pages/FirstYear";
import Branches from "./pages/Branches";
import BranchDetail from "./pages/BranchDetail";
import Subject from "./pages/Subject";
import Tools from "./pages/Tools";
import News from "./pages/News";
import Saved from "./pages/Saved";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import "./styles/global.css";
import ScrollToTop from "./components/ScrollToTop";

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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <BottomNav />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
