import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getAuthHeader } from "../utils/supabaseAuth";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [pattern, setPattern] = useState(() => {
    try {
      return localStorage.getItem("sppu_pattern") || "2024";
    } catch {
      return "2024";
    }
  });
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem("sppu_theme");
      if (saved === null) return true; // no preference saved yet → default dark
      return saved === "dark"; // respect saved preference after first visit
    } catch {
      return true;
    }
  });
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sppu_saved") || "[]");
    } catch {
      return [];
    }
  });
  const [user, setUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "");
    try {
      localStorage.setItem("sppu_theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setSessionLoading(false);
    }).catch(() => setSessionLoading(false));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sppu_pattern", pattern);
    } catch {}
  }, [pattern]);

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    (async () => {
      try {
        const authHeader = await getAuthHeader();
        const res = await fetch(`${BACKEND}/api/profile`, { headers: authHeader });
        const data = await res.json();
        setProfile(data.profile ?? null);
      } catch {
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    })();
  }, [user, sessionLoading]);

  function toggleTheme() {
    setIsDark((d) => !d);
  }

  function switchPattern(p) {
    setPattern(p);
  }

  function toggleSaved(subject) {
    setSaved((prev) => {
      const exists = prev.some((s) => s.code === subject.code);
      const next = exists
        ? prev.filter((s) => s.code !== subject.code)
        : [...prev, subject];
      try {
        localStorage.setItem("sppu_saved", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  function isSaved(code) {
    return saved.some((s) => s.code === code);
  }

  async function signInWithGoogle(redirectPath = "/dashboard") {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${redirectPath}` },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AppContext.Provider
      value={{
        pattern,
        switchPattern,
        isDark,
        toggleTheme,
        saved,
        toggleSaved,
        isSaved,
        user,
        sessionLoading,
        signInWithGoogle,
        signOut,
        profile,
        setProfile,
        profileLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
