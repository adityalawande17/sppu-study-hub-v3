export default function PageLoader({ label = "Loading…" }) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
      }}
    >
      <div className="spinner" />
      <p style={{ color: "var(--text-3)", fontSize: 13 }}>{label}</p>
    </div>
  );
}
