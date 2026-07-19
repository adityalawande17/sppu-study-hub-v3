import { supabase } from "../lib/supabase";

export async function getAuthHeader() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {};
  } catch {
    return {};
  }
}
