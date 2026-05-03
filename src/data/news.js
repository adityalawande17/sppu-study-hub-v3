// Edit this file to add/update news items.
// category: 'result' | 'exam' | 'syllabus' | 'notice' | 'new'
export const newsItems = [
  {
    id: 1,
    title: "B.E 2019 Pattern Time Table Released",
    date: "2026-05-04",
    category: "exam",
    link: "http://collegecirculars.unipune.ac.in/sites/examdocs/Time%20Tables%20APRMAY%202026/B.E.%20(2019%20PATTERN)%20ENDSEM%20EXAM%20TIMETABLE%20FOR%20SUMMER%20SESSION-2026%20(APRIL-MAY-2026).pdf",
    description:
      "Hope you all had great farewell parties. Now its time to study...",
  },
  {
    id: 2,
    title:
      "Updated IT Engineering Branch with solved previous year question papers",
    date: "2026-05-1",
    category: "new",
    link: null,
    description:
      "Section might also contain question papers from 2019 pattern, as the syllabus is same you can refer them as well",
  },
  {
    id: 3,
    title: "Updated First year Section with previous year question papers",
    date: "2026-03-15",
    category: "new",
    link: null,
    description:
      "Section might also contain question papers from 2019 pattern, as the syllabus is same you can refer them as well",
  },
];

export const categoryLabels = {
  result: { label: "Result", badge: "badge-result" },
  exam: { label: "Exam", badge: "badge-exam" },
  syllabus: { label: "Syllabus", badge: "badge-syllabus" },
  notice: { label: "Notice", badge: "badge-notice" },
  new: { label: "New", badge: "badge-new" },
};
