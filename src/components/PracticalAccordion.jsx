import { useState } from "react";

// ── Resource type config ─────────────────────────────────────────────────────
// Supported types in JSON: 'PDF' | 'DOC' | 'PPT' | 'VIDEO' | 'YOUTUBE' | 'LINK' | 'ZIP'
const resourceConfig = {
  PDF: { bg: "#fee2e2", color: "#991b1b", label: "PDF", action: "Download" },
  DOC: { bg: "#dbeafe", color: "#1e40af", label: "DOC", action: "Download" },
  PPT: { bg: "#ffedd5", color: "#9a3412", label: "PPT", action: "Download" },
  ZIP: { bg: "#f3e8ff", color: "#6d28d9", label: "ZIP", action: "Download" },
  VIDEO: { bg: "#dcfce7", color: "#166534", label: "VIDEO", action: "Watch" },
  YOUTUBE: { bg: "#fee2e2", color: "#dc2626", label: "YT", action: "Watch" },
  LINK: { bg: "#f0f9ff", color: "#0369a1", label: "LINK", action: "Open" },
};

// ── Icons ────────────────────────────────────────────────────────────────────
const DownloadIcon = () => (
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
);

const WatchIcon = () => (
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
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const LinkIcon = () => (
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
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#dc2626">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

function actionIcon(type) {
  if (type === "YOUTUBE" || type === "VIDEO") return <WatchIcon />;
  if (type === "LINK") return <LinkIcon />;
  return <DownloadIcon />;
}

// ── Single resource row ───────────────────────────────────────────────────────
function ResourceRow({ resource }) {
  const cfg = resourceConfig[resource.type] || resourceConfig.LINK;
  const isYT = resource.type === "YOUTUBE";
  const isVideo = resource.type === "VIDEO" || isYT;

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
        e.currentTarget.style.borderColor = isVideo
          ? "#dc2626"
          : "var(--gold-dim)";
        e.currentTarget.style.background = isVideo
          ? "#fff5f5"
          : "var(--gold-pale)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.background = "var(--surface2)";
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: cfg.bg,
          color: cfg.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {isYT ? <YouTubeIcon /> : cfg.label}
      </div>

      {/* Info */}
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
          {resource.name}
        </div>
        {resource.meta && (
          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>
            {resource.meta}
          </div>
        )}
      </div>

      {/* Action button */}
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: "5px 12px",
          border: `1px solid ${isVideo ? "#dc2626" : "#0a1628"}`,
          borderRadius: 6,
          background: "transparent",
          color: isVideo ? "#dc2626" : "var(--heading)",
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
          e.currentTarget.style.background = isVideo ? "#dc2626" : "#0a1628";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = isVideo ? "#dc2626" : "var(--heading)";
        }}
      >
        {actionIcon(resource.type)} {cfg.action}
      </a>
    </div>
  );
}

// ── Default practicals used when no JSON file exists ─────────────────────────
/* const defaultPracticals = [
  {
    num: 1,
    title: "Practical 1: Introduction and Setup",
    desc: "Setting up the environment and understanding the basics",
    resources: [],
  },
  {
    num: 2,
    title: "Practical 2: Core Concepts Implementation",
    desc: "Hands-on experiment with theoretical concepts",
    resources: [],
  },
  {
    num: 3,
    title: "Practical 3: Advanced Applications",
    desc: "Real-world application of subject knowledge",
    resources: [],
  },
  {
    num: 4,
    title: "Practical 4: Analysis and Verification",
    desc: "Verification and result analysis techniques",
    resources: [],
  },
  {
    num: 5,
    title: "Practical 5: Mini Project",
    desc: "Term-end practical assessment project",
    resources: [],
  },
]; */

// ── Main component ────────────────────────────────────────────────────────────
export default function PracticalAccordion({ practicals }) {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ display: "grid", gap: 6 }}>
      {practicals.map((p, i) => {
        const isOpen = open === i;
        const resCount = p.resources?.length || 0;

        return (
          <div
            key={i}
            style={{
              border: "1px solid var(--border)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {/* Trigger row */}
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
              {/* Left: number badge + title */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: isOpen
                      ? "rgba(255,255,255,.18)"
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
                  {p.num}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.title}
                  </div>
                  {p.desc && !isOpen && (
                    <div
                      style={{
                        fontSize: 11,
                        color: isOpen
                          ? "rgba(255,255,255,.55)"
                          : "var(--text-3)",
                        marginTop: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.desc}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: resource count + chevron */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                {resCount > 0 && (
                  <span style={{ fontSize: 11, opacity: 0.75 }}>
                    {resCount} resource{resCount !== 1 ? "s" : ""}
                  </span>
                )}
                {resCount === 0 && (
                  <span style={{ fontSize: 11, opacity: 0.5 }}>
                    No resources yet
                  </span>
                )}
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

            {/* Expanded content */}
            {isOpen && (
              <div
                style={{
                  padding: "12px 14px",
                  background: "var(--surface)",
                  borderTop: "1px solid var(--border)",
                  display: "grid",
                  gap: 8,
                }}
              >
                {/* Description shown when open */}
                {p.desc && (
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-3)",
                      lineHeight: 1.5,
                      paddingBottom: 4,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {p.desc}
                  </p>
                )}

                {/* Resources */}
                {resCount > 0 ? (
                  <div style={{ display: "grid", gap: 6 }}>
                    {p.resources.map((r, j) => (
                      <ResourceRow key={j} resource={r} />
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "10px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: "var(--surface3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-4)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-3)",
                        lineHeight: 1.5,
                      }}
                    >
                      No resources uploaded yet for this practical. Come back
                      soon!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
