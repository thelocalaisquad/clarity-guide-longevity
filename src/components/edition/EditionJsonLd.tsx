import type { FaqItem } from "./EditionFaq";

interface EditionJsonLdProps {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  canonicalUrl: string;
  imageUrl?: string;
  videoEmbedUrl?: string;
  videoTitle?: string;
  productName?: string;
  productDescription?: string;
  productPriceLow?: string;
  productPriceHigh?: string;
  faqs: FaqItem[];
}

const EditionJsonLd = ({
  title,
  description,
  author,
  datePublished,
  canonicalUrl,
  imageUrl,
  videoEmbedUrl,
  videoTitle,
  productName,
  productDescription,
  productPriceLow,
  productPriceHigh,
  faqs,
}: EditionJsonLdProps) => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: { "@type": "Person", name: author },
    datePublished,
    image: imageUrl || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  const videoSchema = videoEmbedUrl
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: videoTitle || title,
        description,
        embedUrl: videoEmbedUrl,
        uploadDate: datePublished,
        thumbnailUrl: imageUrl || undefined,
      }
    : null;

  const productSchema =
    productName
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: productName,
          description: productDescription || description,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: productPriceLow || "0",
            highPrice: productPriceHigh || "0",
          },
        }
      : null;

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  const schemas = [articleSchema, videoSchema, productSchema, faqSchema].filter(Boolean);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default EditionJsonLd;
