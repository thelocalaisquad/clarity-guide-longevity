import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CtaStrip = () => (
  <section className="py-20 lg:py-28">
    <div className="editorial-container">
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        <Link
          to="/technologies"
          className="group rounded-sm border border-border bg-card p-10 lg:p-12 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-foreground/5"
        >
          <div>
            <span className="editorial-label">For Everyone</span>
            <h3 className="mt-4 font-serif text-2xl font-semibold text-foreground">
              Explore Technologies
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Dive into structured overviews of the most relevant longevity
              technologies — for personal use or professional curiosity.
            </p>
          </div>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
            Get started <ArrowRight size={14} />
          </span>
        </Link>

        <Link
          to="/business"
          className="group rounded-sm border border-border bg-card p-10 lg:p-12 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-foreground/5"
        >
          <div>
            <span className="editorial-label">For Operators</span>
            <h3 className="mt-4 font-serif text-2xl font-semibold text-foreground">
              Business &amp; Operations
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Commercial viability, revenue models, and installation guidance for
              gym owners, spa managers, and wellness entrepreneurs.
            </p>
          </div>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
            Explore operations <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </div>
  </section>
);

export default CtaStrip;
