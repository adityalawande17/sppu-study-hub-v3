import 'dotenv/config';
import { query } from './index.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BATCH_SIZE = 20;    // OpenAI allows up to 2048 inputs per call; 20 is safe
const DELAY_MS   = 500;   // ms between batches to stay under rate limits

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in backend/.env');
  process.exit(1);
}

async function getEmbeddings(texts) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-ada-002', input: texts }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`OpenAI ${res.status}: ${err.error?.message ?? 'unknown error'}`);
  }

  const data = await res.json();
  // data.data is sorted by index, so order is preserved
  return data.data.map(d => d.embedding);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── fetch all questions that still need an embedding ─────────────────────────
const { rows: questions } = await query(
  `SELECT id, question_text FROM questions WHERE question_embedding IS NULL ORDER BY id`
);

if (questions.length === 0) {
  console.log('All questions already have embeddings. Nothing to do.');
  process.exit(0);
}

console.log(`Found ${questions.length} question(s) without embeddings.`);
console.log(`Processing in batches of ${BATCH_SIZE}...\n`);

let done   = 0;
let failed = 0;

for (let i = 0; i < questions.length; i += BATCH_SIZE) {
  const batch = questions.slice(i, i + BATCH_SIZE);

  try {
    const embeddings = await getEmbeddings(batch.map(q => q.question_text));

    for (let j = 0; j < batch.length; j++) {
      // pgvector expects the vector as a bracketed string: [0.1, 0.2, ...]
      const vectorStr = `[${embeddings[j].join(',')}]`;
      await query(
        `UPDATE questions SET question_embedding = $1::vector WHERE id = $2`,
        [vectorStr, batch[j].id]
      );
      done++;
    }

    console.log(`✓ ${done}/${questions.length} embedded`);

    // pause between batches (skip delay after the last one)
    if (i + BATCH_SIZE < questions.length) await sleep(DELAY_MS);

  } catch (err) {
    console.error(`✗ Batch starting at row ${i + 1} failed: ${err.message}`);
    failed += batch.length;
  }
}

console.log(`\nFinished. ${done} embedded, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
