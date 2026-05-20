import { supabase } from '../lib/supabase';

const KEY = 'sppu_ai_history';
export const MAX = 10;

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export async function fetchHistory(user) {
  if (user) {
    try {
      const { data } = await supabase
        .from('user_ai_history')
        .select('*')
        .eq('user_id', user.id)
        .order('asked_at', { ascending: false })
        .limit(MAX);
      if (data) {
        return data.map((r) => ({
          supabaseId: r.id,
          clientId: r.client_id,
          question: r.question,
          answer: r.answer,
          cached: r.cached,
          subjectCode: r.subject_code,
          subjectName: r.subject_name,
          paperExam: r.paper_exam,
          paperYear: r.paper_year,
          marks: r.marks,
          unit: r.unit,
          askedAt: new Date(r.asked_at).getTime(),
        }));
      }
    } catch {}
  }
  return getHistory();
}

export async function saveToHistory(entry, user) {
  const askedAt = Date.now();

  // Always write to localStorage immediately
  try {
    const prev = getHistory();
    const updated = [{ ...entry, askedAt }, ...prev].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}

  // Background sync to Supabase for logged-in users
  if (user) {
    try {
      await supabase.from('user_ai_history').insert({
        user_id: user.id,
        client_id: askedAt,
        question: entry.question,
        answer: entry.answer,
        subject_code: entry.subjectCode,
        subject_name: entry.subjectName,
        paper_exam: entry.paperExam,
        paper_year: entry.paperYear,
        marks: entry.marks ?? null,
        unit: entry.unit ?? null,
        cached: entry.cached ?? false,
      });
      // Trim to MAX — delete oldest rows beyond the limit
      const { data } = await supabase
        .from('user_ai_history')
        .select('id')
        .eq('user_id', user.id)
        .order('asked_at', { ascending: false });
      if (data && data.length > MAX) {
        const ids = data.slice(MAX).map((r) => r.id);
        await supabase.from('user_ai_history').delete().in('id', ids);
      }
    } catch {}
  }
}

export async function deleteHistoryEntry(entry, user) {
  try {
    const updated = getHistory().filter((e) => e.askedAt !== entry.askedAt);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}

  if (user && entry.supabaseId) {
    try {
      await supabase.from('user_ai_history')
        .delete()
        .eq('id', entry.supabaseId)
        .eq('user_id', user.id);
    } catch {}
  }
}

export async function clearHistory(user) {
  localStorage.removeItem(KEY);
  if (user) {
    try {
      await supabase.from('user_ai_history').delete().eq('user_id', user.id);
    } catch {}
  }
}
