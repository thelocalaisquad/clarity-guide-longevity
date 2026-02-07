import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-sauna.jpg";

const HeroIntro = () => (
  <section className="pt-16 pb-20 lg:pt-24 lg:pb-28">
    <div className="editorial-container">
      <div className="grid gap-12 lg:grid-cols-[1fr_0.65fr] items-end">
        <div>
          <span className="editorial-label">Longevity Technology</span>
          <div className="editorial-divider mt-4" />
          <h1 className="mt-6 max-w-xl font-serif text-4xl font-semibold leading-[1.15] text-foreground md:text-5xl lg:text-[3.5rem]">
            Understanding longevity technology, clearly.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            An independent, education-first resource for individuals and operators
            exploring evidence-informed wellness technologies.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/technologies"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Browse Technologies <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="hidden lg:block">
          <img
            src={heroImage}
            alt="Modern infrared sauna with warm natural light"
            className="w-full aspect-[3/4] object-cover rounded-sm"
          />
        </div>
      </div>
    </div>
  </section>
);

export default HeroIntro;
