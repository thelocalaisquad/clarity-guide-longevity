import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import wellnessImage from "@/assets/editorial-wellness.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";

const AudienceCards = () => (
  <section className="py-16 lg:py-24 bg-card border-b border-border">
    <div className="editorial-container">
      <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl text-center mb-12">
        WHO <em className="font-normal">this is for</em>
      </h2>

      <div className="grid gap-5 md:grid-cols-2 max-w-5xl mx-auto">
        {/* Individuals */}
        <Link to="/technologies" className="group editorial-card flex flex-col">
          <div className="relative h-56 overflow-hidden">
            <img
              src={wellnessImage}
              alt="Personal wellness"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-600 group-hover:scale-[1.03]"
            />
          </div>
          <div className="p-7 lg:p-8">
            <span className="editorial-label text-primary">Individuals</span>
            <h3 className="mt-2 font-serif text-xl font-semibold text-foreground leading-snug">
              Personal Exploration
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Clear, structured information about technologies you're considering
              — without the sales pitch. Understand what works, what doesn't,
              and what to expect.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
              Browse Technologies <ArrowRight size={14} />
            </span>
          </div>
        </Link>

        {/* Operators */}
        <Link to="/business" className="group editorial-card flex flex-col">
          <div className="relative h-56 overflow-hidden">
            <img
              src={facilityImage}
              alt="Commercial facility"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-600 group-hover:scale-[1.03]"
            />
          </div>
          <div className="p-7 lg:p-8">
            <span className="editorial-label text-primary">Operators</span>
            <h3 className="mt-2 font-serif text-xl font-semibold text-foreground leading-snug">
              Business Integration
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Commercial viability, installation requirements, and operational
              considerations for gym owners, spa managers, and wellness
              entrepreneurs.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
              Explore Operations <ArrowRight size={14} />
            </span>
          </div>
        </Link>
      </div>
    </div>
  </section>
);

export default AudienceCards;
