import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import EditionSubscribe from "@/components/edition/EditionSubscribe";
import HeroIntro from "@/components/home/HeroIntro";

const SITE_URL = "https://clarity-guide-longevity.lovable.app";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Longevity Channel 1",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  description:
    "Evidence-based longevity science. Expert-reviewed guides on infrared saunas, red light therapy, cold plunge, and more.",
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Longevity Channel 1",
  url: SITE_URL,
  description:
    "Advanced longevity technology and wellness devices for home use and business operators.",
};

const Index = () => {
  const { data: editions, isLoading } = useQuery({
    queryKey: ["editions-feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editions")
        .select("id, title, slug, category, published_date, author, read_time, meta_description, lead_summary_plain, og_image, edition_number")
        .eq("is_published", true)
        .order("published_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const latest = editions?.[0];
  const older = editions?.slice(1) ?? [];

  return (
    <Layout>
      <Helmet>
        <title>Longevity Channel 1 — Advanced Longevity Technology & Wellness Devices</title>
        <meta name="description" content="Shop and explore advanced longevity technology and wellness devices — infrared saunas, red light therapy, hyperbaric chambers, cryotherapy and more for home and business." />
        <link rel="canonical" href={SITE_URL} />
      </Helmet>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <HeroIntro />

      {isLoading && (
        <div className="editorial-narrow py-24 text-center text-muted-foreground">
          Loading editions…
        </div>
      )}

      {/* Latest edition — hero feature */}
      {latest && (
        <section className="editorial-wide py-12 md:py-16">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-8">
            Latest Edition
          </h2>
          <Link to={`/editions/${latest.slug}`} className="group block">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {latest.og_image && latest.og_image !== "/placeholder.svg" ? (
                <div className="aspect-video overflow-hidden rounded-sm bg-muted">
                  <img
                    src={latest.og_image}
                    alt={`${latest.title} — ${latest.category} edition`}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-sm bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Edition #{latest.edition_number}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <span>Latest Edition</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{latest.category}</span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-foreground group-hover:text-foreground/80 transition-colors">
                  {latest.title}
                </h3>

                {latest.lead_summary_plain && (
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {latest.lead_summary_plain}
                  </p>
                )}

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{latest.author}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{formatDate(latest.published_date)}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{latest.read_time} read</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Divider */}
      {older.length > 0 && <div className="editorial-wide h-px bg-border" />}

      {/* Older editions grid */}
      {older.length > 0 && (
        <section className="editorial-wide py-12 md:py-16">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-8">
            Previous Editions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {older.map((edition) => (
              <Link
                key={edition.id}
                to={`/editions/${edition.slug}`}
                className="group block space-y-3"
              >
                {edition.og_image && edition.og_image !== "/placeholder.svg" ? (
                  <div className="aspect-video overflow-hidden rounded-sm bg-muted">
                    <img
                      src={edition.og_image}
                      alt={`${edition.title} — ${edition.category} newsletter`}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-sm bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">#{edition.edition_number}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <span>{edition.category}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{formatDate(edition.published_date)}</span>
                </div>

                <h3 className="font-serif text-lg font-semibold leading-snug text-foreground group-hover:text-foreground/80 transition-colors">
                  {edition.title}
                </h3>

                {edition.lead_summary_plain && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {edition.lead_summary_plain}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  {edition.author} · {edition.read_time} read
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!isLoading && (!editions || editions.length === 0) && (
        <div className="editorial-narrow py-24 text-center">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">Coming Soon</h2>
          <p className="text-muted-foreground">Our first edition is on the way. Subscribe to be notified.</p>
        </div>
      )}

      <EditionSubscribe />
    </Layout>
  );
};

export default Index;
