const rawFiles = import.meta.glob('../data/blog/*.md', { query: '?raw', import: 'default', eager: true });

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw.trim() };

  const meta = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    if (!key) continue;
    let value = line.slice(colonIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    }
    meta[key] = value;
  }

  return { meta, content: match[2].trim() };
}

export const allPosts = Object.entries(rawFiles)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace('.md', '');
    const { meta, content } = parseFrontmatter(raw);
    return { slug, content, ...meta };
  })
  .filter(p => p.title)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export function getPost(slug) {
  return allPosts.find(p => p.slug === slug) ?? null;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}
