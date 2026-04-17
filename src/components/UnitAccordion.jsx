import { useState } from "react";

const defaultUnits = [
  {
    title: "Unit 1 - Fundamentals and Introduction",
    files: [
      { name: "Unit 1 Complete Notes", size: "3.2 MB", type: "PDF", url: "#" },
      { name: "Unit 1 Lecture Slides", size: "5.1 MB", type: "PPT", url: "#" },
    ],
  },
  {
    title: "Unit 2 - Core Principles",
    files: [
      { name: "Unit 2 Complete Notes", size: "2.8 MB", type: "PDF", url: "#" },
    ],
  },
  {
    title: "Unit 3 - Intermediate Concepts",
    files: [
      { name: "Unit 3 Notes - Part A", size: "1.9 MB", type: "PDF", url: "#" },
      { name: "Unit 3 Notes - Part B", size: "1.1 MB", type: "DOC", url: "#" },
    ],
  },
  {
    title: "Unit 4 - Advanced Topics",
    files: [
      { name: "Unit 4 Complete Notes", size: "4.0 MB", type: "PDF", url: "#" },
    ],
  },
  {
    title: "Unit 5 - Applications and Case Studies",
    files: [
      { name: "Unit 5 Notes", size: "2.5 MB", type: "PDF", url: "#" },
      { name: "Unit 5 Slides", size: "3.2 MB", type: "PPT", url: "#" },
    ],
  },
  {
    title: "Unit 6 - Review and Important Questions",
    files: [
      {
        name: "Unit 6 Notes and Summary",
        size: "1.8 MB",
        type: "PDF",
        url: "#",
      },
      {
        name: "Important Questions - All Units",
        size: "0.8 MB",
        type: "DOC",
        url: "#",
      },
    ],
  },
];

const typeStyle = {
  PDF: { bg: "#fee2e2", color: "#991b1b" },
  PPT: { bg: "#ffedd5", color: "#9a3412" },
  DOC: { bg: "#dbeafe", color: "#1e40af" },
};

function FileRow({ file }) {
  const ts = typeStyle[file.type] || typeStyle.DOC;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        border: "1px solid var(--border)",
        borderRadius: 8,
        background: "var(--surface2)",
        transition: "all .15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--gold-dim)";
        e.currentTarget.style.background = "var(--gold-pale)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.background = "var(--surface2)";
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: ts.bg,
          color: ts.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {file.type}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {file.name}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>
          {file.size}
        </div>
      </div>
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: "5px 12px",
          border: "1px solid #0a1628",
          borderRadius: 6,
          background: "transparent",
          color: "var(--heading)",
          fontSize: 12,
          fontWeight: 500,
          textDecoration: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 4,
          transition: "all .15s",
          fontFamily: "Inter, sans-serif",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#0a1628";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--heading)";
        }}
      >
        <svg
          width="11"
          height="11"
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
        Download
      </a>
    </div>
  );
}

export default function UnitAccordion({ units = defaultUnits }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {units.map((unit, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            style={{
              border: "1px solid var(--border)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: isOpen ? "#0a1628" : "var(--surface2)",
                border: "none",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: isOpen ? "#fff" : "var(--heading)",
                textAlign: "left",
                gap: 10,
                transition: "background .15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    background: isOpen
                      ? "rgba(255,255,255,.15)"
                      : "var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    flexShrink: 0,
                    color: isOpen ? "#fff" : "var(--text-3)",
                  }}
                >
                  {i + 1}
                </span>
                {unit.title}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 11, opacity: 0.7 }}>
                  {unit.files.length} file{unit.files.length !== 1 ? "s" : ""}
                </span>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRight: "2px solid currentColor",
                    borderBottom: "2px solid currentColor",
                    transform: isOpen
                      ? "rotate(-135deg) translateY(3px)"
                      : "rotate(45deg)",
                    transition: "transform .2s",
                  }}
                />
              </div>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: "12px 14px",
                  background: "var(--surface)",
                  borderTop: "1px solid var(--border)",
                  display: "grid",
                  gap: 6,
                }}
              >
                {unit.files.length > 0 ? (
                  unit.files.map((f, j) => <FileRow key={j} file={f} />)
                ) : (
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-3)",
                      padding: "8px 0",
                    }}
                  >
                    No files uploaded yet for this unit. Check back soon or
                    contribute your notes.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
