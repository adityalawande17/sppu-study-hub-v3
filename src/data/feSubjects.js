export const feSubjects = {
  2019: {
    sem1: [],

    sem2: [],
  },

  2024: {
    sem1: [
      {
        code: "BSC-101-BES",
        name: "Engineering Mathematics I",
        credits: 4,
        type: "Theory + Tutorial",
        updated: "2024",
      },

      // GROUP A
      {
        code: "BSC-102-BES",
        name: "Engineering Physics",
        credits: 4,
        type: "Theory + Practical",
        updated: "2024",
      },
      {
        code: "ESC-101-ETC",
        name: "Basic Electronics Engineering",
        credits: 3,
        type: "Theory + Practical",
        updated: "2024",
      },
      {
        code: "ESC-103-MEC",
        name: "Engineering Graphics",
        credits: 3,
        type: "Theory + Practical",
        updated: "2024",
      },

      {
        code: "ESC-105-COM",
        name: "Fundamentals of Programming Languages",
        credits: 3,
        type: "Theory + Practical",
        updated: "2024",
      },
    ],

    sem2: [
      {
        code: "BSC-151-BES",
        name: "Engineering Mathematics II",
        credits: 4,
        type: "Theory + Tutorial",
        updated: "2024",
      },

      // GROUP B
      {
        code: "BSC-103-BES",
        name: "Engineering Chemistry",
        credits: 4,
        type: "Theory + Practical",
        updated: "2024",
      },
      {
        code: "ESC-102-ELE",
        name: "Basic Electrical Engineering",
        credits: 3,
        type: "Theory + Practical",
        updated: "2024",
      },
      {
        code: "ESC-104-CVL",
        name: "Engineering Mechanics",
        credits: 3,
        type: "Theory + Practical",
        updated: "2024",
      },

      {
        code: "PCC-151-ITT",
        name: "Programming and Problem Solving",
        credits: 3,
        type: "Theory + Practical",
        updated: "2024",
      },
    ],
  },
};

export const feSearchIndex = ["2019", "2024"].flatMap((pat) =>
  ["sem1", "sem2"].flatMap((s, i) =>
    feSubjects[pat][s].map((sub) => ({
      ...sub,
      branch: "First Year",
      branchKey: "fe",
      yearKey: "FE",
      sem: `Semester ${i + 1}`,
      pattern: pat,
    })),
  ),
);
