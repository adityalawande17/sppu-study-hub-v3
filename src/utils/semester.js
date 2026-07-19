export const YEARS = ["FE", "SE", "TE", "BE"];

const YEAR_BASE = { FE: 1, SE: 3, TE: 5, BE: 7 };
const SEMESTER_TO_YEAR = {
  1: "FE", 2: "FE",
  3: "SE", 4: "SE",
  5: "TE", 6: "TE",
  7: "BE", 8: "BE",
};

export function yearForSemester(semester) {
  return SEMESTER_TO_YEAR[semester] ?? null;
}

// half: 1 = first semester of that year, 2 = second
export function semesterFor(year, half) {
  const base = YEAR_BASE[year];
  if (!base) return null;
  return base + (half === 2 ? 1 : 0);
}

export function halfForSemester(semester) {
  const year = yearForSemester(semester);
  if (!year) return null;
  return semester === YEAR_BASE[year] ? 1 : 2;
}

export function semesterLabel(semester) {
  const year = yearForSemester(semester);
  return year ? `${year} · Semester ${semester}` : "Unknown";
}
