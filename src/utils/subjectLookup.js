import { searchIndex } from "../data/branches";
import { feSearchIndex } from "../data/feSubjects";
import { yearForSemester } from "./semester";

const allSubjects = [...feSearchIndex, ...searchIndex];

// FE is common to every branch, so it has no branch dimension in feSearchIndex —
// callers just pass the profile's branch/semester/pattern and this handles the split.
export function getSubjectsFor(branch, currentSemester, pattern) {
  const yearKey = yearForSemester(currentSemester);
  if (!yearKey) return [];
  const semLabel = `Semester ${currentSemester}`;

  if (yearKey === "FE") {
    return allSubjects.filter(
      (s) => s.branchKey === "fe" && s.pattern === pattern && s.sem === semLabel,
    );
  }

  return allSubjects.filter(
    (s) =>
      s.branchKey === branch &&
      s.pattern === pattern &&
      s.yearKey === yearKey &&
      s.sem === semLabel,
  );
}
