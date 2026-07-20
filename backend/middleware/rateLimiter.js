import rateLimit from 'express-rate-limit';

// Decode JWT payload without verifying signature — safe for rate-limit keying only.
function extractUserId(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const payload = JSON.parse(Buffer.from(auth.split('.')[1], 'base64url').toString());
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

// 3 AI requests per 24 hours — keyed by user ID when logged in, IP when not.
export const aiRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => {
    const userId = extractUserId(req);
    return userId ? `user:${userId}` : `ip:${req.ip}`;
  },
  message: { error: 'AI request limit reached. Try again after 24 hours.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API throttle — all other routes. Keyed by user ID when logged in
// (like aiRateLimiter) so students sharing an IP on campus/hostel WiFi don't
// share a request budget; falls back to IP only for anonymous requests.
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  keyGenerator: (req) => {
    const userId = extractUserId(req);
    return userId ? `user:${userId}` : `ip:${req.ip}`;
  },
  message: { error: 'Too many requests. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
