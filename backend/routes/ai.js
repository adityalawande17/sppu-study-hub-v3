import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { query } from '../db/index.js';
import { buildExplainerPrompt } from '../prompts/explainer.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { optionalUser, requireUser } from '../middleware/auth.js';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/ai/explain
router.post('/explain', aiRateLimiter, optionalUser, async (req, res) => {
  const { questionText, subjectCode, marks, unit, examYear, examMonth } = req.body;

  if (!questionText?.trim() || !subjectCode?.trim()) {
    return res.status(400).json({ error: 'questionText and subjectCode are required.' });
  }

  try {
    // 1. Look up subject metadata
    const subjectResult = await query(
      `SELECT s.id, s.name, s.year, s.semester, s.pattern, b.name AS branch
       FROM subjects s
       LEFT JOIN branches b ON b.id = s.branch_id
       WHERE s.code = $1`,
      [subjectCode]
    );

    // Fallback metadata when subject isn't in DB yet
    const subject = subjectResult.rows[0] ?? {
      id: null,
      name: subjectCode,
      year: '',
      semester: null,
      pattern: '2024',
      branch: '',
    };

    // 2. Check if this exact question is already stored
    let questionId = null;
    if (subject.id) {
      const qResult = await query(
        `SELECT id FROM questions
         WHERE subject_id = $1 AND question_text = $2
         LIMIT 1`,
        [subject.id, questionText.trim()]
      );
      questionId = qResult.rows[0]?.id ?? null;
    }

    // 3. Check answer cache
    if (questionId) {
      const cached = await query(
        `SELECT answer_text FROM ai_answers
         WHERE question_id = $1
         ORDER BY generated_at DESC
         LIMIT 1`,
        [questionId]
      );
      if (cached.rows.length > 0) {
        logUsage(req, '/api/ai/explain', req.userId);
        return res.json({ answer: cached.rows[0].answer_text, cached: true });
      }
    }

    // 4. Build prompt and call Claude
    const { system, user } = buildExplainerPrompt({
      subjectName: subject.name,
      branch: subject.branch,
      year: subject.year,
      semester: subject.semester,
      unit: unit ?? null,
      marks: marks ?? null,
      examYear: examYear ?? null,
      examMonth: examMonth ?? null,
      pattern: subject.pattern,
      questionText: questionText.trim(),
    });

    const maxTokens = Math.min((marks ?? 4) * 150, 1500);

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    });

    const answer = message.content[0]?.text ?? '';

    // 5. Cache the answer if we have a question_id
    if (questionId && answer) {
      await query(
        `INSERT INTO ai_answers (question_id, answer_text, model_used)
         VALUES ($1, $2, $3)`,
        [questionId, answer, 'claude-haiku-4-5-20251001']
      );
    }

    // 6. Log usage
    logUsage(req, '/api/ai/explain', req.userId);

    return res.json({ answer, cached: false });

  } catch (err) {
    console.error('AI explain error:', err.message);
    return res.status(500).json({ error: 'AI service unavailable. Try again later.' });
  }
});

// POST /api/ai/explain/stream — SSE streaming version
router.post('/explain/stream', aiRateLimiter, optionalUser, async (req, res) => {
  const { questionText, subjectCode, marks, unit, examYear, examMonth } = req.body;

  if (!questionText?.trim() || !subjectCode?.trim()) {
    return res.status(400).json({ error: 'questionText and subjectCode are required.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const subjectResult = await query(
      `SELECT s.id, s.name, s.year, s.semester, s.pattern, b.name AS branch
       FROM subjects s
       LEFT JOIN branches b ON b.id = s.branch_id
       WHERE s.code = $1`,
      [subjectCode]
    );
    const subject = subjectResult.rows[0] ?? {
      id: null, name: subjectCode, year: '', semester: null, pattern: '2024', branch: '',
    };

    const { system, user } = buildExplainerPrompt({
      subjectName: subject.name, branch: subject.branch, year: subject.year,
      semester: subject.semester, unit: unit ?? null, marks: marks ?? null,
      examYear: examYear ?? null, examMonth: examMonth ?? null,
      pattern: subject.pattern, questionText: questionText.trim(),
    });

    const maxTokens = Math.min((marks ?? 4) * 150, 1500);

    const stream = anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
    logUsage(req, '/api/ai/explain/stream', req.userId);

  } catch (err) {
    console.error('AI stream error:', err.message);
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: 'AI service unavailable. Try again later.' })}\n\n`);
      res.end();
    }
  }
});

// GET /api/ai/usage — how many of today's 3 free AI calls this user has left
router.get('/usage', requireUser, async (req, res) => {
  const LIMIT = 3;
  try {
    const result = await query(
      `SELECT COUNT(*) AS count
       FROM api_usage
       WHERE user_id = $1
         AND endpoint IN ('/api/ai/explain', '/api/ai/explain/stream')
         AND called_at > NOW() - INTERVAL '24 hours'`,
      [req.userId]
    );
    const used = parseInt(result.rows[0].count, 10);
    return res.json({ used, limit: LIMIT, remaining: Math.max(0, LIMIT - used) });
  } catch (err) {
    console.error('AI usage fetch error:', err.message);
    return res.status(500).json({ error: 'Could not fetch usage.' });
  }
});

async function logUsage(req, endpoint, userId) {
  const ip = req.ip ?? req.socket?.remoteAddress ?? 'unknown';
  // Fire-and-forget — never let logging failure surface to the caller
  query(
    `INSERT INTO api_usage (user_id, ip_address, endpoint) VALUES ($1, $2, $3)`,
    [userId ?? null, ip, endpoint]
  ).catch(() => {});
}

export default router;
