import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { marked } from "marked";
import { useSEO } from "../hooks/useSEO";
import { getPost, formatDate } from "../utils/blogUtils";
import ShareBar from "../components/ShareBar";

// Open relative markdown links as regular SPA navigations; open external links in a new tab.
const renderer = new marked.Renderer();
renderer.link = ({ href, title, text }) => {
  const isExternal = href && (href.startsWith("http://") || href.startsWith("https://"));
  const titleAttr = title ? ` title="${title}"` : "";
  if (isExternal) {
    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
  }
  return `<a href="${href}"${titleAttr}>${text}</a>`;
};
marked.use({ renderer });

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  const html = useMemo(() => (post ? marked.parse(post.content) : ""), [post]);

  useSEO({
    title: post
      ? `${post.title} | SPPUStudyHUB Blog`
      : "Post not found | SPPUStudyHUB",
    description: post?.description ?? "",
    schema: post
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description ?? "",
          datePublished: post.date ?? "",
          author: { "@type": "Organization", name: "SPPUStudyHUB" },
          publisher: { "@type": "Organization", name: "SPPUStudyHUB", url: "https://sppustudyhub.in" },
          url: `https://sppustudyhub.in/blog/${slug}`,
        }
      : undefined,
  });

  if (!post) {
    return (
      <div className="page-wrap" style={{ paddingTop: 60, textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28,
            color: "var(--heading)",
            marginBottom: 12,
          }}
        >
          Post not found
        </h2>
        <Link to="/blog" className="btn btn-primary">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="bc-link">Home</Link>
        <span className="bc-sep">›</span>
        <Link to="/blog" className="bc-link">Blog</Link>
        <span className="bc-sep">›</span>
        <span
          style={{
            color: "var(--text-3)",
            maxWidth: 240,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {post.title}
        </span>
      </div>

      {/* Post header */}
      <div style={{ paddingTop: 12, paddingBottom: 28, borderBottom: "var(--border-w) solid var(--border)", marginBottom: 32 }}>
        <div style={{ fontSize: 12, color: "var(--text-4)", fontWeight: 500, marginBottom: 10 }}>
          {formatDate(post.date)}
        </div>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 32,
            color: "var(--heading)",
            lineHeight: 1.25,
            marginBottom: 14,
          }}
        >
          {post.title}
        </h1>
        {post.description && (
          <p style={{ fontSize: 16, color: "var(--text-3)", lineHeight: 1.65, maxWidth: 640 }}>
            {post.description}
          </p>
        )}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
            {post.tags.map((tag) => (
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
        )}
      </div>

      {/* Post body */}
      <div
        className="blog-prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Share bar */}
      <div
        style={{
          marginTop: 40,
          paddingTop: 24,
          borderTop: "var(--border-w) solid var(--border)",
        }}
      >
        <ShareBar
          title={post.title}
          url={`https://sppustudyhub.in/blog/${slug}`}
        />
      </div>

      {/* Footer nav */}
      <div
        style={{
          marginTop: 24,
          paddingTop: 24,
          borderTop: "var(--border-w) solid var(--border)",
        }}
      >
        <Link
          to="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--gold-dim)",
            textDecoration: "none",
          }}
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}
