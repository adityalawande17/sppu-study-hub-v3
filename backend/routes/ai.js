import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { query } from '../db/index.js';
import { buildExplainerPrompt } from '../prompts/explainer.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { optionalUser, requireUser } from '../middleware/auth.js';
import { getEmbedding, embeddingToSql } from '../utils/embedding.js';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Cosine distance threshold — 0 = identical, 0.15 = very similar phrasing
const SIMILARITY_THRESHOLD = 0.15;

async function findSimilarCachedAnswer(subjectId, embedding) {
  if (!subjectId || !embedding) return null;
  const vectorStr = embeddingToSql(embedding);
  const result = await query(
    `SELECT q.id, a.answer_text,
            (q.question_embedding <=> $1::vector) AS distance
     FROM questions q
     JOIN ai_answers a ON a.question_id = q.id
     WHERE q.subject_id = $2
       AND q.question_embedding IS NOT NULL
     ORDER BY q.question_embedding <=> $1::vector
     LIMIT 1`,
    [vectorStr, subjectId]
  );
  const row = result.rows[0];
  if (!row || parseFloat(row.distance) > SIMILARITY_THRESHOLD) return null;
  return { questionId: row.id, answer: row.answer_text };
}

async function lookupSubject(subjectCode) {
  const result = await query(
    `SELECT s.id, s.name, s.year, s.semester, s.pattern, b.name AS branch
     FROM subjects s
     LEFT JOIN branches b ON b.id = s.branch_id
     WHERE s.code = $1`,
    [subjectCode]
  );
  return result.rows[0] ?? {
    id: null, name: subjectCode, year: '', semester: null, pattern: '2024', branch: '',
  };
}

async function lookupExactQuestion(subjectId, questionText) {
  if (!subjectId) return null;
  const result = await query(
    `SELECT id FROM questions WHERE subject_id = $1 AND question_text = $2 LIMIT 1`,
    [subjectId, questionText]
  );
  return result.rows[0]?.id ?? null;
}

async function lookupExactCache(questionId) {
  if (!questionId) return null;
  const result = await query(
    `SELECT answer_text FROM ai_answers
     WHERE question_id = $1 ORDER BY generated_at DESC LIMIT 1`,
    [questionId]
  );
  return result.rows[0]?.answer_text ?? null;
}

function buildPrompt(subject, { unit, marks, examYear, examMonth, questionText }) {
  const { system, user } = buildExplainerPrompt({
    subjectName: subject.name, branch: subject.branch,
    year: subject.year, semester: subject.semester,
    unit: unit ?? null, marks: marks ?? null,
    examYear: examYear ?? null, examMonth: examMonth ?? null,
    pattern: subject.pattern, questionText,
  });
  const maxTokens = Math.min((marks ?? 4) * 150, 1500);
  return { system, user, maxTokens };
}

function cacheAnswerAndEmbedding(questionId, answer, embedding) {
  if (!questionId || !answer) return;
  query(
    `INSERT INTO ai_answers (question_id, answer_text, model_used) VALUES ($1, $2, $3)`,
    [questionId, answer, 'claude-haiku-4-5-20251001']
  ).catch(() => {});
  if (embedding) {
    query(
      `UPDATE questions SET question_embedding = $1::vector
       WHERE id = $2 AND question_embedding IS NULL`,
      [embeddingToSql(embedding), questionId]
    ).catch(() => {});
  }
}

// ── POST /api/ai/explain (non-streaming) ──────────────────────────────────────
router.post('/explain', aiRateLimiter, optionalUser, async (req, res) => {
  const { questionText, subjectCode, marks, unit, examYear, examMonth } = req.body;
  if (!questionText?.trim() || !subjectCode?.trim())
    return res.status(400).json({ error: 'questionText and subjectCode are required.' });

  try {
    const subject    = await lookupSubject(subjectCode);
    const questionId = await lookupExactQuestion(subject.id, questionText.trim());

    // 1. Exact cache hit
    const exactAnswer = await lookupExactCache(questionId);
    if (exactAnswer) {
      logUsage(req, '/api/ai/explain', req.userId);
      return res.json({ answer: exactAnswer, cached: true });
    }

    // 2. Semantic similarity cache
    const embedding = await getEmbedding(questionText.trim());
    const similar   = await findSimilarCachedAnswer(subject.id, embedding).catch(() => null);
    if (similar) {
      logUsage(req, '/api/ai/explain', req.userId);
      return res.json({ answer: similar.answer, cached: true });
    }

    // 3. Call Claude
    const { system, user, maxTokens } = buildPrompt(subject, { unit, marks, examYear, examMonth, questionText: questionText.trim() });
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001', max_tokens: maxTokens,
      system, messages: [{ role: 'user', content: user }],
    });
    const answer = message.content[0]?.text ?? '';

    cacheAnswerAndEmbedding(questionId, answer, embedding);
    logUsage(req, '/api/ai/explain', req.userId);
    return res.json({ answer, cached: false });

  } catch (err) {
    console.error('AI explain error:', err.message);
    return res.status(500).json({ error: 'AI service unavailable. Try again later.' });
  }
});

// ── POST /api/ai/explain/stream ───────────────────────────────────────────────
router.post('/explain/stream', aiRateLimiter, optionalUser, async (req, res) => {
  const { questionText, subjectCode, marks, unit, examYear, examMonth } = req.body;
  if (!questionText?.trim() || !subjectCode?.trim())
    return res.status(400).json({ error: 'questionText and subjectCode are required.' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (payload) => res.write(`data: ${JSON.stringify(payload)}\n\n`);

  try {
    const subject    = await lookupSubject(subjectCode);
    const questionId = await lookupExactQuestion(subject.id, questionText.trim());

    // 1. Exact cache hit
    const exactAnswer = await lookupExactCache(questionId);
    if (exactAnswer) {
      send({ text: exactAnswer, cached: true });
      send({ done: true });
      res.end();
      logUsage(req, '/api/ai/explain/stream', req.userId);
      return;
    }

    // 2. Semantic similarity cache
    const embedding = await getEmbedding(questionText.trim());
    const similar   = await findSimilarCachedAnswer(subject.id, embedding).catch(() => null);
    if (similar) {
      send({ text: similar.answer, cached: true });
      send({ done: true });
      res.end();
      logUsage(req, '/api/ai/explain/stream', req.userId);
      return;
    }

    // 3. Stream from Claude
    const { system, user, maxTokens } = buildPrompt(subject, { unit, marks, examYear, examMonth, questionText: questionText.trim() });
    const stream = anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001', max_tokens: maxTokens,
      system, messages: [{ role: 'user', content: user }],
    });

    let fullAnswer = '';
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        fullAnswer += event.delta.text;
        send({ text: event.delta.text });
      }
    }

    send({ done: true });
    res.end();
    logUsage(req, '/api/ai/explain/stream', req.userId);

    // Cache after response is sent — non-blocking
    cacheAnswerAndEmbedding(questionId, fullAnswer, embedding);

  } catch (err) {
    console.error('AI stream error:', err.message);
    if (!res.writableEnded) {
      send({ error: 'AI service unavailable. Try again later.' });
      res.end();
    }
  }
});

// ── GET /api/ai/usage ─────────────────────────────────────────────────────────
router.get('/usage', requireUser, async (req, res) => {
  const LIMIT = 3;
  try {
    const result = await query(
      `SELECT COUNT(*) AS count FROM api_usage
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

function logUsage(req, endpoint, userId) {
  const ip = req.ip ?? req.socket?.remoteAddress ?? 'unknown';
  query(
    `INSERT INTO api_usage (user_id, ip_address, endpoint) VALUES ($1, $2, $3)`,
    [userId ?? null, ip, endpoint]
  ).catch(() => {});
}

export default router;
