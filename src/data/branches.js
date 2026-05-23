export const branchMeta = {
  cs: {
    key: "cs",
    name: "Computer Engineering",
    short: "Computer Science",
    abbr: "CS",
    color: "var(--cs-color)",
    pale: "var(--cs-pale)",
    dark: "var(--cs-dark)",
  },
  it: {
    key: "it",
    name: "Information Technology Engineering",
    short: "Information Technology",
    abbr: "IT",
    color: "var(--it-color)",
    pale: "var(--it-pale)",
    dark: "var(--it-dark)",
  },
  aids: {
    key: "aids",
    name: "Artifical Intelligence and Data Science Engineering",
    short: "Artificial Intelligence",
    abbr: "AI",
    color: "var(--cs-color)",
    pale: "var(--cs-pale)",
    dark: "var(--cs-dark)",
  },
  me: {
    key: "me",
    name: "Mechanical Engineering",
    short: "Mechanical",
    abbr: "ME",
    color: "var(--me-color)",
    pale: "var(--me-pale)",
    dark: "var(--me-dark)",
  },
  ce: {
    key: "ce",
    name: "Civil Engineering",
    short: "Civil",
    abbr: "CE",
    color: "var(--ce-color)",
    pale: "var(--ce-pale)",
    dark: "var(--ce-dark)",
  },
  ee: {
    key: "ee",
    name: "Electrical Engineering",
    short: "Electrical",
    abbr: "EE",
    color: "var(--ee-color)",
    pale: "var(--ee-pale)",
    dark: "var(--ee-dark)",
  },
  etc: {
    key: "etc",
    name: "Electronics and Telecommunication Engineering",
    short: "E and TC",
    abbr: "EC",
    color: "var(--etc-color)",
    pale: "var(--etc-pale)",
    dark: "var(--etc-dark)",
  },
};

// ── subjects per pattern ──────────────────────────────────────────────────────

//Computer Engineering

const cs2019 = {
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: [
          { code: "210241", name: "Discrete Mathematics", credits: 3 },
          {
            code: "210242",
            name: "Fundamentals of Data Structures",
            credits: 3,
          },
          { code: "210243", name: "Object Oriented Programming", credits: 3 },
          { code: "210244", name: "Computer Graphics", credits: 3 },
          {
            code: "210245",
            name: "Digital Electronics and Logic Design",
            credits: 3,
          },
        ],
      },
      {
        label: "Semester 4",
        subjects: [
          { code: "207003", name: "Engineering Mathematics III", credits: 4 },
          {
            code: "210252",
            name: "Data Structures and Algorithms",
            credits: 3,
          },
          { code: "210253", name: "Software Engineering", credits: 3 },
          { code: "210254", name: "Microprocessor", credits: 3 },
          {
            code: "210255",
            name: "Principles of Programming Languages",
            credits: 3,
          },
        ],
      },
    ],
  },

  TE: {
    label: "Third Year (TE)",
    semesters: [
      {
        label: "Semester 5",
        subjects: [
          {
            code: "310241",
            name: "Database Management Systems",
            credits: 3,
          },
          {
            code: "310242",
            name: "Theory of Computation",
            credits: 3,
          },
          {
            code: "310243",
            name: "Systems Programming and Operating System",
            credits: 3,
          },
          {
            code: "310244",
            name: "Computer Networks and Security",
            credits: 3,
          },
          {
            code: "310245",
            name: "Elective I",
            credits: 3,
          },
        ],
      },

      {
        label: "Semester 6",
        subjects: [
          {
            code: "310251",
            name: "Data Science and Big Data Analytics",
            credits: 3,
          },
          {
            code: "310252",
            name: "Web Technology",
            credits: 3,
          },
          {
            code: "310253",
            name: "Artificial Intelligence",
            credits: 3,
          },
          {
            code: "310254",
            name: "Elective II",
            credits: 3,
          },
        ],
      },
    ],
  },

  BE: {
    label: "Final Year (BE)",
    semesters: [
      {
        label: "Semester 7",
        subjects: [
          {
            code: "410241",
            name: "Design and Analysis of Algorithms",
            credits: 3,
          },
          {
            code: "410242",
            name: "Machine Learning",
            credits: 3,
          },
          {
            code: "410243",
            name: "Blockchain Technology",
            credits: 3,
          },
          {
            code: "410244",
            name: "Elective III",
            credits: 3,
          },
          {
            code: "410245",
            name: "Elective IV",
            credits: 3,
          },
        ],
      },

      {
        label: "Semester 8",
        subjects: [
          {
            code: "410250",
            name: "High Performance Computing",
            credits: 3,
          },
          {
            code: "410251",
            name: "Deep Learning",
            credits: 3,
          },
          {
            code: "410252",
            name: "Elective V",
            credits: 3,
          },
          {
            code: "410253",
            name: "Elective VI",
            credits: 3,
          },
        ],
      },
    ],
  },
};

const cs2024 = {
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: [
          {
            code: "PCC-201-COM",
            name: "Data Structures",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-202-COM",
            name: "Object Oriented Programming and Computer Graphics",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-203-COM",
            name: "Operating Systems",
            credits: 3,
            updated: "2024",
          },

          {
            code: "PCC-204-COM",
            name: "Data Structures Laboratory",
            credits: 2,
            updated: "2024",
          },
          {
            code: "PCC-205-COM",
            name: "OOP and Computer Graphics Laboratory",
            credits: 1,
            updated: "2024",
          },

          {
            code: "OE-1-COM",
            name: "Open Elective I",
            credits: 2,
            updated: "2024",
          },

          {
            code: "MDM-221-COM",
            name: "Digital Electronics and Logic Design",
            credits: 2,
            updated: "2024",
          },
        ],
      },
      {
        label: "Semester 4",
        subjects: [
          {
            code: "PCC-251-COM",
            name: "Database Management Systems",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-252-COM",
            name: "Discrete Mathematics",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-253-COM",
            name: "Computer Organization and Microprocessor",
            credits: 2,
            updated: "2024",
          },

          {
            code: "PCC-254-COM",
            name: "Database Management Laboratory",
            credits: 1,
            updated: "2024",
          },
          {
            code: "PCC-255-COM",
            name: "Microprocessor Laboratory",
            credits: 1,
            updated: "2024",
          },

          {
            code: "OE-2-COM",
            name: "Open Elective II",
            credits: 2,
            updated: "2024",
          },

          {
            code: "MDM-271-COM",
            name: "Internet of Things",
            credits: 2,
            updated: "2024",
          },
          {
            code: "VSE-281-COM",
            name: "Web Development",
            credits: 2,
            updated: "2024",
          },
        ],
      },
    ],
  },
};

// Simplified entries for other branches (2019 pattern)
const makeSimpleBranch = (prefix, se3, se4, te5, te6, be7, be8) => ({
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: se3.map((n, i) => ({
          code: `${prefix}3${i + 1}`,
          name: n,
          credits: i === 1 ? 4 : 3,
          updated: "Jan 2025",
        })),
      },
      {
        label: "Semester 4",
        subjects: se4.map((n, i) => ({
          code: `${prefix}4${i + 1}`,
          name: n,
          credits: i === 0 ? 4 : 3,
          updated: "Jan 2025",
        })),
      },
    ],
  },
  TE: {
    label: "Third Year (TE)",
    semesters: [
      {
        label: "Semester 5",
        subjects: te5.map((n, i) => ({
          code: `${prefix}5${i + 1}`,
          name: n,
          credits: i === 0 ? 4 : 3,
          updated: "Jan 2025",
        })),
      },
      {
        label: "Semester 6",
        subjects: te6.map((n, i) => ({
          code: `${prefix}6${i + 1}`,
          name: n,
          credits: i === 0 ? 4 : 3,
          updated: "Dec 2024",
        })),
      },
    ],
  },
  BE: {
    label: "Final Year (BE)",
    semesters: [
      {
        label: "Semester 7",
        subjects: be7.map((n, i) => ({
          code: `${prefix}7${i + 1}`,
          name: n,
          credits: 3,
          updated: "Jan 2025",
        })),
      },
      {
        label: "Semester 8",
        subjects: be8.map((n, i) => ({
          code: `${prefix}8${i + 1}`,
          name: n,
          credits: 3,
          updated: "Dec 2024",
        })),
      },
    ],
  },
});

// Information Technology Engineering

const it2024 = {
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: [
          {
            code: "PCC-201-ITT",
            name: "Data Structures & Algorithms",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-202-ITT",
            name: "Object Oriented Programming",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-203-ITT",
            name: "Basics of Computer Networks",
            credits: 3,
            updated: "2024",
          },

          { code: "PCC-204-ITT", name: "DSA Lab", credits: 1, updated: "2024" },
          { code: "PCC-205-ITT", name: "OOP Lab", credits: 1, updated: "2024" },

          {
            code: "OE-1-ITT",
            name: "Open Elective I",
            credits: 2,
            updated: "2024",
          },

          {
            code: "MDM-221-ITT",
            name: "Digital Electronics and Logic Design",
            credits: 2,
            updated: "2024",
          },
        ],
      },
      {
        label: "Semester 4",
        subjects: [
          {
            code: "PCC-251-ITT",
            name: "Database Management System",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-252-ITT",
            name: "Computer Graphics",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-253-ITT",
            name: "Probability & Statistics",
            credits: 2,
            updated: "2024",
          },

          {
            code: "PCC-254-ITT",
            name: "DBMS Lab",
            credits: 1,
            updated: "2024",
          },
          {
            code: "PCC-255-ITT",
            name: "Computer Graphics Lab",
            credits: 1,
            updated: "2024",
          },

          {
            code: "OE-2-ITT",
            name: "Open Elective II",
            credits: 2,
            updated: "2024",
          },

          {
            code: "MDM-271-ITT",
            name: "Processor Architecture",
            credits: 2,
            updated: "2024",
          },
        ],
      },
    ],
  },
};

const it2019 = {
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: [
          { code: "214441", name: "Discrete Mathematics", credits: 3 },
          {
            code: "214442",
            name: "Logic Design and Computer Organization",
            credits: 3,
          },
          {
            code: "214443",
            name: "Data Structures and Algorithms",
            credits: 3,
          },
          { code: "214444", name: "Object Oriented Programming", credits: 3 },
          { code: "214445", name: "Basics of Computer Network", credits: 3 },
        ],
      },
      {
        label: "Semester 4",
        subjects: [
          { code: "207003", name: "Engineering Mathematics III", credits: 4 },
          { code: "214451", name: "Processor Architecture", credits: 3 },
          { code: "214452", name: "Database Management System", credits: 3 },
          { code: "214453", name: "Computer Graphics", credits: 3 },
          { code: "214454", name: "Software Engineering", credits: 3 },
        ],
      },
    ],
  },
  TE: {
    label: "Third Year (TE)",
    semesters: [
      {
        label: "Semester 5",
        subjects: [
          {
            code: "314441",
            name: "Theory of Computation",
            credits: 3,
          },
          {
            code: "314442",
            name: "Operating Systems",
            credits: 3,
          },
          {
            code: "314443",
            name: "Machine Learning",
            credits: 3,
          },
          {
            code: "314444",
            name: "Human Computer Interaction",
            credits: 3,
          },
          {
            code: "314445",
            name: "Elective I",
            credits: 3,
          },
        ],
      },

      {
        label: "Semester 6",
        subjects: [
          {
            code: "314451",
            name: "Computer Networks and Security",
            credits: 3,
          },
          {
            code: "314452",
            name: "Data Science and Big Data Analytics",
            credits: 3,
          },
          {
            code: "314453",
            name: "Web Application Development",
            credits: 3,
          },
          {
            code: "314454",
            name: "Elective II",
            credits: 3,
          },
        ],
      },
    ],
  },

  BE: {
    label: "Final Year (BE)",
    semesters: [
      {
        label: "Semester 7",
        subjects: [
          {
            code: "414441",
            name: "Information and Storage Retrieval",
            credits: 3,
          },
          {
            code: "414442",
            name: "Software Project Management",
            credits: 3,
          },
          {
            code: "414443",
            name: "Deep Learning",
            credits: 3,
          },
          {
            code: "414444",
            name: "Elective III",
            credits: 3,
          },
          {
            code: "414445",
            name: "Elective IV",
            credits: 3,
          },
        ],
      },

      {
        label: "Semester 8",
        subjects: [
          {
            code: "414450",
            name: "Distributed Systems",
            credits: 3,
          },
          {
            code: "414451",
            name: "Elective V",
            credits: 3,
          },
          {
            code: "414452",
            name: "Elective VI",
            credits: 3,
          },
        ],
      },
    ],
  },
};

const me2019 = {
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: [
          { code: "202041", name: "Solid Mechanics", credits: 3 },
          { code: "202042", name: "Solid Modeling and Drafting", credits: 3 },
          { code: "202043", name: "Engineering Thermodynamics", credits: 3 },
          {
            code: "202044",
            name: "Engineering Materials and Metallurgy",
            credits: 3,
          },
          {
            code: "203156",
            name: "Electrical and Electronics Engineering",
            credits: 3,
          },
        ],
      },
      {
        label: "Semester 4",
        subjects: [
          { code: "207002", name: "Engineering Mathematics III", credits: 4 },
          { code: "202047", name: "Kinematics of Machinery", credits: 3 },
          { code: "202048", name: "Applied Thermodynamics", credits: 3 },
          { code: "202049", name: "Fluid Mechanics", credits: 3 },
          { code: "202050", name: "Manufacturing Processes", credits: 3 },
        ],
      },
    ],
  },
  TE: {
    label: "Third Year (TE)",
    semesters: [
      {
        label: "Semester 5",
        subjects: [
          {
            code: "302041",
            name: "Numerical and Statistical Methods",
            credits: 3,
          },
          { code: "302042", name: "Heat and Mass Transfer", credits: 3 },
          { code: "302043", name: "Design of Machine Elements", credits: 3 },
          { code: "302044", name: "Mechatronics", credits: 3 },
          { code: "302045", name: "Elective I", credits: 3 },
        ],
      },
      {
        label: "Semester 6",
        subjects: [
          {
            code: "302049",
            name: "Artificial Intelligence and Machine Learning",
            credits: 3,
          },
          { code: "302050", name: "Computer Aided Engineering", credits: 3 },
          {
            code: "302051",
            name: "Design of Transmission Systems",
            credits: 3,
          },
          { code: "302052", name: "Elective II", credits: 3 },
        ],
      },
    ],
  },
  BE: {
    label: "Final Year (BE)",
    semesters: [
      {
        label: "Semester 7",
        subjects: [
          {
            code: "402041",
            name: "Heating Ventilation Air-Conditioning and Refrigeration",
            credits: 3,
          },
          { code: "402042", name: "Dynamics of Machinery", credits: 3 },
          { code: "402043", name: "Turbomachinery", credits: 3 },
          { code: "402044", name: "Elective III", credits: 3 },
          { code: "402045", name: "Elective IV", credits: 3 },
        ],
      },
      {
        label: "Semester 8",
        subjects: [
          {
            code: "402048",
            name: "Computer Integrated Manufacturing",
            credits: 3,
          },
          { code: "402049", name: "Energy Engineering", credits: 3 },
          { code: "402050", name: "Elective V", credits: 3 },
          { code: "402051", name: "Elective VI", credits: 3 },
        ],
      },
    ],
  },
};

//Civil Engineering

const ce2019 = {
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: [
          { code: "207001", name: "Engineering Mathematics III", credits: 4 },
          {
            code: "201001",
            name: "Building Technology and Architectural Planning",
            credits: 3,
          },
          { code: "201002", name: "Mechanics of Structure", credits: 3 },
          { code: "201003", name: "Fluid Mechanics", credits: 3 },
          { code: "201005", name: "Engineering Geology", credits: 3 },
        ],
      },
      {
        label: "Semester 4",
        subjects: [
          { code: "201008", name: "Geotechnical Engineering", credits: 3 },
          { code: "201009", name: "Surveying", credits: 3 },
          { code: "201010", name: "Concrete Technology", credits: 3 },
          { code: "201011", name: "Structural Analysis", credits: 3 },
          { code: "201012", name: "Project Management", credits: 3 },
        ],
      },
    ],
  },
  TE: {
    label: "Third Year (TE)",
    semesters: [
      {
        label: "Semester 5",
        subjects: [
          { code: "301001", name: "Structural Analysis II", credits: 3 },
          {
            code: "301002",
            name: "Hydraulics and Hydraulic Machinery",
            credits: 3,
          },
          { code: "301003", name: "Geotechnical Engineering II", credits: 3 },
          {
            code: "301004",
            name: "Engineering Economics and Financial Management",
            credits: 3,
          },
          { code: "301005", name: "Elective I", credits: 3 },
        ],
      },
      {
        label: "Semester 6",
        subjects: [
          { code: "301009", name: "Environmental Engineering", credits: 3 },
          { code: "301010", name: "Transportation Engineering", credits: 3 },
          { code: "301011", name: "Design of Concrete Structures", credits: 3 },
          { code: "301012", name: "Elective II", credits: 3 },
        ],
      },
    ],
  },
  BE: {
    label: "Final Year (BE)",
    semesters: [
      {
        label: "Semester 7",
        subjects: [
          { code: "401001", name: "Foundation Engineering", credits: 3 },
          { code: "401002", name: "Transportation Engineering II", credits: 3 },
          { code: "401003", name: "Elective III", credits: 3 },
          { code: "401004", name: "Elective IV", credits: 3 },
        ],
      },
      {
        label: "Semester 8",
        subjects: [
          { code: "401010", name: "Construction Management", credits: 3 },
          { code: "401011", name: "Dams and Hydraulic Structures", credits: 3 },
          { code: "401012", name: "Elective V", credits: 3 },
          { code: "401013", name: "Elective VI", credits: 3 },
        ],
      },
    ],
  },
};

const ce2024 = {
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: [
          {
            code: "PCC-201-CVL",
            name: "Mechanics of Structures",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-202-CVL",
            name: "Surveying",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-203-CVL",
            name: "Building Construction and Materials",
            credits: 3,
            updated: "2024",
          },

          {
            code: "PCC-204-CVL",
            name: "Building Construction and Materials Lab",
            credits: 1,
            updated: "2024",
          },
          {
            code: "PCC-205-CVL",
            name: "Mechanics of Structures Lab",
            credits: 1,
            updated: "2024",
          },

          {
            code: "OE-1-CVL",
            name: "Open Elective I",
            credits: 2,
            updated: "2024",
          },

          {
            code: "MDM-221-CVL",
            name: "Engineering Mathematics III",
            credits: 3,
            updated: "2024",
          },
          {
            code: "EEM-231-CVL",
            name: "Economics for Civil Engineers",
            credits: 2,
            updated: "2024",
          },
          {
            code: "VEC-232-CVL",
            name: "Universal Human Values and Professional Ethics",
            credits: 2,
            updated: "2024",
          },
          {
            code: "FP-241-CVL",
            name: "Field Survey Project",
            credits: 2,
            updated: "2024",
          },
        ],
      },
      {
        label: "Semester 4",
        subjects: [
          {
            code: "PCC-251-CVL",
            name: "Fluid Mechanics",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-252-CVL",
            name: "Structural Analysis",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-253-CVL",
            name: "Concrete Technology",
            credits: 3,
            updated: "2024",
          },

          {
            code: "PCC-254-CVL",
            name: "Concrete Technology Lab",
            credits: 1,
            updated: "2024",
          },
          {
            code: "PCC-255-CVL",
            name: "Fluid Mechanics Lab",
            credits: 1,
            updated: "2024",
          },

          {
            code: "OE-2-CVL",
            name: "Open Elective II",
            credits: 2,
            updated: "2024",
          },

          {
            code: "MDM-271-CVL",
            name: "Engineering Geology",
            credits: 2,
            updated: "2024",
          },
          {
            code: "VSEC-281-CVL",
            name: "Application of Python",
            credits: 1,
            updated: "2024",
          },
          {
            code: "AEC-282-CVL",
            name: "Modern Indian Language (Marathi)",
            credits: 2,
            updated: "2024",
          },
          {
            code: "EEM-283-CVL",
            name: "Project Management",
            credits: 2,
            updated: "2024",
          },
          {
            code: "VEC-284-CVL",
            name: "Environmental Awareness",
            credits: 2,
            updated: "2024",
          },
        ],
      },
    ],
  },
};

//Electrical Engineering

const ee2019 = {
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: [
          { code: "203141", name: "Power Generation Technologies", credits: 3 },
          { code: "203142", name: "Material Science", credits: 3 },
          {
            code: "203143",
            name: "Analog and Digital Electronics",
            credits: 3,
          },
          {
            code: "203144",
            name: "Electrical Measurement and Instrumentation",
            credits: 3,
          },
        ],
      },
      {
        label: "Semester 4",
        subjects: [
          { code: "203145", name: "Power System I", credits: 3 },
          { code: "203146", name: "Electrical Machines I", credits: 3 },
          { code: "203147", name: "Network Analysis", credits: 3 },
          {
            code: "203148",
            name: "Numerical Methods and Computer Programming",
            credits: 3,
          },
          {
            code: "203149",
            name: "Fundamentals of Microcontrollers and Applications",
            credits: 3,
          },
        ],
      },
    ],
  },
  TE: {
    label: "Third Year (TE)",
    semesters: [
      {
        label: "Semester 5",
        subjects: [
          {
            code: "303141",
            name: "Industrial and Technology Management",
            credits: 3,
          },
          { code: "303142", name: "Power Electronics", credits: 3 },
          { code: "303143", name: "Electrical Machines II", credits: 3 },
          {
            code: "303144",
            name: "Electrical Installation Design and Condition Based Maintenance",
            credits: 3,
          },
          { code: "303145", name: "Elective I", credits: 3 },
        ],
      },
      {
        label: "Semester 6",
        subjects: [
          { code: "303148", name: "Power System II", credits: 3 },
          {
            code: "303149",
            name: "Computer Aided Design of Electrical Machines",
            credits: 3,
          },
          { code: "303150", name: "Control System Engineering", credits: 3 },
          { code: "303151", name: "Elective II", credits: 3 },
        ],
      },
    ],
  },
  BE: {
    label: "Final Year (BE)",
    semesters: [
      {
        label: "Semester 7",
        subjects: [
          {
            code: "403141",
            name: "Power System Operation and Control",
            credits: 3,
          },
          { code: "403142", name: "Advanced Control System", credits: 3 },
          { code: "403143", name: "Elective III", credits: 3 },
          { code: "403144", name: "Elective IV", credits: 3 },
        ],
      },
      {
        label: "Semester 8",
        subjects: [
          { code: "403148", name: "Advanced Power Electronics", credits: 3 },
          { code: "403149", name: "High Voltage Engineering", credits: 3 },
          { code: "403150", name: "Elective V", credits: 3 },
          { code: "403151", name: "Elective VI", credits: 3 },
        ],
      },
    ],
  },
};

const ee2024 = {
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: [
          {
            code: "PCC-201-ELE",
            name: "Electrical Measurements & Instrumentation",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-202-ELE",
            name: "Analog and Digital Electronics",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-203-ELE",
            name: "Power System Engineering-I",
            credits: 3,
            updated: "2024",
          },

          {
            code: "PCC-204-ELE",
            name: "Electrical Measurements Lab",
            credits: 1,
            updated: "2024",
          },
          {
            code: "PCC-205-ELE",
            name: "Analog and Digital Electronics Lab",
            credits: 1,
            updated: "2024",
          },

          {
            code: "OE-1-ELE",
            name: "Open Elective I",
            credits: 2,
            updated: "2024",
          },

          {
            code: "MDM-222-ELE",
            name: "Engineering Mathematics III",
            credits: 3,
            updated: "2024",
          },
          {
            code: "EEM-231-ELE",
            name: "Engineering Economics",
            credits: 2,
            updated: "2024",
          },
          {
            code: "VEC-232-ELE",
            name: "Universal Human Values & Professional Ethics",
            credits: 2,
            updated: "2024",
          },
          {
            code: "CEP-241-ELE",
            name: "Energy Literacy & Electrical Safety Project",
            credits: 2,
            updated: "2024",
          },
        ],
      },
      {
        label: "Semester 4",
        subjects: [
          {
            code: "PCC-251-ELE",
            name: "Electrical Machines-I",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-252-ELE",
            name: "Numerical Methods and Computer Programming",
            credits: 2,
            updated: "2024",
          },
          {
            code: "PCC-253-ELE",
            name: "Network Analysis",
            credits: 2,
            updated: "2024",
          },

          {
            code: "PCC-254-ELE",
            name: "Electrical Machines Lab",
            credits: 1,
            updated: "2024",
          },
          {
            code: "PCC-255-ELE",
            name: "Numerical Methods Lab",
            credits: 1,
            updated: "2024",
          },
          {
            code: "PCC-256-ELE",
            name: "Network Analysis Lab",
            credits: 1,
            updated: "2024",
          },

          {
            code: "OE-2-ELE",
            name: "Open Elective II",
            credits: 2,
            updated: "2024",
          },

          {
            code: "MDM-272-ELE",
            name: "Fundamentals of Data Science & Machine Learning",
            credits: 2,
            updated: "2024",
          },
          {
            code: "VSE-281-ELE",
            name: "Electrical Workshop",
            credits: 2,
            updated: "2024",
          },
          {
            code: "AEC-282-ELE",
            name: "Modern Indian Language (Marathi/Hindi)",
            credits: 2,
            updated: "2024",
          },
          {
            code: "EEM-283-ELE",
            name: "Industrial Organization and Management",
            credits: 2,
            updated: "2024",
          },
          {
            code: "VEC-284-ELE",
            name: "Environmental Awareness for Electrical Engineers",
            credits: 2,
            updated: "2024",
          },
        ],
      },
    ],
  },
};

//Electronics and Telecommunication Engineering

const etc2019 = {
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: [
          { code: "207005", name: "Engineering Mathematics III", credits: 4 },
          { code: "204181", name: "Electronic Circuits", credits: 3 },
          { code: "204182", name: "Digital Circuits", credits: 3 },
          { code: "204183", name: "Electrical Circuits", credits: 3 },
          { code: "204184", name: "Data Structures", credits: 3 },
        ],
      },
      {
        label: "Semester 4",
        subjects: [
          { code: "204191", name: "Signals and Systems", credits: 3 },
          { code: "204192", name: "Control Systems", credits: 3 },
          {
            code: "204193",
            name: "Principles of Communication Systems",
            credits: 3,
          },
          { code: "204194", name: "Object Oriented Programming", credits: 3 },
        ],
      },
    ],
  },
  TE: {
    label: "Third Year (TE)",
    semesters: [
      {
        label: "Semester 5",
        subjects: [
          { code: "304181", name: "Digital Communication", credits: 3 },
          { code: "304182", name: "Electromagnetic Field Theory", credits: 3 },
          { code: "304183", name: "Database Management", credits: 3 },
          { code: "304184", name: "Microcontrollers", credits: 3 },
          { code: "304185", name: "Elective I", credits: 3 },
        ],
      },
      {
        label: "Semester 6",
        subjects: [
          { code: "304192", name: "Cellular Networks", credits: 3 },
          { code: "304193", name: "Project Management", credits: 3 },
          { code: "304194", name: "Power Devices & Circuits", credits: 3 },
          { code: "304195", name: "Elective II", credits: 3 },
        ],
      },
    ],
  },
  BE: {
    label: "Final Year (BE)",
    semesters: [
      {
        label: "Semester 7",
        subjects: [
          {
            code: "404181",
            name: "Radiation and Microwave Theory",
            credits: 3,
          },
          { code: "404182", name: "VLSI Design and Technology", credits: 3 },
          { code: "404183", name: "Cloud Computing", credits: 3 },
          { code: "404184", name: "Elective III", credits: 3 },
          { code: "404185", name: "Elective IV", credits: 3 },
        ],
      },
      {
        label: "Semester 8",
        subjects: [
          {
            code: "404190",
            name: "Advanced Communication Systems",
            credits: 3,
          },
          { code: "404191", name: "Digital Signal Processing", credits: 3 },
          { code: "404192", name: "Elective V", credits: 3 },
          { code: "404193", name: "Elective VI", credits: 3 },
        ],
      },
    ],
  },
};

const etc2024 = {
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: [
          {
            code: "PCC-201-ETC",
            name: "Electronics Circuits",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-202-ETC",
            name: "Engineering Mathematics III",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-203-ETC",
            name: "Digital Electronics",
            credits: 3,
            updated: "2024",
          },

          {
            code: "PCC-204-ETC",
            name: "Electronics Circuits & Digital Electronics Lab",
            credits: 1,
            updated: "2024",
          },

          {
            code: "OE-1-ETC",
            name: "Open Elective I",
            credits: 2,
            updated: "2024",
          },

          {
            code: "MDM-221-ETC",
            name: "Data Structures & Algorithms",
            credits: 3,
            updated: "2024",
          },
          { code: "MDM-222-ETC", name: "DSA Lab", credits: 1, updated: "2024" },
          {
            code: "EEM-231-ETC",
            name: "Engineering Economics & Applications",
            credits: 2,
            updated: "2024",
          },
          {
            code: "VEC-232-ETC",
            name: "Universal Human Values & Professional Ethics",
            credits: 2,
            updated: "2024",
          },
          {
            code: "CEP-241-ETC",
            name: "Community Engagement Project",
            credits: 2,
            updated: "2024",
          },
        ],
      },
      {
        label: "Semester 4",
        subjects: [
          {
            code: "PCC-251-ETC",
            name: "Communication Engineering",
            credits: 2,
            updated: "2024",
          },
          {
            code: "PCC-252-ETC",
            name: "Signals and Systems",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-253-ETC",
            name: "Control Systems",
            credits: 3,
            updated: "2024",
          },

          {
            code: "PCC-254-ETC",
            name: "Communication Engineering Lab",
            credits: 1,
            updated: "2024",
          },
          {
            code: "PCC-255-ETC",
            name: "Signals & Systems and OOP Lab",
            credits: 1,
            updated: "2024",
          },

          {
            code: "OE-2-ETC",
            name: "Open Elective II",
            credits: 2,
            updated: "2024",
          },

          {
            code: "MDM-271-ETC",
            name: "Object Oriented Programming",
            credits: 2,
            updated: "2024",
          },
          {
            code: "VSE-281-ETC",
            name: "Electronics Skill Development Lab",
            credits: 2,
            updated: "2024",
          },
          {
            code: "AEC-282-ETC",
            name: "Modern Indian Language (Marathi/Hindi)",
            credits: 2,
            updated: "2024",
          },
          {
            code: "EEM-283-ETC",
            name: "Entrepreneurship Skill Development",
            credits: 2,
            updated: "2024",
          },
          {
            code: "VEC-284-ETC",
            name: "Environment Awareness",
            credits: 2,
            updated: "2024",
          },
        ],
      },
    ],
  },
};

//Artificial Intelligence & Data Science Engineering

const aids2019 = {
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: [
          { code: "210241", name: "Discrete Mathematics", credits: 3 },
          {
            code: "210242",
            name: "Fundamentals of Data Structures",
            credits: 3,
          },
          { code: "210243", name: "Object Oriented Programming", credits: 3 },
          { code: "210244", name: "Computer Graphics", credits: 3 },
          { code: "217521", name: "Operating Systems", credits: 3 },
        ],
      },
      {
        label: "Semester 4",
        subjects: [
          { code: "207003", name: "Engineering Mathematics III", credits: 4 },
          { code: "217528", name: "Database Management System", credits: 3 },
          { code: "217529", name: "Software Engineering", credits: 3 },
          { code: "217530", name: "Microprocessors", credits: 3 },
        ],
      },
    ],
  },
  TE: {
    label: "Third Year (TE)",
    semesters: [
      {
        label: "Semester 5",
        subjects: [
          { code: "310241", name: "Database Management System", credits: 3 },
          { code: "317521", name: "Computer Networks", credits: 3 },
          { code: "317522", name: "Artificial Intelligence", credits: 3 },
          { code: "317523", name: "Machine Learning", credits: 3 },
          { code: "317524", name: "Elective I", credits: 3 },
        ],
      },
      {
        label: "Semester 6",
        subjects: [
          { code: "317529", name: "Data Science", credits: 3 },
          { code: "317530", name: "Cyber Security", credits: 3 },
          { code: "317531", name: "Artificial Neural Network", credits: 3 },
          { code: "317532", name: "Elective II", credits: 3 },
        ],
      },
    ],
  },
  BE: {
    label: "Final Year (BE)",
    semesters: [
      {
        label: "Semester 7",
        subjects: [
          { code: "417521", name: "Business Intelligence", credits: 3 },
          { code: "417522", name: "Computational Intelligence", credits: 3 },
          { code: "417523", name: "Reinforcement Learning", credits: 3 },
          { code: "417524", name: "Elective III", credits: 3 },
          { code: "417525", name: "Elective IV", credits: 3 },
        ],
      },
      {
        label: "Semester 8",
        subjects: [
          { code: "417526", name: "Distributed Computing", credits: 3 },
          { code: "417527", name: "Deep Learning", credits: 3 },
          { code: "417528", name: "Elective V", credits: 3 },
          { code: "417529", name: "Elective VI", credits: 3 },
        ],
      },
    ],
  },
};

const aids2024 = {
  SE: {
    label: "Second Year (SE)",
    semesters: [
      {
        label: "Semester 3",
        subjects: [
          {
            code: "PCC-201-AID",
            name: "Data Structures",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-202-AID",
            name: "Artificial Intelligence",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-203-AID",
            name: "Operating System",
            credits: 3,
            updated: "2024",
          },

          {
            code: "PCC-204-AID",
            name: "Data Structures Lab",
            credits: 2,
            updated: "2024",
          },
          {
            code: "PCC-205-AID",
            name: "Artificial Intelligence Lab",
            credits: 1,
            updated: "2024",
          },

          {
            code: "OE-1-AID",
            name: "Open Elective I",
            credits: 2,
            updated: "2024",
          },

          {
            code: "MDM-221-AID",
            name: "Digital Electronics and Logic Design",
            credits: 2,
            updated: "2024",
          },
          {
            code: "EEM-231-AID",
            name: "Entrepreneurship Development",
            credits: 2,
            updated: "2024",
          },
          {
            code: "VEC-232-AID",
            name: "Universal Human Values and Professional Ethics",
            credits: 2,
            updated: "2024",
          },
          {
            code: "CEP-241-AID",
            name: "Community Engagement Project",
            credits: 2,
            updated: "2024",
          },
        ],
      },
      {
        label: "Semester 4",
        subjects: [
          {
            code: "PCC-251-AID",
            name: "Database Management Systems",
            credits: 3,
            updated: "2024",
          },
          {
            code: "PCC-252-AID",
            name: "Data Science",
            credits: 2,
            updated: "2024",
          },
          {
            code: "PCC-253-AID",
            name: "Probability & Statistics",
            credits: 3,
            updated: "2024",
          },

          {
            code: "PCC-254-AID",
            name: "DBMS Lab",
            credits: 1,
            updated: "2024",
          },
          {
            code: "PCC-255-AID",
            name: "Data Science Lab",
            credits: 1,
            updated: "2024",
          },

          {
            code: "OE-2-AID",
            name: "Open Elective II",
            credits: 2,
            updated: "2024",
          },

          {
            code: "MDM-271-AID",
            name: "Embedded Systems",
            credits: 2,
            updated: "2024",
          },
          {
            code: "VSE-281-AID",
            name: "Object Oriented Programming",
            credits: 2,
            updated: "2024",
          },
          {
            code: "AEC-282-AID",
            name: "Modern Indian Language (Marathi)",
            credits: 2,
            updated: "2024",
          },
          {
            code: "EEM-283-AID",
            name: "Startup Development",
            credits: 2,
            updated: "2024",
          },
          {
            code: "VEC-284-AID",
            name: "Environmental Studies",
            credits: 2,
            updated: "2024",
          },
        ],
      },
    ],
  },
};

export const branchData = {
  2019: {
    cs: cs2019,
    it: it2019,
    aids: aids2019,
    me: me2019,
    ce: ce2019,
    ee: ee2019,
    etc: etc2019,
  },
  2024: {
    cs: cs2024,
    it: it2024,
    aids: aids2024,
    me: me2019,
    ce: ce2024,
    ee: ee2024,
    etc: etc2024,
  },
};

// Build search index for both patterns
export const searchIndex = [];
["2019", "2024"].forEach((pat) => {
  Object.keys(branchData[pat]).forEach((bk) => {
    const meta = branchMeta[bk];
    Object.keys(branchData[pat][bk]).forEach((yr) => {
      branchData[pat][bk][yr].semesters.forEach((sem) => {
        sem.subjects.forEach((sub) => {
          if (!searchIndex.find((s) => s.code === sub.code))
            searchIndex.push({
              ...sub,
              branch: meta.name,
              branchKey: bk,
              yearKey: yr,
              sem: sem.label,
              pattern: pat,
            });
        });
      });
    });
  });
});
