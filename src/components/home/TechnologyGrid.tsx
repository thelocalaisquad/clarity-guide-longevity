import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import heroImage from "@/assets/hero-sauna.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";
import wellnessImage from "@/assets/editorial-wellness.jpg";

const technologies = [
  { name: "Infrared Sauna", slug: "infrared-sauna", image: heroImage, category: "Heat Therapy" },
  { name: "Red Light Therapy", slug: "red-light-therapy", image: redlightImage, category: "Photobiomodulation" },
  { name: "Hyperbaric Oxygen", slug: "hyperbaric-oxygen-therapy", image: facilityImage, category: "Oxygen Therapy" },
  { name: "Cryotherapy", slug: "cryotherapy", image: wellnessImage, category: "Cold Exposure" },
  { name: "PEMF Therapy", slug: "pemf-therapy", image: facilityImage, category: "Electromagnetic" },
  { name: "IV Therapy", slug: "iv-therapy", image: wellnessImage, category: "Nutrient Delivery" },
];

const TechnologyGrid = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-16 lg:py-24 border-b border-border">
      <div className="editorial-container">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            LONGEVITY <em className="font-normal">technologies</em>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 flex items-center justify-center border border-border rounded-sm hover:bg-accent transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 flex items-center justify-center border border-border rounded-sm hover:bg-accent transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {technologies.map((tech) => (
              <Link
                key={tech.slug}
                to={`/technologies/${tech.slug}`}
                className="group block flex-[0_0_45%] min-w-0 md:flex-[0_0_22%]"
              >
                <div className="relative overflow-hidden rounded-sm aspect-[3/4]">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-600 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="mt-3">
                  <span className="editorial-label text-[0.6rem] text-muted-foreground/70">
                    {tech.category}
                  </span>
                  <h3 className="mt-0.5 font-serif text-sm font-semibold text-foreground group-hover:text-primary transition-colors md:text-base">
                    {tech.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyGrid;
