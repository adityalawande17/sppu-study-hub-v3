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
