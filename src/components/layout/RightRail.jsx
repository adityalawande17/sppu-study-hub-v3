import { Link } from "react-router-dom";
import { newsItems, categoryLabels } from "../../data/news";

function NewsRow({ item }) {
  const cat = categoryLabels[item.category];
  const body = (
    <>
      {cat && <span className={`badge ${cat.badge}`}>{cat.label}</span>}
      <span className="shell-news-title">{item.title}</span>
    </>
  );

  if (!item.link) return <div className="shell-news">{body}</div>;

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="shell-news"
    >
      {body}
    </a>
  );
}

export default function RightRail() {
  const latest = newsItems.slice(0, 3);

  return (
    <aside className="shell-rail" aria-label="Updates and promotions">
      <div className="shell-card">
        <h4 className="shell-card-title">Latest updates</h4>
        {latest.map((item) => (
          <NewsRow key={item.id} item={item} />
        ))}
        <Link to="/news" className="shell-more">
          All updates →
        </Link>
      </div>

      <div className="ad-slot shell-ad">
        <p className="ad-label">Advertisement</p>
      </div>
    </aside>
  );
}
