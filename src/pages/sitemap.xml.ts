import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

// All static pages (excluding 404, sitemap, keystatic admin)
const staticPages = [
  '/',
  '/blog/',
  '/arbeit/',
  '/arbeit/build-jetzt/',
  '/arbeit/lernen-diy/',
  '/arbeit/ai-design-guide/',
  '/beratung/',
  '/speaking/',
  '/manifest/',
  '/contact/',
  '/datenschutz/',
  '/impressum/',
];

const SITE = 'https://loschke.ai';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  const blogUrls = posts.map(
    (post) => `  <url>
    <loc>${SITE}/blog/${post.slug}/</loc>${post.data.pubDate ? `\n    <lastmod>${post.data.pubDate.toISOString().split('T')[0]}</lastmod>` : ''}
  </url>`
  );

  const staticUrls = staticPages.map(
    (page) => `  <url>
    <loc>${SITE}${page}</loc>
  </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join('\n')}
${blogUrls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
