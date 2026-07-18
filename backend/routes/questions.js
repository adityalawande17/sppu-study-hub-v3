import { Router } from 'express';
import { query } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/questions
// Admin-only: upserts the subject (same logic as db/seed.js), then inserts the question
router.post('/', requireAdmin, async (req, res) => {
  const {
    subjectCode, subjectName, year, semester, credits, pattern,
    unit, questionText, marks, examYear, examMonth, questionType,
  } = req.body;

  if (!subjectCode?.trim() || !subjectName?.trim() || !year?.trim() || !pattern?.trim() || !questionText?.trim()) {
    return res.status(400).json({ error: 'subjectCode, subjectName, year, pattern, and questionText are required.' });
  }

  try {
    const subjectRes = await query(
      `INSERT INTO subjects (code, name, year, semester, credits, pattern)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [subjectCode.trim(), subjectName.trim(), year.trim(), semester ?? null, credits ?? null, pattern.trim()]
    );
    const subjectId = subjectRes.rows[0].id;

    const result = await query(
      `INSERT INTO questions (subject_id, unit, question_text, marks, exam_year, exam_month, question_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, unit, question_text, marks, exam_year, exam_month, question_type`,
      [subjectId, unit ?? null, questionText.trim(), marks ?? null, examYear ?? null, examMonth ?? null, questionType ?? null]
    );

    return res.status(201).json({ question: result.rows[0] });
  } catch (err) {
    console.error('Question insert error:', err.message);
    return res.status(500).json({ error: 'Could not insert question.' });
  }
});

// DELETE /api/questions/:id
// Admin-only: removes a single question
router.delete('/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid question id.' });
  }

  try {
    const result = await query(`DELETE FROM questions WHERE id = $1 RETURNING id`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found.' });
    }
    return res.json({ deleted: id });
  } catch (err) {
    console.error('Question delete error:', err.message);
    return res.status(500).json({ error: 'Could not delete question.' });
  }
});

// GET /api/questions/contributors
// Must come before /:subjectCode so it isn't swallowed by the param route
router.get('/contributors', async (_req, res) => {
  try {
    const result = await query(
      `SELECT id, name, branch, year, subjects, avatar_url, contributed_at
       FROM contributors
       ORDER BY contributed_at DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Contributors fetch error:', err.message);
    return res.status(500).json({ error: 'Could not fetch contributors.' });
  }
});

// GET /api/questions/:subjectCode
// Returns all questions for a subject, grouped by unit
router.get('/:subjectCode', async (req, res) => {
  const { subjectCode } = req.params;

  try {
    const result = await query(
      `SELECT q.id, q.unit, q.question_text, q.marks, q.exam_year, q.exam_month, q.question_type
       FROM questions q
       JOIN subjects s ON s.id = q.subject_id
       WHERE s.code = $1
       ORDER BY q.unit ASC, q.exam_year DESC`,
      [subjectCode]
    );

    // Group by unit for easier frontend rendering
    const grouped = {};
    for (const row of result.rows) {
      const u = row.unit ?? 0;
      if (!grouped[u]) grouped[u] = [];
      grouped[u].push(row);
    }

    return res.json({ subjectCode, questions: result.rows, byUnit: grouped });
  } catch (err) {
    console.error('Questions fetch error:', err.message);
    return res.status(500).json({ error: 'Could not fetch questions.' });
  }
});

// GET /api/questions/:subjectCode/similar/:questionId
// Returns 3 questions most similar to the given one using pgvector cosine distance
router.get('/:subjectCode/similar/:questionId', async (req, res) => {
  const { questionId } = req.params;
  const id = parseInt(questionId, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid questionId.' });
  }

  try {
    // Fetch the source question's embedding
    const embResult = await query(
      `SELECT question_embedding FROM questions WHERE id = $1`,
      [id]
    );

    if (!embResult.rows.length || !embResult.rows[0].question_embedding) {
      return res.json([]);
    }

    const embedding = embResult.rows[0].question_embedding;

    // Cosine similarity search — exclude the source question itself
    const similar = await query(
      `SELECT q.id, q.question_text, q.marks, q.exam_year, s.name AS subject_name
       FROM questions q
       JOIN subjects s ON s.id = q.subject_id
       WHERE q.id != $1 AND q.question_embedding IS NOT NULL
       ORDER BY q.question_embedding <=> $2
       LIMIT 3`,
      [id, embedding]
    );

    return res.json(similar.rows);
  } catch (err) {
    console.error('Similar questions error:', err.message);
    return res.status(500).json({ error: 'Could not fetch similar questions.' });
  }
});

export default router;
