import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import wellnessImage from "@/assets/editorial-wellness.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";

const AudienceCards = () => (
  <section className="bg-card py-20 lg:py-28">
    <div className="editorial-container">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="editorial-label">Our Audience</span>
        <div className="editorial-divider mt-4 mx-auto" />
        <h2 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-4xl">
          Who this is for
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
        {/* Individuals — image-led card */}
        <Link
          to="/technologies"
          className="group editorial-card flex flex-col"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={wellnessImage}
              alt="Personal wellness exploration"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
          <div className="p-8 lg:p-9 flex flex-col flex-1">
            <span className="editorial-label text-primary">Individuals</span>
            <h3 className="mt-3 font-serif text-xl font-semibold text-foreground">
              Personal exploration
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-1">
              Clear, structured information about technologies you're considering —
              without the sales pitch.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
              Browse Technologies <ArrowRight size={14} />
            </span>
          </div>
        </Link>

        {/* Operators — image-led card */}
        <Link
          to="/business"
          className="group editorial-card flex flex-col"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={facilityImage}
              alt="Commercial wellness facility"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
          <div className="p-8 lg:p-9 flex flex-col flex-1">
            <span className="editorial-label text-primary">Operators</span>
            <h3 className="mt-3 font-serif text-xl font-semibold text-foreground">
              Business integration
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-1">
              Commercial viability, installation requirements, and operational
              considerations for facility owners.
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
