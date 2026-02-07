import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CtaStrip = () => (
  <section className="py-16 lg:py-24">
    <div className="editorial-container text-center max-w-2xl mx-auto">
      <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
        START <em className="font-normal">exploring</em>
      </h2>
      <p className="mt-4 text-muted-foreground text-[0.95rem] leading-relaxed">
        Dive into our structured overviews of the most relevant longevity
        technologies — for personal use or commercial integration.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to="/technologies"
          className="inline-flex items-center gap-2 rounded-sm bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Explore Technologies <ArrowRight size={15} />
        </Link>
        <Link
          to="/business"
          className="inline-flex items-center gap-2 rounded-sm border border-border px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          For Operators <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  </section>
);

export default CtaStrip;
