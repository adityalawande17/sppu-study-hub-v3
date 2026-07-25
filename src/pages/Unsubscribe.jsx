import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function Unsubscribe() {
  useSEO({ title: "Unsubscribe - SPPUStudyHub" });
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("pending"); // pending | done | error

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    fetch(`${BACKEND}/api/announcements/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => setStatus(res.ok ? "done" : "error"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div
      className="container"
      style={{ padding: "80px 24px", textAlign: "center", maxWidth: 480, margin: "0 auto" }}
    >
      <h1
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 26,
          color: "var(--heading)",
          marginBottom: 16,
        }}
      >
        {status === "pending" && "Unsubscribing…"}
        {status === "done" && "You're unsubscribed"}
        {status === "error" && "Something went wrong"}
      </h1>
      <p style={{ color: "var(--text-3)", marginBottom: 24 }}>
        {status === "done" &&
          "You won't receive announcement emails from SPPUStudyHUB anymore. You can re-enable them anytime from your dashboard."}
        {status === "error" &&
          "This unsubscribe link is invalid or has expired. You can also manage this from your dashboard once signed in."}
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
