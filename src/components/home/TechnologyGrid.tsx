import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-sauna.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";
import wellnessImage from "@/assets/editorial-wellness.jpg";

const technologies = [
  { name: "Infrared Sauna", slug: "infrared-sauna", image: heroImage },
  { name: "Red Light Therapy", slug: "red-light-therapy", image: redlightImage },
  { name: "Hyperbaric Oxygen", slug: "hyperbaric-oxygen-therapy", image: facilityImage },
  { name: "Cryotherapy", slug: "cryotherapy", image: wellnessImage },
  { name: "PEMF Therapy", slug: "pemf-therapy", image: facilityImage },
];

const TechnologyGrid = () => (
  <section className="py-20 lg:py-28">
    <div className="editorial-container">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <span className="editorial-label">Core Technologies</span>
          <div className="editorial-divider mt-4" />
          <h2 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            What we evaluate
          </h2>
        </div>
        <Link
          to="/technologies"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {/* 3-column image grid — first item spans 2 rows */}
      <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
        <Link
          to={`/technologies/${technologies[0].slug}`}
          className="editorial-card md:col-span-1 md:row-span-2 group"
        >
          <div className="relative h-full min-h-[420px]">
            <img
              src={technologies[0].image}
              alt={technologies[0].name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <span className="editorial-label text-primary-foreground/70">Featured</span>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-primary-foreground">
                {technologies[0].name}
              </h3>
              <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80">
                Explore <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </Link>

        {/* 4 smaller cards fill the remaining 2×2 */}
        {technologies.slice(1).map((tech) => (
          <Link
            key={tech.slug}
            to={`/technologies/${tech.slug}`}
            className="editorial-card group"
          >
            <div className="relative h-full min-h-[200px]">
              <img
                src={tech.image}
                alt={tech.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-serif text-lg font-semibold text-primary-foreground">
                  {tech.name}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary-foreground/70">
                  Explore <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default TechnologyGrid;
