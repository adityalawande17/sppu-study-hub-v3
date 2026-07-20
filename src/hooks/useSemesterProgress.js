import { useState, useEffect } from "react";
import { getSubjectContent } from "../utils/subjectContent";
import { getAuthHeader } from "../utils/supabaseAuth";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export function useSemesterProgress(subjects) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const subjectCodes = subjects.map((s) => s.code).join(",");

  useEffect(() => {
    let cancelled = false;

    if (subjects.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      const authHeader = await getAuthHeader();
      let summary = {};
      try {
        const res = await fetch(
          `${BACKEND}/api/progress/summary?codes=${encodeURIComponent(subjectCodes)}`,
          { headers: authHeader },
        );
        if (res.ok) summary = (await res.json()).summary ?? {};
      } catch {
        // leave summary empty — cards fall back to zeroed progress below
      }

      const results = subjects.map((subject) => {
        const content = getSubjectContent(subject.code);
        const unitsTotal = content?.units?.length ?? 0;
        const s = summary[subject.code] ?? { unitsDone: 0, questionsDone: 0, questionsTotal: 0 };
        return {
          subject,
          unitsDone: s.unitsDone,
          unitsTotal,
          questionsDone: s.questionsDone,
          questionsTotal: s.questionsTotal,
        };
      });

      if (!cancelled) {
        setItems(results);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectCodes]);

  const totals = items.reduce(
    (acc, i) => ({
      done: acc.done + i.unitsDone + i.questionsDone,
      total: acc.total + i.unitsTotal + i.questionsTotal,
    }),
    { done: 0, total: 0 },
  );
  const overallPct = totals.total > 0 ? Math.round((totals.done / totals.total) * 100) : 0;

  return { items, loading, overallPct };
}
