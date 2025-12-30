import type { APIRoute } from 'astro'

export const get: APIRoute = async () => {
  const site = 'https://ironfeast.tv';
  const modules = Object.entries(import.meta.glob('./content/blog/*.md', { eager: true }));
  const posts = modules.map(([path, mod]) => {
    const slug = path.split('/').pop().replace('.md', '');
    const fm = (mod.frontmatter ?? {});
    return {
      title: fm.title,
      date: fm.date,
      summary: fm.summary || '',
      url: `${site}/blog/${slug}/`
    };
  }).sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = posts.map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${p.url}</link>
      <guid>${p.url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.summary}]]></description>
    </item>`).join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Ironfeast — Technical Journal</title>
      <link>${site}</link>
      <description>Technical posts from Ironfeast</description>
      ${items}
    </channel>
  </rss>`;

  return new Response(feed, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
