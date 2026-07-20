import { Router } from 'express';
import { query } from '../db/index.js';
import { requireUser } from '../middleware/auth.js';

const router = Router();

// GET /api/progress/activity — how many things this user completed on each
// day they were active. Powers both the study streak and the activity heatmap.
// Must come before /:subjectCode so it isn't swallowed by the param route.
router.get('/activity', requireUser, async (req, res) => {
  try {
    const result = await query(
      `SELECT date_trunc('day', activity_at) AS day, COUNT(*) AS count
       FROM (
         SELECT completed_at AS activity_at FROM unit_progress WHERE user_id = $1
         UNION ALL
         SELECT completed_at AS activity_at FROM question_progress WHERE user_id = $1
         UNION ALL
         SELECT updated_at AS activity_at FROM academic_records WHERE user_id = $1
       ) all_activity
       GROUP BY day
       ORDER BY day ASC`,
      [req.userId]
    );
    return res.json({
      activity: result.rows.map((r) => ({
        date: r.day.toISOString().slice(0, 10),
        count: parseInt(r.count, 10),
      })),
    });
  } catch (err) {
    console.error('Activity fetch error:', err.message);
    return res.status(500).json({ error: 'Could not fetch activity.' });
  }
});

// GET /api/progress/summary?codes=CODE1,CODE2 — units done, questions done,
// and questions total for several subjects in one round trip (3 queries
// total instead of 2 per subject). Must come before /:subjectCode.
router.get('/summary', requireUser, async (req, res) => {
  const codes = (req.query.codes || '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);

  if (codes.length === 0) return res.json({ summary: {} });

  try {
    const [unitsRes, questionsDoneRes, questionsTotalRes] = await Promise.all([
      query(
        `SELECT subject_code, COUNT(*) AS count
         FROM unit_progress
         WHERE user_id = $1 AND subject_code = ANY($2::text[])
         GROUP BY subject_code`,
        [req.userId, codes]
      ),
      query(
        `SELECT s.code AS subject_code, COUNT(*) AS count
         FROM question_progress qp
         JOIN questions q ON q.id = qp.question_id
         JOIN subjects s ON s.id = q.subject_id
         WHERE qp.user_id = $1 AND s.code = ANY($2::text[])
         GROUP BY s.code`,
        [req.userId, codes]
      ),
      query(
        `SELECT s.code AS subject_code, COUNT(*) AS count
         FROM questions q
         JOIN subjects s ON s.id = q.subject_id
         WHERE s.code = ANY($1::text[])
         GROUP BY s.code`,
        [codes]
      ),
    ]);

    const summary = {};
    for (const code of codes) {
      summary[code] = { unitsDone: 0, questionsDone: 0, questionsTotal: 0 };
    }
    for (const r of unitsRes.rows) {
      summary[r.subject_code].unitsDone = parseInt(r.count, 10);
    }
    for (const r of questionsDoneRes.rows) {
      summary[r.subject_code].questionsDone = parseInt(r.count, 10);
    }
    for (const r of questionsTotalRes.rows) {
      summary[r.subject_code].questionsTotal = parseInt(r.count, 10);
    }

    return res.json({ summary });
  } catch (err) {
    console.error('Progress summary error:', err.message);
    return res.status(500).json({ error: 'Could not fetch progress summary.' });
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
