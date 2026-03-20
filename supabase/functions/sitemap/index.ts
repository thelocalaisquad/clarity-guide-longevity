import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://longevitychannel1.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Static routes with their change frequencies and priorities
const STATIC_ROUTES: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/products", changefreq: "weekly", priority: "0.9" },
  { path: "/technologies", changefreq: "weekly", priority: "0.9" },
  { path: "/videos", changefreq: "weekly", priority: "0.8" },
  { path: "/business", changefreq: "weekly", priority: "0.9" },
  { path: "/use-at-home", changefreq: "weekly", priority: "0.8" },
];

function urlEntry(loc: string, changefreq: string, priority: string, lastmod?: string): string {
  let xml = `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>`;
  if (lastmod) {
    xml += `\n    <lastmod>${lastmod}</lastmod>`;
  }
  xml += `\n  </url>`;
  return xml;
}

function toDate(d: string): string {
  return d.substring(0, 10);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all dynamic content in parallel
    const [technologies, products, videos, editions, operatorPages, comparisonPages] =
      await Promise.all([
        supabase.from("technologies").select("slug, updated_at").order("name"),
        supabase.from("products").select("slug, updated_at").order("name"),
        supabase.from("videos").select("slug, updated_at").order("created_at", { ascending: false }),
        supabase
          .from("editions")
          .select("slug, updated_at")
          .eq("is_published", true)
          .order("published_date", { ascending: false }),
        supabase.from("operator_pages").select("slug, updated_at").order("title"),
        supabase.from("comparison_pages").select("slug, updated_at").order("title"),
      ]);

    const entries: string[] = [];

    // Static routes
    for (const route of STATIC_ROUTES) {
      entries.push(urlEntry(`${SITE_URL}${route.path}`, route.changefreq, route.priority));
    }

    // Technologies
    for (const t of technologies.data ?? []) {
      entries.push(urlEntry(`${SITE_URL}/technologies/${t.slug}`, "monthly", "0.8", toDate(t.updated_at)));
    }

    // Products
    for (const p of products.data ?? []) {
      entries.push(urlEntry(`${SITE_URL}/products/${p.slug}`, "weekly", "0.8", toDate(p.updated_at)));
    }

    // Videos
    for (const v of videos.data ?? []) {
      entries.push(urlEntry(`${SITE_URL}/videos/${v.slug}`, "monthly", "0.6", toDate(v.updated_at)));
    }

    // Editions
    for (const e of editions.data ?? []) {
      entries.push(urlEntry(`${SITE_URL}/editions/${e.slug}`, "monthly", "0.7", toDate(e.updated_at)));
    }

    // Operator pages
    for (const o of operatorPages.data ?? []) {
      entries.push(urlEntry(`${SITE_URL}/business/${o.slug}`, "monthly", "0.7", toDate(o.updated_at)));
    }

    // Comparison pages
    for (const c of comparisonPages.data ?? []) {
      entries.push(urlEntry(`${SITE_URL}/compare/${c.slug}`, "monthly", "0.7", toDate(c.updated_at)));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Error generating sitemap", { status: 500, headers: corsHeaders });
  }
});
