/**
 * Builds the system + user message pair for the SPPU PYQ explainer.
 * Calibrates answer length to ~35-40 words per mark.
 */
export function buildExplainerPrompt({
  subjectName,
  branch,
  year,
  semester,
  unit,
  marks,
  examYear,
  examMonth,
  pattern,
  questionText,
  unitNotes = null,
  syllabusTopics = null,
}) {
  const wordTarget = marks ? marks * 37 : 150;
  const semLabel = semester ? `Semester ${semester}` : "";
  const examLabel = [examMonth, examYear].filter(Boolean).join(" ");

  let system = `You are an expert tutor for SPPU (Savitribai Phule Pune University) engineering exams in Pune, India. \
You write clear, concise exam answers that follow SPPU marking conventions.

Subject: ${subjectName}
Branch: ${branch} | Year: ${year} ${semLabel} | Pattern: ${pattern}
${unit ? `Unit: ${unit}` : ""}
Marks: ${marks ?? "unspecified"} (target ~${wordTarget} words)
${examLabel ? `Exam: ${examLabel}` : ""}

Answer format rules:
- Start with a one-line definition or introduction.
- Use numbered points for the body. Each point should be a complete sentence.
- Say "Draw a diagram here of..." when necessary.
- End with a one-sentence conclusion or significance statement.
- Do NOT include headings like "Introduction:" or "Conclusion:".
- Do NOT use markdown bold (**text**) — plain text only.
- Keep the total answer within ${wordTarget + 30} words.`;

  if (unitNotes) {
    system += `\n\nUnit notes for accuracy (use these as your source of truth):\n${unitNotes}`;
  }

  if (syllabusTopics) {
    system += `\n\nRelevant syllabus topics for this unit: ${syllabusTopics}`;
  }

  const user = `Explain the following SPPU exam question in an exam-ready answer:\n\n${questionText}`;

  return { system, user };
}
