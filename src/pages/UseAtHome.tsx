import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ExpertDialog from "@/components/layout/ExpertDialog";
import heroHomeImage from "@/assets/hero-home.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";
import wellnessImage from "@/assets/editorial-wellness.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";
import heroImage from "@/assets/hero-sauna.jpg";

const SITE_URL = "https://clarity-guide-longevity.lovable.app";

const categories = [
  {
    name: "Infrared & Light Therapy",
    slug: "infrared-sauna",
    image: redlightImage,
    description: "Saunas, red light panels, and photobiomodulation devices.",
  },
  {
    name: "Cryotherapy & Cold Therapy",
    slug: "cryotherapy",
    image: wellnessImage,
    description: "Cold plunge tubs, cryo chambers, and ice bath systems.",
  },
  {
    name: "Hyperbaric Oxygen Therapy",
    slug: "hyperbaric-oxygen-therapy",
    image: facilityImage,
    description: "Home-rated pressurised oxygen chambers and accessories.",
  },
  {
    name: "Bioelectric & Electromagnetic Devices",
    slug: "pemf-therapy",
    image: facilityImage,
    description: "PEMF mats, microcurrent devices, and EMS systems.",
  },
  {
    name: "Air, Water & Environmental",
    slug: "infrared-sauna",
    image: heroImage,
    description: "Hydrogen water, air purification, and EMF shielding.",
  },
  {
    name: "Sleep & Recovery Optimisation",
    slug: "cryotherapy",
    image: wellnessImage,
    description: "Grounding mats, sleep trackers, and recovery wearables.",
  },
  {
    name: "Skin Care & Anti-Ageing",
    slug: "red-light-therapy",
    image: redlightImage,
    description: "LED masks, micro-needling, and collagen-boosting tech.",
  },
  {
    name: "Brain & Cognitive Enhancement",
    slug: "pemf-therapy",
    image: facilityImage,
    description: "Neurofeedback, tDCS, and focus-enhancing devices.",
  },
  {
    name: "Fitness & Performance",
    slug: "cryotherapy",
    image: heroImage,
    description: "EMS training, vibration platforms, and oxygen trainers.",
  },
];

const UseAtHome = () => {
  const [expertOpen, setExpertOpen] = useState(false);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Use At Home", item: `${SITE_URL}/use-at-home` },
    ],
  };

  return (
    <Layout>
      <Helmet>
        <title>Longevity Technology for Home — Infrared Saunas, Red Light & More | Longevity Channel 1</title>
        <meta name="description" content="Build your personal longevity environment at home. Browse infrared saunas, red light therapy, cold plunge, hyperbaric chambers and more for residential use." />
        <link rel="canonical" href={`${SITE_URL}/use-at-home`} />
      </Helmet>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroHomeImage}
            alt="Modern apartment with integrated longevity technology — infrared sauna and red light therapy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-foreground/10" />
        </div>
        <div className="relative editorial-container py-28 lg:py-40">
          <span
            className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-background/60"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          >
            For Your Home
          </span>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.15] text-background md:text-5xl lg:text-6xl max-w-3xl">
            Longevity Technology for Home Use
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-background/70 md:text-lg">
            Learn how to select, implement and use the right longevity technology
            to transform your health and recovery at home.
          </p>
          <button
            onClick={() => setExpertOpen(true)}
            className="mt-8 inline-flex items-center justify-center h-12 px-8 bg-background text-foreground text-sm font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-background/90 transition-colors"
          >
            Talk to an Expert
          </button>
        </div>
      </section>

      {/* Categories grid */}
      <section className="py-16 lg:py-24">
        <div className="editorial-container">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl mb-10">
            Home Longevity Categories
          </h2>

          <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/technologies/${cat.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-sm aspect-square bg-secondary">
                  <img
                    src={cat.image}
                    alt={`${cat.name} — ${cat.description}`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-3 font-serif text-sm font-semibold text-foreground group-hover:text-primary transition-colors md:text-base flex items-center gap-1">
                  {cat.name}
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ExpertDialog open={expertOpen} onOpenChange={setExpertOpen} />
    </Layout>
  );
};

export default UseAtHome;
