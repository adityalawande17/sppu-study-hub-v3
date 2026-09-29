import rateLimit from 'express-rate-limit';
import { query } from '../db/index.js';
import { getVerifiedUserId } from './auth.js';

const AI_LIMIT = 3;
const AI_ENDPOINTS = ['/api/ai/explain', '/api/ai/explain/stream'];

// Returns true if the request is within the daily AI limit, false if exceeded.
// Fails open so a DB hiccup doesn't block all users.
export async function checkAiRateLimit(req) {
  try {
    const userId = await getVerifiedUserId(req);
    let count;

    if (userId) {
      const result = await query(
        `SELECT COUNT(*) FROM api_usage
         WHERE user_id = $1
           AND endpoint = ANY($2)
           AND called_at > NOW() - INTERVAL '24 hours'`,
        [userId, AI_ENDPOINTS]
      );
      count = parseInt(result.rows[0].count, 10);
    } else {
      const result = await query(
        `SELECT COUNT(*) FROM api_usage
         WHERE ip_address = $1
           AND user_id IS NULL
           AND endpoint = ANY($2)
           AND called_at > NOW() - INTERVAL '24 hours'`,
        [req.ip, AI_ENDPOINTS]
      );
      count = parseInt(result.rows[0].count, 10);
    }

    return count < AI_LIMIT;
  } catch (err) {
    console.error('AI rate limit check error:', err.message);
    return true; // fail open
  }
}

// Express middleware wrapper around checkAiRateLimit (kept for any future route-level use).
export async function aiRateLimiter(req, res, next) {
  const allowed = await checkAiRateLimit(req);
  if (!allowed) {
    return res.status(429).json({ error: 'AI request limit reached. Try again after 24 hours.' });
  }
  next();
}

// General API throttle — all other routes. Keyed by user ID when logged in
// (like aiRateLimiter) so students sharing an IP on campus/hostel WiFi don't
// share a request budget; falls back to IP only for anonymous requests.
// keyGenerator is async because getVerifiedUserId does a real signature
// check — express-rate-limit v7 awaits it. A forged/unsigned bearer token
// can no longer mint a fresh bucket, unlike a raw unverified decode would.
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  keyGenerator: async (req) => {
    const userId = await getVerifiedUserId(req);
    return userId ? `user:${userId}` : `ip:${req.ip}`;
  },
  message: { error: 'Too many requests. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
