const ICONS = {
  cs: (
    <>
      <path d="M16 18l6-6-6-6" />
      <path d="M8 6l-6 6 6 6" />
    </>
  ),
  it: (
    <>
      <rect x="9" y="2.5" width="6" height="5" rx="1" />
      <rect x="2.5" y="16.5" width="6" height="5" rx="1" />
      <rect x="15.5" y="16.5" width="6" height="5" rx="1" />
      <path d="M12 7.5v4M5.5 16.5v-2.5h13v2.5M12 11.5v2.5" />
    </>
  ),
  aids: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9.5 2.5v3.5M14.5 2.5v3.5M9.5 18v3.5M14.5 18v3.5M2.5 9.5h3.5M2.5 14.5h3.5M18 9.5h3.5M18 14.5h3.5" />
      <path d="M10 14.5l2-5 2 5M10.6 13h2.8" />
    </>
  ),
  me: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
    </>
  ),
  ce: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V10M9.5 21V10M14.5 21V10M19 21V10" />
      <path d="M3 10l9-6.5 9 6.5" />
    </>
  ),
  ee: <path d="M13 2.5L4 13.5h7l-1 8 9-11h-7l1-8z" />,
  etc: (
    <>
      <circle cx="12" cy="17" r="1.8" />
      <path d="M8.2 13.2a5.4 5.4 0 0 1 7.6 0" />
      <path d="M4.6 9.6a10.6 10.6 0 0 1 14.8 0" />
    </>
  ),
  aiml: (
    <>
      <path d="M12 3.5a3.5 3.5 0 0 0-3.5 3.5v.5a3 3 0 0 0-2 5.5 3.5 3.5 0 0 0 5.5 3.6V3.5z" />
      <path d="M12 3.5a3.5 3.5 0 0 1 3.5 3.5v.5a3 3 0 0 1 2 5.5 3.5 3.5 0 0 1-5.5 3.6" />
    </>
  ),
};

export default function BranchLogo({ branch, size = 46 }) {
  const icon = ICONS[branch.key];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: branch.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon ? (
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {icon}
        </svg>
      ) : (
        <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{branch.abbr}</span>
      )}
    </div>
  );
}
