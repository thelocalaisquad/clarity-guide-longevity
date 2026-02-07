import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-sauna.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";
import wellnessImage from "@/assets/editorial-wellness.jpg";

const technologies = [
  { name: "Infrared Sauna", slug: "infrared-sauna", image: heroImage, desc: "Heat, light & recovery" },
  { name: "Red Light Therapy", slug: "red-light-therapy", image: redlightImage, desc: "Photobiomodulation" },
  { name: "Hyperbaric Oxygen", slug: "hyperbaric-oxygen-therapy", image: facilityImage, desc: "Pressurised healing" },
  { name: "Cryotherapy", slug: "cryotherapy", image: wellnessImage, desc: "Cold exposure therapy" },
  { name: "PEMF Therapy", slug: "pemf-therapy", image: facilityImage, desc: "Electromagnetic fields" },
];

const TechnologyGrid = () => (
  <section className="py-16 lg:py-24 border-b border-border">
    <div className="editorial-container">
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          THE <em className="font-normal">technologies</em>
        </h2>
        <Link
          to="/technologies"
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {/* 5-column image grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {technologies.map((tech) => (
          <Link
            key={tech.slug}
            to={`/technologies/${tech.slug}`}
            className="group block"
          >
            <div className="relative overflow-hidden rounded-sm aspect-[3/4]">
              <img
                src={tech.image}
                alt={tech.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-600 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="mt-3">
              <span className="editorial-label text-[0.6rem] text-muted-foreground/70">{tech.desc}</span>
              <h3 className="mt-0.5 font-serif text-sm font-semibold text-foreground group-hover:text-primary transition-colors md:text-base">
                {tech.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to="/technologies"
        className="mt-8 md:hidden inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        View all technologies <ArrowRight size={14} />
      </Link>
    </div>
  </section>
);

export default TechnologyGrid;
