import { Router } from 'express';
import { query } from '../db/index.js';

const router = Router();

const CACHE_MS = 5 * 60 * 1000;
let cached = { loginCount: null, at: 0 };

// GET /api/stats
// Public: total number of accounts that have signed in (rows in auth.users)
router.get('/', async (_req, res) => {
  if (cached.loginCount !== null && Date.now() - cached.at < CACHE_MS) {
    return res.json({ loginCount: cached.loginCount });
  }

  try {
    const result = await query('SELECT COUNT(*)::int AS count FROM auth.users');
    cached = { loginCount: result.rows[0].count, at: Date.now() };
    return res.json({ loginCount: cached.loginCount });
  } catch (err) {
    console.error('Stats fetch error:', err.message);
    return res.status(500).json({ error: 'Could not load stats.' });
  }
});

export default router;
