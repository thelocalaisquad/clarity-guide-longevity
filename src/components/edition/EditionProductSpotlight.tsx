import { ArrowRight } from "lucide-react";

interface EditionProductSpotlightProps {
  productName: string;
  description: string;
  priceRange: string;
  imageUrl?: string;
  imageAlt?: string;
  ctaUrl: string;
}

const EditionProductSpotlight = ({
  productName,
  description,
  priceRange,
  imageUrl,
  imageAlt,
  ctaUrl,
}: EditionProductSpotlightProps) => (
  <div className="editorial-narrow my-12">
    <div className="editorial-card flex flex-col md:flex-row overflow-hidden">
      {imageUrl && (
        <div className="md:w-2/5 shrink-0">
          <img
            src={imageUrl}
            alt={imageAlt || productName}
            className="w-full h-56 md:h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 md:p-8 flex flex-col justify-center">
        <p className="editorial-label mb-2">Featured Product</p>
        <h3 className="font-serif text-xl font-semibold text-foreground">{productName}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <p className="mt-3 text-sm font-semibold text-foreground">{priceRange}</p>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 h-10 px-6 bg-foreground text-background text-xs font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-foreground/90 transition-colors w-fit"
        >
          Learn More <ArrowRight size={12} />
        </a>
      </div>
    </div>
  </div>
);

export default EditionProductSpotlight;
