const TOTAL_SEMESTERS = 8;

const YEAR_SEMESTERS = {
  FE: [1, 2],
  SE: [3, 4],
  TE: [5, 6],
  BE: [7, 8],
};

export function averageSgpa(records) {
  if (records.length === 0) return null;
  const sum = records.reduce((s, r) => s + r.sgpa, 0);
  return sum / records.length;
}

export function percentageFromCgpa(cgpa) {
  if (cgpa === null) return null;
  return (cgpa - 0.5) * 10;
}

export function yearCgpa(records, year) {
  const sems = YEAR_SEMESTERS[year] ?? [];
  return averageSgpa(records.filter((r) => sems.includes(r.semester)));
}

// SPPU-style cutoffs — worth double-checking against your curriculum's
// official regulation document, since these can vary by year/faculty.
export function classLabel(percentage) {
  if (percentage === null) return null;
  if (percentage >= 70) return "Distinction";
  if (percentage >= 60) return "First Class";
  if (percentage >= 50) return "Second Class";
  return "Pass Class";
}

// How much SGPA is needed, on average, across the remaining (not-yet-entered)
// semesters to reach `targetPercentage` overall (defaults to Distinction's 70%).
export function neededSgpaForTarget(records, targetPercentage = 70) {
  const filled = records.length;
  const remaining = TOTAL_SEMESTERS - filled;
  const targetCgpa = targetPercentage / 10 + 0.5;
  const currentSum = records.reduce((s, r) => s + r.sgpa, 0);

  if (remaining <= 0) {
    const cgpa = filled > 0 ? currentSum / filled : null;
    return {
      remaining: 0,
      achieved: cgpa !== null && cgpa >= targetCgpa,
      neededAvg: null,
      achievable: null,
    };
  }

  const neededAvg = (targetCgpa * TOTAL_SEMESTERS - currentSum) / remaining;

  return {
    remaining,
    achieved: false,
    neededAvg,
    achievable: neededAvg <= 10,
    alreadyGuaranteed: neededAvg <= 0,
  };
}
