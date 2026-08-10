import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { allPosts, formatDate } from "../utils/blogUtils";

export default function Blog() {
  useSEO({
    title: "Blog — SPPU Study Tips, Pattern Updates & Guides | SPPUStudyHUB",
    description:
      "Study tips, SPPU curriculum updates, and branch guides for engineering students. Learn how to prepare for exams, understand the 2024 pattern, and more.",
    schema: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "SPPUStudyHUB Blog",
      description: "Study tips and guides for SPPU engineering students",
      url: "https://sppustudyhub.in/blog",
    },
  });

  return (
    <div className="page-wrap">
      <div className="section-header" style={{ borderTop: "none", paddingTop: 28 }}>
        <h1 className="section-title">Blog</h1>
        <span className="section-sub">
          Study tips, SPPU updates, and guides for engineering students
        </span>
      </div>

      {allPosts.length === 0 ? (
        <p style={{ color: "var(--text-3)", textAlign: "center", padding: "60px 0" }}>
          No posts yet — check back soon.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 16, maxWidth: 760 }}>
          {allPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              style={{ textDecoration: "none" }}
            >
              <article
                style={{
                  background: "var(--surface)",
                  border: "var(--border-w) solid var(--border)",
                  borderRadius: 14,
                  padding: "22px 24px",
                  transition: "box-shadow .18s, transform .18s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "";
                  e.currentTarget.style.transform = "";
                }}
              >
                {/* Date */}
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-4)",
                    marginBottom: 8,
                    fontWeight: 500,
                  }}
                >
                  {formatDate(post.date)}
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 20,
                    color: "var(--heading)",
                    marginBottom: 8,
                    lineHeight: 1.35,
                  }}
                >
                  {post.title}
                </h2>

                {/* Description */}
                {post.description && (
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--text-3)",
                      lineHeight: 1.65,
                      marginBottom: 14,
                    }}
                  >
                    {post.description}
                  </p>
                )}

                {/* Tags + Read More */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(Array.isArray(post.tags) ? post.tags : []).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--gold-dim)",
                          background: "var(--gold-pale)",
                          border: "1px solid var(--gold-dim)",
                          padding: "2px 8px",
                          borderRadius: 20,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--gold-dim)",
                    }}
                  >
                    Read →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
