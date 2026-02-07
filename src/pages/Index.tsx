import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-sauna.jpg";
import wellnessImage from "@/assets/editorial-wellness.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";

const technologies = [
  { name: "Infrared Sauna", slug: "infrared-sauna", image: heroImage },
  { name: "Red Light Therapy", slug: "red-light-therapy", image: redlightImage },
  { name: "Hyperbaric Oxygen", slug: "hyperbaric-oxygen-therapy", image: facilityImage },
  { name: "Cryotherapy", slug: "cryotherapy", image: wellnessImage },
  { name: "PEMF Therapy", slug: "pemf-therapy", image: facilityImage },
];

const Index = () => {
  return (
    <Layout>
      {/* Editorial introduction */}
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
                An independent, education-first resource for individuals and operators exploring evidence-informed wellness technologies.
              </p>
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

      {/* Two-column intro with image */}
      <section className="py-20 lg:py-28">
        <div className="editorial-container">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div>
              <span className="editorial-label">What We Cover</span>
              <div className="editorial-divider mt-4" />
              <h2 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-4xl leading-tight">
                What is longevity technology?
              </h2>
              <div className="editorial-prose mt-6 space-y-4">
                <p>
                  Longevity technologies are evidence-informed tools and therapies designed to 
                  support healthspan — the period of life spent in good health.
                </p>
                <p>
                  From infrared saunas and red light therapy to hyperbaric oxygen chambers and PEMF devices, 
                  we evaluate each technology on its own terms — what it does, how it works, 
                  and what the evidence says.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={wellnessImage}
                alt="Wellness lifestyle"
                className="w-full aspect-[4/5] object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who this is for — card modules */}
      <section className="bg-card py-20 lg:py-28">
        <div className="editorial-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="editorial-label">Our Audience</span>
            <div className="editorial-divider mt-4 mx-auto" />
            <h2 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Who this is for
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="rounded-sm border border-border bg-background p-8 lg:p-10">
              <span className="editorial-label text-primary">Individuals</span>
              <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                Personal exploration
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Clear, structured information about technologies you're considering for personal use — 
                without the sales pitch. Understand what works, what doesn't, and what to expect.
              </p>
              <Link to="/technologies" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Browse Technologies <ArrowRight size={14} />
              </Link>
            </div>
            <div className="rounded-sm border border-border bg-background p-8 lg:p-10">
              <span className="editorial-label text-primary">Operators</span>
              <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                Business integration
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Gym owners, spa managers, and wellness entrepreneurs who need to understand commercial 
                viability, installation requirements, and operational considerations.
              </p>
              <Link to="/business" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Explore Operations <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies feature grid */}
      <section className="py-20 lg:py-28">
        <div className="editorial-container">
          <span className="editorial-label">Core Technologies</span>
          <div className="editorial-divider mt-4" />
          <h2 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            What we evaluate
          </h2>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground leading-relaxed">
            Five core longevity technologies, each examined through the same structured format.
          </p>

          {/* Magazine-style asymmetric grid */}
          <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2">
            {/* Large featured card */}
            <Link
              to={`/technologies/${technologies[0].slug}`}
              className="editorial-card md:col-span-2 md:row-span-2 group"
            >
              <div className="relative h-full min-h-[400px]">
                <img src={technologies[0].image} alt={technologies[0].name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <span className="editorial-label text-primary-foreground/70">Featured</span>
                  <h3 className="mt-2 font-serif text-2xl font-semibold text-primary-foreground md:text-3xl">
                    {technologies[0].name}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80">
                    Explore <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>

            {/* Smaller stacked cards */}
            {technologies.slice(1, 3).map((tech) => (
              <Link
                key={tech.slug}
                to={`/technologies/${tech.slug}`}
                className="editorial-card group"
              >
                <div className="relative h-full min-h-[190px]">
                  <img src={tech.image} alt={tech.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
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

          {/* Remaining as text cards */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {technologies.slice(3).map((tech) => (
              <Link
                key={tech.slug}
                to={`/technologies/${tech.slug}`}
                className="group rounded-sm border border-border bg-card p-6 flex items-center justify-between transition-all hover:shadow-lg hover:shadow-foreground/5"
              >
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tech.name}
                  </h3>
                  <span className="mt-1 text-xs text-muted-foreground">Structured technology overview</span>
                </div>
                <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How we evaluate — image + text */}
      <section className="bg-card py-20 lg:py-28">
        <div className="editorial-container">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src={facilityImage}
                alt="Modern wellness facility"
                className="w-full aspect-[4/5] object-cover rounded-sm"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="editorial-label">Our Approach</span>
              <div className="editorial-divider mt-4" />
              <h2 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-4xl leading-tight">
                How we evaluate technologies
              </h2>
              <div className="editorial-prose mt-6 space-y-4">
                <p>
                  Every technology page follows the same structured format: what it is, how it works, 
                  the current state of evidence, practical considerations for individuals, and 
                  operational guidance for commercial settings.
                </p>
                <p>
                  We don't rank technologies or make health claims. We present structured, factual 
                  information so you can make informed decisions.
                </p>
              </div>
              <Link to="/technologies" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                View all technologies <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-20 lg:py-28">
        <div className="editorial-container text-center max-w-2xl mx-auto">
          <span className="editorial-label">Get Started</span>
          <div className="editorial-divider mt-4 mx-auto" />
          <h2 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Start exploring
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Dive into our structured overviews of the most relevant longevity technologies — 
            for personal use or commercial integration.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
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
    </Layout>
  );
};

export default Index;
