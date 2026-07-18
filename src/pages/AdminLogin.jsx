import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminToken } from "../utils/adminAuth";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Login failed.");
      setAdminToken(data.token);
      navigate("/admin/questions", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ width: "100%", maxWidth: 360, padding: "32px 28px" }}
      >
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 22,
            color: "var(--heading)",
            marginBottom: 4,
          }}
        >
          Admin Login
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 22 }}>
          Sign in to manage PYQ questions.
        </p>

        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-3)",
            marginBottom: 6,
          }}
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--surface2)",
            color: "var(--text)",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            outline: "none",
            marginBottom: 14,
            boxSizing: "border-box",
          }}
        />

        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-3)",
            marginBottom: 6,
          }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--surface2)",
            color: "var(--text)",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            outline: "none",
            marginBottom: 18,
            boxSizing: "border-box",
          }}
        />

        {error && (
          <div
            style={{
              color: "#f87171",
              fontSize: 13,
              marginBottom: 14,
              padding: "8px 12px",
              background: "rgba(248,113,113,.08)",
              borderRadius: 8,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: "11px 0" }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
