import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="editorial-container max-w-4xl">
          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Understanding longevity technology, clearly.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            An independent, education-first resource for individuals exploring 
            longevity technologies and operators building wellness businesses.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/technologies"
              className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explore Technologies <ArrowRight size={16} />
            </Link>
            <Link
              to="/business"
              className="inline-flex items-center gap-2 rounded border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              For Operators <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* What longevity technology is */}
      <section className="border-t border-border py-16 lg:py-24">
        <div className="editorial-container grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
              What is longevity technology?
            </h2>
            <div className="editorial-prose mt-6">
              <p>
                Longevity technologies are evidence-informed tools and therapies designed to 
                support healthspan — the period of life spent in good health. They range from 
                infrared saunas and red light therapy to hyperbaric oxygen chambers and PEMF devices.
              </p>
              <p className="mt-4">
                This site evaluates each technology on its own terms: what it does, how it works, 
                what the evidence says, and how it's used — both by individuals at home and by 
                operators in commercial wellness settings.
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
              Who this is for
            </h2>
            <div className="editorial-prose mt-6">
              <p>
                <strong className="text-foreground">Individuals</strong> looking for clear, structured 
                information about technologies they're considering for personal use — without the 
                sales pitch.
              </p>
              <p className="mt-4">
                <strong className="text-foreground">Operators</strong> — gym owners, spa managers, 
                wellness entrepreneurs — who need to understand the commercial viability, installation 
                requirements, and operational considerations of these technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How technologies are evaluated */}
      <section className="border-t border-border bg-card py-16 lg:py-24">
        <div className="editorial-container max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            How we evaluate technologies
          </h2>
          <div className="editorial-prose mt-6">
            <p>
              Every technology page follows the same structured format: what it is, how it works, 
              the current state of evidence, practical considerations for individuals, and 
              operational guidance for commercial settings.
            </p>
            <p className="mt-4">
              We don't rank technologies or make health claims. We present structured, factual 
              information so you can make informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Entry points */}
      <section className="border-t border-border py-16 lg:py-24">
        <div className="editorial-container">
          <div className="grid gap-8 md:grid-cols-2">
            <Link
              to="/technologies"
              className="group rounded border border-border p-8 transition-colors hover:border-primary/30 hover:bg-sage-light"
            >
              <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary">
                Technologies
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Infrared saunas, red light therapy, hyperbaric oxygen, cryotherapy, and PEMF — 
                each examined in structured detail.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Browse all <ArrowRight size={14} />
              </span>
            </Link>
            <Link
              to="/business"
              className="group rounded border border-border p-8 transition-colors hover:border-primary/30 hover:bg-sage-light"
            >
              <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary">
                Business &amp; Operations
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Revenue models, installation considerations, facility design, and regulatory 
                guidance for commercial operators.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Explore <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
