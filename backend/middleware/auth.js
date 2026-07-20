import jwt from 'jsonwebtoken';
import { createRemoteJWKSet, jwtVerify } from 'jose';

// Supabase signs user session tokens with this project's asymmetric key
// (ES256, rotated via JWKS) — not a shared HS256 secret. jose caches the
// public keys and handles rotation automatically.
//
// Built lazily (not at module load) so a missing/misconfigured SUPABASE_URL
// only fails auth-gated requests, instead of throwing on `new URL(undefined)`
// at import time and crashing the whole backend before it can even start —
// which would take down anonymous browsing too, not just logged-in features.
let supabaseJWKS = null;
function getSupabaseJWKS() {
  if (!supabaseJWKS) {
    if (!process.env.SUPABASE_URL) {
      throw new Error('SUPABASE_URL is not set');
    }
    supabaseJWKS = createRemoteJWKSet(
      new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
    );
  }
  return supabaseJWKS;
}

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

async function verifySupabaseToken(auth) {
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const { payload } = await jwtVerify(auth.slice(7), getSupabaseJWKS());
    return payload.sub ? payload : null;
  } catch (err) {
    console.error('Supabase token verification error:', err.message);
    return null;
  }
}

// Hard-gates a route to a signed-in Supabase user. Every new profile/progress/
// academic route uses req.userId for scoping — never a client-supplied id —
// since the backend talks to Postgres directly via pg and bypasses Supabase RLS.
export async function requireUser(req, res, next) {
  const payload = await verifySupabaseToken(req.headers.authorization);
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
export async function optionalUser(req, res, next) {
  const payload = await verifySupabaseToken(req.headers.authorization);
  req.userId = payload?.sub ?? null;
  req.userEmail = payload?.email ?? null;
  next();
}
