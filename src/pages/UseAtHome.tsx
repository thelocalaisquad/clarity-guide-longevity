import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ExpertDialog from "@/components/layout/ExpertDialog";
import heroImage from "@/assets/hero-sauna.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";
import wellnessImage from "@/assets/editorial-wellness.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";

const technologies = [
  {
    name: "Infrared Sauna",
    slug: "infrared-sauna",
    image: heroImage,
    tagline: "Deep heat therapy for recovery, detox, and daily ritual.",
  },
  {
    name: "Red Light Therapy",
    slug: "red-light-therapy",
    image: redlightImage,
    tagline: "Targeted photobiomodulation for skin, joints, and cellular health.",
  },
  {
    name: "Cryotherapy",
    slug: "cryotherapy",
    image: wellnessImage,
    tagline: "Cold exposure systems engineered for home recovery routines.",
  },
  {
    name: "Hyperbaric Oxygen",
    slug: "hyperbaric-oxygen-therapy",
    image: facilityImage,
    tagline: "Pressurised oxygen chambers now available for residential use.",
  },
  {
    name: "PEMF Therapy",
    slug: "pemf-therapy",
    image: facilityImage,
    tagline: "Pulsed electromagnetic field devices for pain and regeneration.",
  },
];

const UseAtHome = () => {
  const [expertOpen, setExpertOpen] = useState(false);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Home longevity setup with infrared sauna"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-foreground/20" />
        </div>
        <div className="relative editorial-container py-28 lg:py-40">
          <span
            className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-background/60"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          >
            For Individuals
          </span>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.15] text-background md:text-5xl lg:text-6xl max-w-3xl">
            Build Your Personal{" "}
            <em className="font-normal">Longevity Environment</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-background/70 md:text-lg">
            From infrared saunas to red light panels — independent evaluations of
            the technology transforming home health and recovery.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setExpertOpen(true)}
              className="inline-flex items-center justify-center h-12 px-8 bg-background text-foreground text-sm font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-background/90 transition-colors"
            >
              Talk to an Expert
            </button>
            <a
              href="#technologies"
              className="inline-flex items-center justify-center h-12 px-8 border border-background/40 text-background text-sm font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-background/10 transition-colors"
            >
              Explore Technologies
            </a>
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section className="py-16 lg:py-24 border-b border-border">
        <div className="editorial-container">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                title: "Independent Reviews",
                description:
                  "No affiliate bias. Every product evaluation is descriptive, technical, and editorially independent.",
              },
              {
                title: "Installation Guidance",
                description:
                  "Space requirements, electrical needs, ventilation — everything you need before you buy.",
              },
              {
                title: "Expert Access",
                description:
                  "Connect directly with longevity technology specialists who can guide your setup.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies grid */}
      <section id="technologies" className="py-16 lg:py-24 border-b border-border">
        <div className="editorial-container">
          <span
            className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          >
            Explore
          </span>
          <div className="editorial-divider mt-4" />
          <h2 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Technologies for <em className="font-normal">Home Use</em>
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
            Deep-dive into the longevity technologies you can install, use, and
            benefit from in your own home.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {technologies.map((tech) => (
              <Link
                key={tech.slug}
                to={`/technologies/${tech.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-sm aspect-[4/3]">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-xl font-bold text-background md:text-2xl">
                      {tech.name}
                    </h3>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                  {tech.tagline}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Buying guide teaser */}
      <section className="py-16 lg:py-24 border-b border-border bg-secondary">
        <div className="editorial-container">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <span
                className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                style={{ fontFamily: "'Source Sans 3', sans-serif" }}
              >
                Before You Buy
              </span>
              <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground md:text-4xl leading-tight">
                What to Know Before Installing{" "}
                <em className="font-normal">Longevity Tech at Home</em>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Space, power, ventilation, safety certifications — our guides
                cover everything you need to consider before making a purchase.
                We evaluate products on real-world criteria, not marketing claims.
              </p>
              <button
                onClick={() => setExpertOpen(true)}
                className="mt-8 inline-flex items-center justify-center h-12 px-8 bg-foreground text-background text-sm font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-foreground/90 transition-colors"
              >
                Talk to an Expert
              </button>
            </div>
            <div className="relative overflow-hidden rounded-sm aspect-[4/3]">
              <img
                src={redlightImage}
                alt="Red light therapy panel in home setting"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="editorial-container text-center">
          <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Not Sure Where to Start?
          </h2>
          <p className="mt-4 mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
            Our team can help you choose the right technology for your space,
            budget, and health goals.
          </p>
          <button
            onClick={() => setExpertOpen(true)}
            className="mt-8 inline-flex items-center justify-center h-12 px-8 bg-foreground text-background text-sm font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-foreground/90 transition-colors"
          >
            Talk to an Expert
          </button>
        </div>
      </section>

      <ExpertDialog open={expertOpen} onOpenChange={setExpertOpen} />
    </Layout>
  );
};

export default UseAtHome;
