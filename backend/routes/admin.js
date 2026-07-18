import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

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
  return res.json({ token });
});

// GET /api/admin/me — used by the frontend to check whether a stored token is still valid
router.get('/me', requireAdmin, (_req, res) => {
  res.json({ ok: true });
});

export default router;
