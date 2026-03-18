import { Helmet } from "react-helmet-async";
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

/* ── placeholder data — replace per edition ── */
const edition = {
  number: "001",
  date: "March 16, 2026",
  dateIso: "2026-03-16",
  category: "Recovery",
  title: "The Science Behind Infrared Saunas: What the Evidence Actually Shows",
  metaDescription:
    "A deep dive into the peer-reviewed research on infrared sauna therapy — benefits, risks, and what to look for when buying one for home use.",
  canonicalUrl: "https://clarity-guide-longevity.lovable.app/editions/001",
  author: "Dr. Sarah Mitchell",
  readTime: "8 min",
  videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  videoCaption: "Watch: How infrared wavelengths penetrate tissue and stimulate cellular repair.",
  videoTitle: "Infrared Sauna Science Explained",
  leadSummary: `<strong>Infrared saunas aren't just a wellness trend — they're backed by a growing body of peer-reviewed evidence.</strong> In this edition we break down the mechanisms, review the strongest clinical studies, and tell you exactly what to look for if you're considering one for home use. No hype, just data.`,
  leadSummaryPlain:
    "Infrared saunas aren't just a wellness trend — they're backed by a growing body of peer-reviewed evidence. In this edition we break down the mechanisms, review the strongest clinical studies, and tell you exactly what to look for if you're considering one for home use. No hype, just data.",
  expert: {
    name: "Dr. Sarah Mitchell",
    title: "PhD, Exercise Physiology — Stanford University",
    credential:
      "I've reviewed over 200 studies on heat therapy. The evidence for cardiovascular and recovery benefits is now robust enough to act on.",
    photoUrl: "/placeholder.svg",
    photoAlt: "Photo of Dr. Sarah Mitchell",
  },
  bodyHtml: `
    <h2>How Infrared Differs from Traditional Saunas</h2>
    <p>Traditional Finnish saunas heat the air to 80–100 °C. Infrared panels operate at 45–65 °C but deliver radiant energy that penetrates 3–4 cm below the skin surface. The result is a comparable core-temperature rise at a lower ambient temperature — more tolerable for longer sessions.</p>

    <h2>What the Research Says</h2>
    <p>A 2018 systematic review in <em>Mayo Clinic Proceedings</em> found consistent cardiovascular benefits — reduced blood pressure, improved endothelial function, and lower all-cause mortality in the Finnish cohort studies. More recent RCTs have added evidence for reduced muscle soreness post-exercise and modest improvements in chronic pain conditions.</p>

    <blockquote>"The dose-response relationship is clear: 3–4 sessions per week at 57 °C for 20 minutes produces measurable results within 8 weeks."</blockquote>

    <h2>Key Considerations for Home Use</h2>
    <p>Not all infrared saunas are created equal. Panel coverage, EMF shielding, wood quality, and heater type (carbon vs. ceramic) all matter. We've distilled the decision into the product spotlight below.</p>
  `,
  product: {
    name: "Clearlight Sanctuary™ 2",
    description:
      "Full-spectrum infrared sauna with medical-grade chromotherapy, low-EMF carbon-ceramic heaters, and premium Canadian cedar construction.",
    priceRange: "$5,299 – $6,499",
    imageUrl: "/placeholder.svg",
    imageAlt: "Clearlight Sanctuary 2 infrared sauna",
    ctaUrl: "https://example.com/clearlight-sanctuary-2",
  },
  faqs: [
    {
      question: "Are infrared saunas safe for daily use?",
      answer:
        "For most healthy adults, daily sessions of 15–30 minutes are considered safe. Those with cardiovascular conditions, pregnancy, or heat sensitivity should consult a physician first.",
    },
    {
      question: "How long before I notice health benefits?",
      answer:
        "Cardiovascular improvements have been measured after 8 weeks of regular use (3–4 sessions per week). Subjective recovery and sleep benefits are often reported within the first 2 weeks.",
    },
    {
      question: "What's the difference between near, mid, and far infrared?",
      answer:
        "Near-infrared (700–1400 nm) penetrates deepest and is linked to wound healing and cellular repair. Mid-infrared improves circulation. Far-infrared (5,600–1,000,000 nm) is the primary wavelength in most home saunas and drives the core-temperature rise responsible for cardiovascular benefits.",
    },
  ] as FaqItem[],
  ogImage: "/placeholder.svg",
};

const EditionTemplate = () => (
  <Layout>
    <Helmet>
      <title>{edition.title} | Longevity Channel 1</title>
      <meta name="description" content={edition.metaDescription} />
      <link rel="canonical" href={edition.canonicalUrl} />

      {/* Open Graph — article-specific */}
      <meta property="og:title" content={edition.title} />
      <meta property="og:description" content={edition.metaDescription} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={edition.ogImage} />
      <meta property="og:url" content={edition.canonicalUrl} />
      <meta property="og:site_name" content="Longevity Channel 1" />
      <meta property="article:published_time" content={edition.dateIso} />
      <meta property="article:modified_time" content={edition.dateIso} />
      <meta property="article:author" content={edition.author} />
      <meta property="article:section" content={edition.category} />
      <meta property="article:tag" content={edition.category} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={edition.title} />
      <meta name="twitter:description" content={edition.metaDescription} />
      <meta name="twitter:image" content={edition.ogImage} />

      {/* Robots — ensure AI crawlers can index */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    </Helmet>

    <EditionJsonLd
      title={edition.title}
      description={edition.metaDescription}
      author={edition.author}
      datePublished={edition.dateIso}
      dateModified={edition.dateIso}
      canonicalUrl={edition.canonicalUrl}
      imageUrl={edition.ogImage}
      videoEmbedUrl={edition.videoEmbedUrl}
      videoTitle={edition.videoTitle}
      productName={edition.product.name}
      productDescription={edition.product.description}
      productPriceLow="5299"
      productPriceHigh="6499"
      faqs={edition.faqs}
      editionNumber={edition.number}
      category={edition.category}
      readTime={edition.readTime}
    />

    <article itemScope itemType="https://schema.org/Article">
      {/* Breadcrumb navigation */}
      <EditionBreadcrumb editionNumber={edition.number} title={edition.title} />

      {/* Edition label */}
      <EditionHeader
        editionNumber={edition.number}
        date={edition.date}
        category={edition.category}
      />

      {/* H1 — marked speakable for AI assistants */}
      <div className="editorial-narrow pb-6 text-center">
        <h1
          data-speakable="headline"
          itemProp="headline"
          className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-foreground"
        >
          {edition.title}
        </h1>
      </div>

      {/* Hidden microdata for crawlers */}
      <meta itemProp="datePublished" content={edition.dateIso} />
      <meta itemProp="dateModified" content={edition.dateIso} />
      <meta itemProp="author" content={edition.author} />
      <meta itemProp="image" content={edition.ogImage} />

      {/* Byline */}
      <EditionByline
        author={edition.author}
        date={edition.date}
        dateIso={edition.dateIso}
        readTime={edition.readTime}
      />

      {/* Hero video */}
      <EditionVideo
        embedUrl={edition.videoEmbedUrl}
        caption={edition.videoCaption}
      />

      {/* Lead summary — marked speakable for AI assistants */}
      <div className="editorial-narrow">
        <p
          data-speakable="summary"
          itemProp="description"
          className="editorial-prose text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: edition.leadSummary }}
        />
      </div>

      {/* Expert callout */}
      <EditionExpertCallout
        name={edition.expert.name}
        title={edition.expert.title}
        credential={edition.expert.credential}
        photoUrl={edition.expert.photoUrl}
        photoAlt={edition.expert.photoAlt}
      />

      {/* Body content */}
      <div
        itemProp="articleBody"
        className="editorial-narrow editorial-prose prose prose-headings:font-serif prose-headings:text-foreground prose-blockquote:border-l-foreground prose-blockquote:text-foreground/70 prose-blockquote:italic max-w-none"
        dangerouslySetInnerHTML={{ __html: edition.bodyHtml }}
      />

      {/* Product spotlight */}
      <EditionProductSpotlight
        productName={edition.product.name}
        description={edition.product.description}
        priceRange={edition.product.priceRange}
        imageUrl={edition.product.imageUrl}
        imageAlt={edition.product.imageAlt}
        ctaUrl={edition.product.ctaUrl}
      />

      {/* FAQ */}
      <EditionFaq faqs={edition.faqs} />
    </article>

    {/* Social Content Generator */}
    <EditionSocialGenerator
      title={edition.title}
      summary={edition.leadSummaryPlain}
      category={edition.category}
      expertName={edition.expert.name}
      expertCredential={edition.expert.credential}
      productName={edition.product.name}
      productDescription={edition.product.description}
      canonicalUrl={edition.canonicalUrl}
    />

    {/* Subscribe banner */}
    <EditionSubscribe />
  </Layout>
);

export default EditionTemplate;
