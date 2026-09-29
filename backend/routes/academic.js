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

// POST /api/academic/bulk — upsert several semesters' SGPA in one round trip.
// A single INSERT...SELECT FROM unnest() is one statement, so it's atomic —
// unlike looping POST /api/academic per semester, a bad value can't leave
// some semesters saved and others silently missing.
router.post('/bulk', requireUser, async (req, res) => {
  const { records } = req.body;
  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ error: 'records must be a non-empty array.' });
  }

  const semesters = [];
  const sgpas = [];
  for (const r of records) {
    const semNum = parseInt(r.semester, 10);
    const sgpaNum = parseFloat(r.sgpa);
    if (!Number.isInteger(semNum) || semNum < 1 || semNum > 8) {
      return res.status(400).json({ error: 'Each semester must be an integer between 1 and 8.' });
    }
    if (!Number.isFinite(sgpaNum) || sgpaNum < 0 || sgpaNum > 10) {
      return res.status(400).json({ error: 'Each sgpa must be a number between 0 and 10.' });
    }
    semesters.push(semNum);
    sgpas.push(sgpaNum);
  }

  try {
    const result = await query(
      `INSERT INTO academic_records (user_id, semester, sgpa, updated_at)
       SELECT $1, s, g, NOW()
       FROM unnest($2::int[], $3::numeric[]) AS t(s, g)
       ON CONFLICT (user_id, semester) DO UPDATE
         SET sgpa = EXCLUDED.sgpa, updated_at = NOW()
       RETURNING semester, sgpa, updated_at`,
      [req.userId, semesters, sgpas]
    );
    return res.json({ records: result.rows });
  } catch (err) {
    console.error('Academic bulk upsert error:', err.message);
    return res.status(500).json({ error: 'Could not save SGPAs.' });
  }
});

export default router;
