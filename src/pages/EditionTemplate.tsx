import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import EditionBreadcrumb from "@/components/edition/EditionBreadcrumb";
import EditionHeader from "@/components/edition/EditionHeader";
import EditionByline from "@/components/edition/EditionByline";
import EditionVideo from "@/components/edition/EditionVideo";
import EditionExpertCallout from "@/components/edition/EditionExpertCallout";
import EditionProductSpotlight from "@/components/edition/EditionProductSpotlight";
import EditionFaq, { type FaqItem } from "@/components/edition/EditionFaq";
import EditionSubscribe from "@/components/edition/EditionSubscribe";
import EditionJsonLd from "@/components/edition/EditionJsonLd";
import EditionSocialGenerator from "@/components/edition/EditionSocialGenerator";
import NotFound from "./NotFound";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const EditionTemplate = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: edition, isLoading, error } = useQuery({
    queryKey: ["edition", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editions")
        .select("*")
        .eq("slug", slug!)
        .eq("is_published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="editorial-narrow py-24 text-center text-muted-foreground">Loading edition…</div>
      </Layout>
    );
  }

  if (error || !edition) return <NotFound />;

  const faqs: FaqItem[] = Array.isArray(edition.faqs)
    ? (edition.faqs as unknown as FaqItem[])
    : [];
  const dateFormatted = formatDate(edition.published_date);
  const dateIso = edition.published_date;
  const canonicalUrl = edition.canonical_url || `https://clarity-guide-longevity.lovable.app/editions/${edition.slug}`;
  const ogImage = edition.og_image || "/placeholder.svg";

  // Extract price numbers for JSON-LD
  const priceMatch = edition.product_price_range?.match(/[\d,]+/g);
  const priceLow = priceMatch?.[0]?.replace(/,/g, "") || "";
  const priceHigh = priceMatch?.[1]?.replace(/,/g, "") || priceLow;

  return (
    <Layout>
      <Helmet>
        <title>{edition.title} | Longevity Channel 1</title>
        <meta name="description" content={edition.meta_description || ""} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={edition.title} />
        <meta property="og:description" content={edition.meta_description || ""} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Longevity Channel 1" />
        <meta property="article:published_time" content={dateIso} />
        <meta property="article:modified_time" content={dateIso} />
        <meta property="article:author" content={edition.author} />
        <meta property="article:section" content={edition.category} />
        <meta property="article:tag" content={edition.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={edition.title} />
        <meta name="twitter:description" content={edition.meta_description || ""} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      </Helmet>

      <EditionJsonLd
        title={edition.title}
        description={edition.meta_description || ""}
        author={edition.author}
        datePublished={dateIso}
        dateModified={dateIso}
        canonicalUrl={canonicalUrl}
        imageUrl={ogImage}
        videoEmbedUrl={edition.video_embed_url || ""}
        videoTitle={edition.video_title || ""}
        productName={edition.product_name || ""}
        productDescription={edition.product_description || ""}
        productPriceLow={priceLow}
        productPriceHigh={priceHigh}
        faqs={faqs}
        editionNumber={edition.edition_number}
        category={edition.category}
        readTime={edition.read_time}
      />

      <article itemScope itemType="https://schema.org/Article">
        <EditionBreadcrumb editionNumber={edition.edition_number} title={edition.title} />
        <EditionHeader editionNumber={edition.edition_number} date={dateFormatted} category={edition.category} />

        <div className="editorial-narrow pb-6 text-center">
          <h1 data-speakable="headline" itemProp="headline" className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-foreground">
            {edition.title}
          </h1>
        </div>

        <meta itemProp="datePublished" content={dateIso} />
        <meta itemProp="dateModified" content={dateIso} />
        <meta itemProp="author" content={edition.author} />
        <meta itemProp="image" content={ogImage} />

        <EditionByline author={edition.author} date={dateFormatted} dateIso={dateIso} readTime={edition.read_time} />

        {edition.video_embed_url && (
          <EditionVideo embedUrl={edition.video_embed_url} caption={edition.video_caption || ""} />
        )}

        {edition.lead_summary && (
          <div className="editorial-narrow">
            <p data-speakable="summary" itemProp="description" className="editorial-prose text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: edition.lead_summary }} />
          </div>
        )}

        {edition.expert_name && (
          <EditionExpertCallout
            name={edition.expert_name}
            title={edition.expert_title || ""}
            credential={edition.expert_credential || ""}
            photoUrl={edition.expert_photo_url || "/placeholder.svg"}
            photoAlt={`Photo of ${edition.expert_name}`}
          />
        )}

        {edition.body_html && (
          <div itemProp="articleBody" className="editorial-narrow editorial-prose prose prose-headings:font-serif prose-headings:text-foreground prose-blockquote:border-l-foreground prose-blockquote:text-foreground/70 prose-blockquote:italic max-w-none" dangerouslySetInnerHTML={{ __html: edition.body_html }} />
        )}

        {edition.product_name && (
          <EditionProductSpotlight
            productName={edition.product_name}
            description={edition.product_description || ""}
            priceRange={edition.product_price_range || ""}
            imageUrl={edition.product_image_url || "/placeholder.svg"}
            imageAlt={edition.product_image_alt || edition.product_name}
            ctaUrl={edition.product_cta_url || "#"}
          />
        )}

        {faqs.length > 0 && <EditionFaq faqs={faqs} />}
      </article>

      <EditionSocialGenerator
        title={edition.title}
        summary={edition.lead_summary_plain || ""}
        category={edition.category}
        expertName={edition.expert_name || ""}
        expertCredential={edition.expert_credential || ""}
        productName={edition.product_name || ""}
        productDescription={edition.product_description || ""}
        canonicalUrl={canonicalUrl}
      />

      <EditionSubscribe />
    </Layout>
  );
};

export default EditionTemplate;
