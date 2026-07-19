import { Router } from 'express';
import { query } from '../db/index.js';
import { requireUser } from '../middleware/auth.js';

const router = Router();

// GET /api/academic — all of this user's SGPA entries
router.get('/', requireUser, async (req, res) => {
  try {
    const result = await query(
      `SELECT semester, sgpa, updated_at
       FROM academic_records
       WHERE user_id = $1
       ORDER BY semester ASC`,
      [req.userId]
    );
    return res.json({ records: result.rows });
  } catch (err) {
    console.error('Academic fetch error:', err.message);
    return res.status(500).json({ error: 'Could not fetch academic records.' });
  }
});

// POST /api/academic — upsert one semester's SGPA
router.post('/', requireUser, async (req, res) => {
  const { semester, sgpa } = req.body;
  const semNum = parseInt(semester, 10);
  const sgpaNum = parseFloat(sgpa);

  if (!Number.isInteger(semNum) || semNum < 1 || semNum > 8) {
    return res.status(400).json({ error: 'semester must be an integer between 1 and 8.' });
  }
  if (!Number.isFinite(sgpaNum) || sgpaNum < 0 || sgpaNum > 10) {
    return res.status(400).json({ error: 'sgpa must be a number between 0 and 10.' });
  }

  try {
    const result = await query(
      `INSERT INTO academic_records (user_id, semester, sgpa, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, semester) DO UPDATE
         SET sgpa = EXCLUDED.sgpa, updated_at = NOW()
       RETURNING semester, sgpa, updated_at`,
      [req.userId, semNum, sgpaNum]
    );
    return res.json({ record: result.rows[0] });
  } catch (err) {
    console.error('Academic upsert error:', err.message);
    return res.status(500).json({ error: 'Could not save SGPA.' });
  }
});

export default router;
