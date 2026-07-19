import jwt from 'jsonwebtoken';

// Verifies the admin session token issued by POST /api/admin/login.
// Distinct from rateLimiter.js's extractUserId, which decodes without
// verifying a signature and is only safe for rate-limit bucketing.
export function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing admin token.' });
  }

  try {
    const payload = jwt.verify(auth.slice(7), process.env.ADMIN_JWT_SECRET, { algorithms: ['HS256'] });
    if (payload.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid admin token.' });
    }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired admin token.' });
  }
}

function verifySupabaseToken(auth) {
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const payload = jwt.verify(auth.slice(7), process.env.SUPABASE_JWT_SECRET, { algorithms: ['HS256'] });
    return payload.sub ? payload : null;
  } catch {
    return null;
  }
}

// Hard-gates a route to a signed-in Supabase user. Every new profile/progress/
// academic route uses req.userId for scoping — never a client-supplied id —
// since the backend talks to Postgres directly via pg and bypasses Supabase RLS.
export function requireUser(req, res, next) {
  const payload = verifySupabaseToken(req.headers.authorization);
  if (!payload) {
    return res.status(401).json({ error: 'Missing or invalid session.' });
  }
  req.userId = payload.sub;
  req.userEmail = payload.email ?? null;
  next();
}

// Soft version for routes that must keep working for anonymous users
// (e.g. the AI explainer). Attaches req.userId when a valid token is present,
// otherwise continues on as anonymous.
export function optionalUser(req, res, next) {
  const payload = verifySupabaseToken(req.headers.authorization);
  req.userId = payload?.sub ?? null;
  req.userEmail = payload?.email ?? null;
  next();
}
