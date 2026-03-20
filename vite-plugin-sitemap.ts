import type { Plugin } from 'vite';

const SITE_URL = 'https://longevitychannel1.com';

const STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/products', changefreq: 'weekly', priority: '0.9' },
  { path: '/technologies', changefreq: 'weekly', priority: '0.9' },
  { path: '/videos', changefreq: 'weekly', priority: '0.8' },
  { path: '/business', changefreq: 'weekly', priority: '0.9' },
  { path: '/use-at-home', changefreq: 'weekly', priority: '0.8' },
];

function urlEntry(loc: string, changefreq: string, priority: string, lastmod?: string): string {
  let xml = `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>`;
  if (lastmod) xml += `\n    <lastmod>${lastmod}</lastmod>`;
  xml += `\n  </url>`;
  return xml;
}

function toDate(d: string): string {
  return d.substring(0, 10);
}

async function fetchTable(supabaseUrl: string, anonKey: string, table: string, select: string, filters?: string): Promise<any[]> {
  const url = `${supabaseUrl}/rest/v1/${table}?select=${select}${filters ? '&' + filters : ''}`;
  try {
    const res = await fetch(url, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    if (!res.ok) return [];
    return (await res.json()) as any[];
  } catch {
    return [];
  }
}

export function sitemapPlugin(): Plugin {
  return {
    name: 'vite-plugin-sitemap',
    apply: 'build',
    async generateBundle() {
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !anonKey) {
        console.warn('[sitemap] Missing Supabase env vars, using static-only sitemap');
        const entries = STATIC_ROUTES.map(r => urlEntry(`${SITE_URL}${r.path}`, r.changefreq, r.priority));
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`,
        });
        return;
      }

      const [technologies, products, videos, editions, operatorPages, comparisonPages] = await Promise.all([
        fetchTable(supabaseUrl, anonKey, 'technologies', 'slug,updated_at', 'order=name'),
        fetchTable(supabaseUrl, anonKey, 'products', 'slug,updated_at', 'order=name'),
        fetchTable(supabaseUrl, anonKey, 'videos', 'slug,updated_at', 'order=created_at.desc'),
        fetchTable(supabaseUrl, anonKey, 'editions', 'slug,updated_at', 'is_published=eq.true&order=published_date.desc'),
        fetchTable(supabaseUrl, anonKey, 'operator_pages', 'slug,updated_at', 'order=title'),
        fetchTable(supabaseUrl, anonKey, 'comparison_pages', 'slug,updated_at', 'order=title'),
      ]);

      const entries: string[] = [];

      for (const r of STATIC_ROUTES) {
        entries.push(urlEntry(`${SITE_URL}${r.path}`, r.changefreq, r.priority));
      }
      for (const t of technologies) {
        entries.push(urlEntry(`${SITE_URL}/technologies/${t.slug}`, 'monthly', '0.8', toDate(t.updated_at)));
      }
      for (const p of products) {
        entries.push(urlEntry(`${SITE_URL}/products/${p.slug}`, 'weekly', '0.8', toDate(p.updated_at)));
      }
      for (const v of videos) {
        entries.push(urlEntry(`${SITE_URL}/videos/${v.slug}`, 'monthly', '0.6', toDate(v.updated_at)));
      }
      for (const e of editions) {
        entries.push(urlEntry(`${SITE_URL}/editions/${e.slug}`, 'monthly', '0.7', toDate(e.updated_at)));
      }
      for (const o of operatorPages) {
        entries.push(urlEntry(`${SITE_URL}/business/${o.slug}`, 'monthly', '0.7', toDate(o.updated_at)));
      }
      for (const c of comparisonPages) {
        entries.push(urlEntry(`${SITE_URL}/compare/${c.slug}`, 'monthly', '0.7', toDate(c.updated_at)));
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`;

      console.log(`[sitemap] Generated ${entries.length} URLs`);

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: xml,
      });
    },
  };
}
