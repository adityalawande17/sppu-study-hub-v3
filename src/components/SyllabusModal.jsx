// import Modal from "./Modal";

// const yearLabels = {
//   FE: "First Year (FE)",
//   SE: "Second Year (SE)",
//   TE: "Third Year (TE)",
//   BE: "Final Year (BE)",
// };
// const feBranches = [
//   {
//     name: "All Branches — Common Syllabus",
//     note: "Single syllabus applies to all engineering branches",
//   },
// ];
// const otherBranches = [
//   "Computer Science Engineering",
//   "Information Technology Engineering",
//   "Mechanical Engineering",
//   "Civil Engineering",
//   "Electrical Engineering",
//   "Electronics and Telecommunication Engineering",
// ].map((name) => ({ name }));

// const DlIcon = () => (
//   <svg
//     width="12"
//     height="12"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
//     <polyline points="7 10 12 15 17 10" />
//     <line x1="12" y1="15" x2="12" y2="3" />
//   </svg>
// );

// export default function SyllabusModal({
//   open,
//   onClose,
//   year,
//   pattern = "2019",
// }) {
//   if (!year) return null;
//   const branches = year === "FE" ? feBranches : otherBranches;
//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       title={`SPPU ${yearLabels[year]} Syllabus — ${pattern} Pattern`}
//     >
//       <p
//         style={{
//           fontSize: 14,
//           color: "var(--text-3)",
//           lineHeight: 1.6,
//           marginBottom: 18,
//         }}
//       >
//         Official syllabus PDFs released by Savitribai Phule Pune University.
//       </p>
//       <div style={{ display: "grid", gap: 8 }}>
//         {branches.map((b) => (
//           <div
//             key={b.name}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: 12,
//               padding: "12px 14px",
//               border: "1px solid var(--border)",
//               borderRadius: 10,
//               background: "var(--surface2)",
//             }}
//           >
//             <div>
//               <div
//                 style={{
//                   fontSize: 13,
//                   fontWeight: 500,
//                   color: "var(--heading)",
//                 }}
//               >
//                 {b.name}
//               </div>
//               {b.note && (
//                 <div
//                   style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}
//                 >
//                   {b.note}
//                 </div>
//               )}
//             </div>
//             <a
//               href="http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024/FE%202024%20Pattern%20Syllabus%20-%2016%20July%202024%20(1).pdf"
//               className="syllabus-dl-btn"
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{ flexShrink: 0 }}
//             >
//               <DlIcon /> Download
//             </a>
//           </div>
//         ))}
//       </div>
//     </Modal>
//   );
// }

import Modal from "./Modal";

const yearLabels = {
  FE: "First Year (FE)",
  SE: "Second Year (SE)",
  TE: "Third Year (TE)",
  BE: "Final Year (BE)",
};

const syllabusLinks = {
  2024: {
    FE: [
      {
        name: "All Branches — Common Syllabus",
        note: "Single syllabus for all engineering branches",
        url: "http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024/FE%202024%20Pattern%20Syllabus%20-%2016%20July%202024%20(1).pdf",
      },
    ],

    SE: [
      {
        name: "Computer Engineering",
        url: "http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE%20-%20Computer%20Engineering%20-%202024%20Pattern_18072025.pdf",
      },
      {
        name: "Information Technology",
        url: "http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE%20IT%202024%20Pattern%20Syllabus_15072025.pdf",
      },
      {
        name: "AI & DS",
        url: "http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE%20-%20AIandDS%20-%202024%20Pattern_18072025.pdf",
      },
      {
        name: "Mechanical Engineering",
        url: "http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE%20(2024)%20Mechanical%20Engineering%20Syllabus_15072025.pdf",
      },
      {
        name: "Civil Engineering",
        url: "http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE-Civil2024_pattern-_final_version_22072025.pdf",
      },
      {
        name: "Electrical Engineering",
        url: "http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE_Electrical_Syllabus_2024_pattern_14th_July_15072025.pdf",
      },
      {
        name: "ENTC Engineering",
        url: "http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/SE_EandTC_NEP%202024%20Pat_R2_AY_%2025-26._21072025.pdf",
      },
    ],

    TE: [
      { name: "Computer Engineering", url: "#" },
      {
        name: "Information Technology",
        url: "https://aissmsioit.org/wp-content/uploads/2022/08/Third_Year_Information-Technology_2019_Course_09.07.2021.pdf",
      },
      { name: "AI & DS", url: "#" },
      { name: "Mechanical Engineering", url: "#" },
      { name: "Civil Engineering", url: "#" },
      { name: "Electrical Engineering", url: "#" },
      { name: "ENTC Engineering", url: "#" },
    ],

    BE: [
      { name: "Computer Engineering", url: "#" },
      {
        name: "Information Technology",
        url: "https://aissmsioit.org/wp-content/uploads/2022/08/BE_IT_2019_Course_Syllabus.pdf",
      },
      { name: "AI & DS", url: "#" },
      { name: "Mechanical Engineering", url: "#" },
      { name: "Civil Engineering", url: "#" },
      { name: "Electrical Engineering", url: "#" },
      { name: "ENTC Engineering", url: "#" },
    ],
  },

  2019: {
    FE: [
      {
        name: "All Branches — Common Syllabus",
        note: "Single syllabus for all engineering branches",
        url: "http://collegecirculars.unipune.ac.in/sites/documents/Syllabus%202019/First%20Year%20Engineering%202019%20Patt.%20Structure_05.072019.pdf",
      },
    ],

    SE: [
      { name: "Computer Engineering", url: "#" },
      { name: "Information Technology", url: "#" },
      { name: "Mechanical Engineering", url: "#" },
      { name: "Civil Engineering", url: "#" },
      { name: "Electrical Engineering", url: "#" },
      { name: "ENTC Engineering", url: "#" },
    ],

    TE: [
      {
        name: "Computer Engineering",
        url: "https://www.aitpune.com/Documents/Comp/TE_Computer_2019_Course_revised_draft_7June2021.pdf",
      },
      {
        name: "Information Technology",
        url: "https://aissmsioit.org/wp-content/uploads/2022/08/Third_Year_Information-Technology_2019_Course_09.07.2021.pdf",
      },
      { name: "Mechanical Engineering", url: "#" },
      { name: "Civil Engineering", url: "#" },
      { name: "Electrical Engineering", url: "#" },
      { name: "ENTC Engineering", url: "#" },
    ],

    BE: [
      {
        name: "Computer Engineering",
        url: "https://www.aitpune.com/Documents/Comp/BE%20Syllabus%202022-23.pdf",
      },
      {
        name: "Information Technology",
        url: "https://aissmsioit.org/wp-content/uploads/2022/08/BE_IT_2019_Course_Syllabus.pdf",
      },
      { name: "Mechanical Engineering", url: "#" },
      { name: "Civil Engineering", url: "#" },
      { name: "Electrical Engineering", url: "#" },
      { name: "ENTC Engineering", url: "#" },
    ],
  },
};

const DlIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function SyllabusModal({
  open,
  onClose,
  year,
  pattern = "2019",
}) {
  if (!year) return null;

  const branches = syllabusLinks[pattern]?.[year] || [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`SPPU ${yearLabels[year]} Syllabus — ${pattern} Pattern`}
    >
      <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 18 }}>
        Official syllabus PDFs released by Savitribai Phule Pune University.
      </p>

      <div style={{ display: "grid", gap: 8 }}>
        {branches.map((b) => (
          <div
            key={b.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 14px",
              border: "1px solid var(--border)",
              borderRadius: 10,
              background: "var(--surface2)",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{b.name}</div>
              {b.note && (
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                  {b.note}
                </div>
              )}
            </div>

            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="syllabus-dl-btn"
            >
              <DlIcon /> Download
            </a>
          </div>
        ))}
      </div>
    </Modal>
  );
}
