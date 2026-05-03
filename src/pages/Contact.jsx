import { useSEO } from "../hooks/useSEO";

export default function Contact() {
  useSEO({
    title: "Contact Us | SPPUStudyHUB",
    description:
      "Contact SPPUStudyHUB — report broken links, request materials, or send feedback.",
  });

  return (
    <div className="page-wrap">
      <div className="subject-header" style={{ paddingTop: 28 }}>
        <h1>Contact Us</h1>
        <p style={{ color: "var(--text-3)", fontSize: 14, marginTop: 6 }}>
          Get in touch with the SPPUStudyHUB team
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 22,
          marginBottom: 40,
        }}
        className="contact-grid"
      >
        {/* LEFT SIDE (Replaced form with email) */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 28,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 40,
              color: "var(--heading)",
              marginBottom: 20,
            }}
          >
            Contact us on
          </h2>

          <p
            style={{
              fontSize: 15,
              color: "var(--text-3)",
              lineHeight: 1.6,
            }}
          >
            contact.sppustudyhub@gmail.com
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          {[
            {
              title: "Report a broken link",
              text: "If a download link is not working, tell us the subject name and the broken link. We fix them within 24 hours.",
            },
            {
              title: "Request missing materials",
              text: "Do not see notes for your subject? Submit a request and we will try to add them. You can also contribute your own notes.",
            },
            {
              title: "Response time",
              text: "We respond to messages within 2 to 3 working days. Contribution submissions are reviewed within a week.",
            },
          ].map((c) => (
            <div
              key={c.title}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--heading)",
                  marginBottom: 6,
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-3)",
                  lineHeight: 1.6,
                }}
              >
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`@media(max-width:640px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
