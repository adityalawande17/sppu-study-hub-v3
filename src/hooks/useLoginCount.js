import { useEffect, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

// Returns the live number of accounts, or null while loading / if unavailable.
// Callers hide the number entirely when null, so the page never shows a stale or fake figure.
export function useLoginCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!BACKEND) return;
    let cancelled = false;

    fetch(`${BACKEND}/api/stats`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && typeof data?.loginCount === "number") {
          setCount(data.loginCount);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return count;
}
