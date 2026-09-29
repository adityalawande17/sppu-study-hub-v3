import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Cross-origin in production (frontend and backend are on different domains),
// same-site in local dev (both on localhost, different ports only) — SameSite
// 'none' requires Secure, and Secure cookies aren't set over plain http://.
const isProd = process.env.NODE_ENV === 'production';
const COOKIE_OPTS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
};

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const validEmail = email === process.env.ADMIN_EMAIL;
  const validPassword = password === process.env.ADMIN_PASSWORD;

  if (!validEmail || !validPassword) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.ADMIN_JWT_SECRET, { expiresIn: '7d' });
  // httpOnly: the token never touches frontend JS (localStorage, response
  // body, etc.), so an XSS bug elsewhere in the app can't steal it.
  res.cookie('admin_token', token, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 });
  return res.json({ ok: true });
});

// POST /api/admin/logout — clears the cookie. JS can't delete an httpOnly
// cookie itself, so this has to be a real request, not a client-side action.
router.post('/logout', (_req, res) => {
  res.clearCookie('admin_token', COOKIE_OPTS);
  return res.json({ ok: true });
});

// GET /api/admin/me — used by the frontend to check whether the admin_token
// cookie is still present and valid.
router.get('/me', requireAdmin, (_req, res) => {
  res.json({ ok: true });
});

export default router;
