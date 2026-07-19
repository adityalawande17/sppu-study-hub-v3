import { Router } from 'express';
import { query } from '../db/index.js';
import { requireUser } from '../middleware/auth.js';

const router = Router();

const VALID_BRANCHES = ['cs', 'it', 'aids', 'me', 'ce', 'ee', 'etc'];
const VALID_PATTERNS = ['2019', '2024'];

// GET /api/profile — returns null if the signed-in user hasn't onboarded yet
router.get('/', requireUser, async (req, res) => {
  try {
    const result = await query(
      `SELECT branch, pattern, current_semester, updated_at, created_at
       FROM user_profiles
       WHERE user_id = $1`,
      [req.userId]
    );
    return res.json({ profile: result.rows[0] ?? null });
  } catch (err) {
    console.error('Profile fetch error:', err.message);
    return res.status(500).json({ error: 'Could not fetch profile.' });
  }
});

// POST /api/profile — upsert. Handles both first-time onboarding and every
// later "change my semester" edit from the dashboard — there's no separate
// one-time-only path.
router.post('/', requireUser, async (req, res) => {
  const { branch, pattern, currentSemester } = req.body;
  const semester = parseInt(currentSemester, 10);

  if (!VALID_BRANCHES.includes(branch)) {
    return res.status(400).json({ error: 'Invalid branch.' });
  }
  if (!VALID_PATTERNS.includes(pattern)) {
    return res.status(400).json({ error: 'Invalid pattern.' });
  }
  if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
    return res.status(400).json({ error: 'currentSemester must be an integer between 1 and 8.' });
  }

  try {
    const result = await query(
      `INSERT INTO user_profiles (user_id, branch, pattern, current_semester, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id) DO UPDATE
         SET branch = EXCLUDED.branch,
             pattern = EXCLUDED.pattern,
             current_semester = EXCLUDED.current_semester,
             updated_at = NOW()
       RETURNING branch, pattern, current_semester, updated_at, created_at`,
      [req.userId, branch, pattern, semester]
    );
    return res.json({ profile: result.rows[0] });
  } catch (err) {
    console.error('Profile upsert error:', err.message);
    return res.status(500).json({ error: 'Could not save profile.' });
  }
});

export default router;
