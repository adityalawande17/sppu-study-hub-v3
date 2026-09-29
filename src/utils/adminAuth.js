const BACKEND = import.meta.env.VITE_BACKEND_URL;

// The admin session lives in an httpOnly cookie set by the backend
// (backend/routes/admin.js) — never in localStorage or any header frontend
// JS attaches itself, so an XSS bug elsewhere can't read or steal it.
// Every admin fetch must pass `credentials: "include"` so the browser sends
// that cookie; there's nothing for JS to read or attach manually anymore.

export async function logoutAdmin() {
  try {
    await fetch(`${BACKEND}/api/admin/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {}
}
