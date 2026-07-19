import { Router } from 'express';
import { query } from '../db/index.js';
import { requireUser } from '../middleware/auth.js';

const router = Router();

// GET /api/progress/activity — distinct dates this user completed anything,
// used to compute the dashboard's study streak client-side.
// Must come before /:subjectCode so it isn't swallowed by the param route.
router.get('/activity', requireUser, async (req, res) => {
  try {
    const result = await query(
      `SELECT DISTINCT date_trunc('day', activity_at) AS day
       FROM (
         SELECT completed_at AS activity_at FROM unit_progress WHERE user_id = $1
         UNION ALL
         SELECT completed_at AS activity_at FROM question_progress WHERE user_id = $1
         UNION ALL
         SELECT updated_at AS activity_at FROM academic_records WHERE user_id = $1
       ) all_activity
       ORDER BY day DESC`,
      [req.userId]
    );
    return res.json({ dates: result.rows.map((r) => r.day.toISOString().slice(0, 10)) });
  } catch (err) {
    console.error('Activity fetch error:', err.message);
    return res.status(500).json({ error: 'Could not fetch activity.' });
  }
});

// GET /api/progress/:subjectCode — this user's completed units + question ids for one subject
router.get('/:subjectCode', requireUser, async (req, res) => {
  const { subjectCode } = req.params;
  try {
    const unitsResult = await query(
      `SELECT unit FROM unit_progress WHERE user_id = $1 AND subject_code = $2`,
      [req.userId, subjectCode]
    );
    const questionsResult = await query(
      `SELECT qp.question_id
       FROM question_progress qp
       JOIN questions q ON q.id = qp.question_id
       JOIN subjects s ON s.id = q.subject_id
       WHERE qp.user_id = $1 AND s.code = $2`,
      [req.userId, subjectCode]
    );
    return res.json({
      units: unitsResult.rows.map((r) => r.unit),
      questionIds: questionsResult.rows.map((r) => r.question_id),
    });
  } catch (err) {
    console.error('Progress fetch error:', err.message);
    return res.status(500).json({ error: 'Could not fetch progress.' });
  }
});

// POST /api/progress/unit — toggle one unit's completion for this user
router.post('/unit', requireUser, async (req, res) => {
  const { subjectCode, unit, completed } = req.body;
  const unitNum = parseInt(unit, 10);

  if (!subjectCode?.trim() || !Number.isInteger(unitNum)) {
    return res.status(400).json({ error: 'subjectCode and unit are required.' });
  }

  try {
    if (completed) {
      await query(
        `INSERT INTO unit_progress (user_id, subject_code, unit)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, subject_code, unit) DO NOTHING`,
        [req.userId, subjectCode.trim(), unitNum]
      );
    } else {
      await query(
        `DELETE FROM unit_progress WHERE user_id = $1 AND subject_code = $2 AND unit = $3`,
        [req.userId, subjectCode.trim(), unitNum]
      );
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error('Unit progress update error:', err.message);
    return res.status(500).json({ error: 'Could not update progress.' });
  }
});

// POST /api/progress/question — toggle one PYQ question's completion for this user
router.post('/question', requireUser, async (req, res) => {
  const { questionId, completed } = req.body;
  const qId = parseInt(questionId, 10);

  if (!Number.isInteger(qId)) {
    return res.status(400).json({ error: 'questionId is required.' });
  }

  try {
    if (completed) {
      await query(
        `INSERT INTO question_progress (user_id, question_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, question_id) DO NOTHING`,
        [req.userId, qId]
      );
    } else {
      await query(
        `DELETE FROM question_progress WHERE user_id = $1 AND question_id = $2`,
        [req.userId, qId]
      );
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error('Question progress update error:', err.message);
    return res.status(500).json({ error: 'Could not update progress.' });
  }
});

export default router;
