// Edit this file to add/update news items.
// category: 'result' | 'exam' | 'syllabus' | 'notice' | 'new'
export const newsItems = [
  {
    id: 1,
    title: "Updated First year Section with previous year question papers",
    date: "2025-03-15",
    category: "new",
    link: null,
    description:
      "Section might also contain question papers from 2019 pattern, as the syllabus is same you can refer them as well",
  },
  {
    id: 2,
    title: "BE and TE End Semester Results Declared",
    date: "2026-01-29",
    category: "result",
    link: "https://results.unipune.ac.in",
    description:
      "Results for BE and TE end semester examinations (November 2025) have been declared on the official SPPU portal.",
  },
  {
    id: 3,
    title: "SE End Semester Exam Timetable Released",
    date: "2025-04-05",
    category: "exam",
    link: "https://unipune.ac.in",
    description:
      "The timetable for SE end semester examinations for April-May 2025 has been published. Check the official SPPU website for your schedule.",
  },
  {
    id: 4,
    title: "2024 Pattern Syllabus Updated for TE",
    date: "2025-03-28",
    category: "syllabus",
    link: "https://unipune.ac.in",
    description:
      "SPPU has released the revised syllabus for TE (Third Year) under the 2024 pattern. Download the updated PDF from the Syllabus section.",
  },
  {
    id: 5,
    title: "Hall Tickets Available for April 2025 Exams",
    date: "2025-03-20",
    category: "notice",
    link: "https://unipune.ac.in",
    description:
      "Hall tickets for April-May 2025 end semester examinations are now available for download on the student portal.",
  },
  {
    id: 6,
    title: "FE Admissions 2025-26 Schedule Announced",
    date: "2025-03-10",
    category: "notice",
    link: "https://unipune.ac.in",
    description:
      "SPPU has announced the schedule for First Year Engineering admissions for the academic year 2025-26 through CAP rounds.",
  },
];

export const categoryLabels = {
  result: { label: "Result", badge: "badge-result" },
  exam: { label: "Exam", badge: "badge-exam" },
  syllabus: { label: "Syllabus", badge: "badge-syllabus" },
  notice: { label: "Notice", badge: "badge-notice" },
  new: { label: "New", badge: "badge-new" },
};
