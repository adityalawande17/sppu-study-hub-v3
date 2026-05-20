import { Router } from 'express';
import { query } from '../db/index.js';

const router = Router();

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
