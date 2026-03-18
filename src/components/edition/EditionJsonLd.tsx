import type { FaqItem } from "./EditionFaq";

interface EditionJsonLdProps {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  canonicalUrl: string;
  imageUrl?: string;
  videoEmbedUrl?: string;
  videoTitle?: string;
  productName?: string;
  productDescription?: string;
  productPriceLow?: string;
  productPriceHigh?: string;
  faqs: FaqItem[];
  editionNumber?: string;
  category?: string;
  readTime?: string;
}

const SITE_NAME = "Longevity Channel 1";
const SITE_URL = "https://clarity-guide-longevity.lovable.app";
const PUBLISHER_LOGO = `${SITE_URL}/favicon.ico`;

const EditionJsonLd = ({
  title,
  description,
  author,
  datePublished,
  dateModified,
  canonicalUrl,
  imageUrl,
  videoEmbedUrl,
  videoTitle,
  productName,
  productDescription,
  productPriceLow,
  productPriceHigh,
  faqs,
  editionNumber,
  category,
  readTime,
}: EditionJsonLdProps) => {
  /* ── Build a single @graph for all entities ── */
  const graph: Record<string, unknown>[] = [];

  /* 1. WebSite — tells AI crawlers about the site itself */
  graph.push({
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
  });

  /* 2. Organization / Publisher */
  graph.push({
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: PUBLISHER_LOGO,
    },
  });

  /* 3. WebPage */
  graph.push({
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    datePublished,
    dateModified: dateModified || datePublished,
    inLanguage: "en-US",
    breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
  });

  /* 4. BreadcrumbList */
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Editions", url: `${SITE_URL}/editions` },
    ...(editionNumber ? [{ name: `Edition #${editionNumber}`, url: canonicalUrl }] : [{ name: title, url: canonicalUrl }]),
  ];
  graph.push({
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  });

  /* 5. Article — the core content entity */
  const wordCount = readTime ? parseInt(readTime) * 250 : undefined;
  graph.push({
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    isPartOf: { "@id": `${canonicalUrl}#webpage` },
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: { "@id": `${canonicalUrl}#webpage` },
    image: imageUrl || undefined,
    ...(category ? { articleSection: category } : {}),
    ...(wordCount ? { wordCount } : {}),
    inLanguage: "en-US",
    /* Speakable — tells AI assistants which parts to read aloud */
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable='headline']", "[data-speakable='summary']"],
    },
  });

  /* 6. VideoObject */
  if (videoEmbedUrl) {
    graph.push({
      "@type": "VideoObject",
      "@id": `${canonicalUrl}#video`,
      name: videoTitle || title,
      description,
      embedUrl: videoEmbedUrl,
      uploadDate: datePublished,
      thumbnailUrl: imageUrl || undefined,
      publisher: { "@id": `${SITE_URL}/#organization` },
    });
  }

  /* 7. Product with Review snippet readiness */
  if (productName) {
    graph.push({
      "@type": "Product",
      "@id": `${canonicalUrl}#product`,
      name: productName,
      description: productDescription || description,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: productPriceLow || "0",
        highPrice: productPriceHigh || "0",
        availability: "https://schema.org/InStock",
      },
    });
  }

  /* 8. FAQPage */
  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default EditionJsonLd;
