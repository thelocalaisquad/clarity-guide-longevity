import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-sauna.jpg";

const links = [
  { label: "Technology Guides", to: "/technologies", desc: "Evidence-based overviews" },
  { label: "Product Reviews", to: "/products", desc: "Specs, comparisons & picks" },
  { label: "For Operators", to: "/business", desc: "Commercial integration" },
  { label: "Video Library", to: "/videos", desc: "Visual deep-dives" },
];

const CtaStrip = () => (
  <section className="py-16 lg:py-24">
    <div className="editorial-container">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
        {/* Left image */}
        <div className="relative overflow-hidden rounded-sm aspect-[4/5]">
          <img
            src={heroImage}
            alt="Longevity wellness"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Right content */}
        <div className="flex flex-col justify-center">
          <span className="editorial-label text-primary">Explore</span>
          <h2 className="mt-3 font-serif text-2xl font-semibold text-foreground md:text-3xl leading-tight">
            YOUR <em className="font-normal">starting point</em>
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground max-w-md">
            Whether you're exploring longevity tech for personal use or building
            a wellness business — start here.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group flex items-center justify-between rounded-sm border border-border p-4 hover:bg-accent transition-colors"
              >
                <div>
                  <h4 className="font-serif text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {l.label}
                  </h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">{l.desc}</p>
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CtaStrip;
