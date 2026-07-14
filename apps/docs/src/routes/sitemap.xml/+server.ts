import { slugFromPath } from '$lib/nav';

export const prerender = true;

const modules = import.meta.glob('/content/*.md');

export function GET() {
  const slugs = Object.keys(modules).map((p) => slugFromPath(p));
  const urls = ['https://docs.rookide.com/', ...slugs.map((s) => `https://docs.rookide.com/${s}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
