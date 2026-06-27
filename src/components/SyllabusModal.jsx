import Modal from "./Modal";
import { useState, useEffect } from "react";

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
      {
        name: "Computer Engineering",
        url: "https://aissmsioit.org/wp-content/uploads/2020/07/SESyllabusCompute.pdf",
      },
      {
        name: "Information Technology",
        url: "https://www.aitpune.com/Documents/IT/Syllabus-seit.pdf",
      },
      {
        name: "AI & DS",
        url: "https://aissmsioit.org/wp-content/uploads/2021/11/SE_AI-DS_Curriculam_2021_28.06.2021.pdf",
      },
      {
        name: "Mechanical Engineering",
        url: "http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2020/SE-Mechanical%20SW%20(Sandwich)%20[2019%20Course]_27.012021.pdf",
      },
      {
        name: "Civil Engineering",
        url: "https://www.vpkbiet.org/syllabus/Civil/SE_CIVIL_SYLLABUS-_2019_course_Final.pdf",
      },
      {
        name: "Electrical Engineering",
        url: "http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2020/SE%20Electrical%20Engg.%202019%20Patt_30.062020.pdf",
      },
      {
        name: "ENTC Engineering",
        url: "https://aissmsioit.org/wp-content/uploads/2020/07/SE-E-Tc-and-Electronics-Engg.-2019-Patt_01.072020.pdf",
      },
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
      {
        name: "AI & DS",
        url: "https://indiraicem.ac.in/assets/pdf/syllabus/TE-syllabus-1.pdf",
      },
      {
        name: "Mechanical Engineering",
        url: "https://www.aitpune.com/Documents/Mech/TE_Mechanical%20Engineering%20(2019%20Course)_27.07.2021.pdf",
      },
      {
        name: "Civil Engineering",
        url: "https://indiraicem.ac.in/assets/pdf/syllabus/TE-Civil_Engg.2019-Course.pdf",
      },
      {
        name: "Electrical Engineering",
        url: "https://www.avcoe.org/pdf/syllbus/electrical/TE%20Electrical%202019%20Syllabus%2009.06.2021%20updated%20(1)_compressed.pdf",
      },
      {
        name: "ENTC Engineering",
        url: "http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2025/TE_ECE-ACT_R_2019%20pattern_12082025.pdf?Mobile=1&Source=%2Fsites%2Fdocuments%2F%5Flayouts%2Fmobile%2Fview%2Easpx%3FList%3D00d69db3%252Dddae%252D4aee%252Dbeb1%252Dae2ce3acbbb9%26View%3D6cebb808%252D8104%252D422b%252Dbf3d%252D83cf839c6de5%26CurrentPage%3D1",
      },
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
      {
        name: "AI & DS",
        url: "http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2023/BE%20-%20AIDS%20-%202020%20%20Syllabus_03082023.pdf?Mobile=1&Source=%2Fsites%2Fdocuments%2F%5Flayouts%2Fmobile%2Fdispform%2Easpx%3FList%3D2287d775%252D5837%252D48c6%252Db1f7%252D9bf338f36c4f%26View%3D98410d72%252D1f22%252D4e17%252Dac3e%252D55bb1e160c8b%26ID%3D59%26CurrentPage%3D1",
      },
      {
        name: "Mechanical Engineering",
        url: "https://engg.dypvp.edu.in/syllabus/Mechanical/BE-Mech-2019.pdf",
      },
      {
        name: "Civil Engineering",
        url: "https://www.vpkbiet.org/syllabus/Civil/B%20E%20Civil%202019%20Pattern_Syllabus.pdf",
      },
      {
        name: "Electrical Engineering",
        url: "https://engg.dypvp.edu.in/syllabus/Electrical/BE-Electrical-Engineering-Syllabus-2019.pdf",
      },
      {
        name: "ENTC Engineering",
        url: "https://www.aitpune.com/Documents/ETC/BEETC_SYLLABUS.pdf",
      },
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
  const [activeYear, setActiveYear] = useState(year || "FE");
  useEffect(() => {
    if (year) setActiveYear(year);
  }, [year]);

  const branches = syllabusLinks[pattern]?.[activeYear] || [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`SPPU ${yearLabels[activeYear]} Syllabus — ${pattern} Pattern`}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["FE", "SE", "TE", "BE"].map((y) => {
          const active = activeYear === y;

          return (
            <button
              className={`syllabus-pill ${active ? "active" : ""}`}
              key={y}
              onClick={() => setActiveYear(y)}
              // style={{
              //   padding: "7px 45px",
              //   borderRadius: 999,
              //   border: `1px solid ${
              //     active ? "var(--primary)" : "var(--border)"
              //   }`,
              //   background: active ? "#4b54675c" : "transparent",
              //   color: active ? "#fff" : "var(--text)",
              //   fontSize: 13,
              //   fontWeight: 600,
              //   cursor: "pointer",
              // }}
            >
              {y}
            </button>
          );
        })}
      </div>

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
