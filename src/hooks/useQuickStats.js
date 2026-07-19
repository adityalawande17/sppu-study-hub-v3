import { useState, useEffect } from "react";
import { getAuthHeader } from "../utils/supabaseAuth";
import { computeStreak } from "../utils/streak";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export function useQuickStats(enabled) {
  const [streak, setStreak] = useState(0);
  const [activity, setActivity] = useState([]);
  const [aiUsed, setAiUsed] = useState(0);
  const [aiLimit, setAiLimit] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const authHeader = await getAuthHeader();
        const [activityRes, usageRes] = await Promise.all([
          fetch(`${BACKEND}/api/progress/activity`, { headers: authHeader }),
          fetch(`${BACKEND}/api/ai/usage`, { headers: authHeader }),
        ]);
        const activityData = activityRes.ok ? await activityRes.json() : { activity: [] };
        const usageData = usageRes.ok ? await usageRes.json() : { used: 0, limit: 3 };
        if (cancelled) return;
        const activityList = activityData.activity ?? [];
        setActivity(activityList);
        setStreak(computeStreak(activityList.map((a) => a.date)));
        setAiUsed(usageData.used ?? 0);
        setAiLimit(usageData.limit ?? 3);
      } catch {
        // leave defaults on failure
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return {
    streak,
    activity,
    aiUsed,
    aiLimit,
    aiRemaining: Math.max(0, aiLimit - aiUsed),
    loading,
  };
}
