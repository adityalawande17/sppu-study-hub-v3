import 'dotenv/config';
import { readFileSync } from 'fs';
import { query } from './index.js';

const seeds = JSON.parse(readFileSync(new URL('./questions-seed.json', import.meta.url), 'utf8'));

let totalSubjects = 0;
let totalQuestions = 0;
let skipped = 0;

for (const subject of seeds) {
  // Upsert subject — insert or get existing id
  const subjectRes = await query(
    `INSERT INTO subjects (code, name, year, semester, credits, pattern)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [subject.subjectCode, subject.subjectName, subject.year, subject.semester, subject.credits, subject.pattern]
  );
  const subjectId = subjectRes.rows[0].id;
  totalSubjects++;

  for (const q of subject.questions) {
    // Skip if exact question already exists for this subject
    const existing = await query(
      `SELECT id FROM questions WHERE subject_id = $1 AND question_text = $2 LIMIT 1`,
      [subjectId, q.question_text.trim()]
    );

    if (existing.rows.length > 0) {
      skipped++;
      continue;
    }

    await query(
      `INSERT INTO questions (subject_id, unit, question_text, marks, exam_year, exam_month, question_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [subjectId, q.unit ?? null, q.question_text.trim(), q.marks ?? null, q.exam_year ?? null, q.exam_month ?? null, q.question_type ?? null]
    );
    totalQuestions++;
  }

  console.log(`✓ ${subject.subjectCode} — ${subject.questions.length} questions processed`);
}

console.log(`\nDone. ${totalSubjects} subjects, ${totalQuestions} questions inserted, ${skipped} skipped (duplicates).`);
process.exit(0);
