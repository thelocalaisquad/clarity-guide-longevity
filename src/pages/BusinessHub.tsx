import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Dumbbell, Hotel, Stethoscope, ShieldCheck, Calculator, BookOpen, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-sauna.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";
import wellnessImage from "@/assets/editorial-wellness.jpg";

const businessTypes = [
  { label: "Medspa / Clinic", icon: Building2, desc: "Aesthetic treatments & wellness programs" },
  { label: "Gym / Fitness", icon: Dumbbell, desc: "Recovery zones & member retention" },
  { label: "Hotel / Spa", icon: Hotel, desc: "Premium guest amenities & packages" },
  { label: "Physiotherapy", icon: Stethoscope, desc: "Clinical integration & rehab protocols" },
];

const sections = [
  {
    icon: Calculator,
    title: "Products & Pricing",
    items: ["Commercial equipment options", "Bulk & partnership pricing", "Product comparisons by business type"],
    image: redlightImage,
  },
  {
    icon: BookOpen,
    title: "Implementation Guide",
    items: ["Installation requirements", "Space & facility needs", "Timeline from order to launch", "Staff training resources"],
    image: facilityImage,
  },
  {
    icon: ShieldCheck,
    title: "Legal & Compliance",
    items: ["Certifications needed", "Insurance requirements", "Safety protocols", "Regulatory overview by region"],
    image: wellnessImage,
  },
  {
    icon: FileText,
    title: "Business Operations",
    items: ["ROI calculators", "Service pricing strategies", "Marketing templates", "Client waiver templates"],
    image: heroImage,
  },
];

const caseStudies = [
  {
    title: "How a Melbourne MedSpa Added $15k/month with Red Light Therapy",
    type: "Medspa / Clinic",
    image: redlightImage,
  },
  {
    title: "Infrared Sauna Suite: From Empty Room to Revenue Stream in 6 Weeks",
    type: "Gym / Fitness",
    image: heroImage,
  },
  {
    title: "Why This Boutique Hotel Invested in Hyperbaric Oxygen — And What It Returned",
    type: "Hotel / Spa",
    image: facilityImage,
  },
];

const BusinessHub = () => {
  const { data: pages, isLoading } = useQuery({
    queryKey: ["operator-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("operator_pages")
        .select("id, title, slug, summary")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative aspect-[16/7] md:aspect-[16/6]">
          <img
            src={facilityImage}
            alt="Modern wellness facility"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/10" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
            <div className="editorial-container">
              <span className="editorial-label text-background/60">For Business</span>
              <h1 className="mt-3 font-serif text-3xl font-semibold text-background md:text-5xl lg:text-[3.5rem] leading-tight max-w-3xl">
                Bring Longevity Technology{" "}
                <em className="font-normal">to Your Clients</em>
              </h1>
              <p className="mt-4 text-base text-background/70 max-w-xl md:text-lg">
                Medspas · Physiotherapy · Gyms · Hotels
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Type Selector */}
      <section className="py-14 lg:py-20 border-b border-border">
        <div className="editorial-container">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl text-center mb-10">
            WHAT TYPE <em className="font-normal">of business are you?</em>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {businessTypes.map((bt) => (
              <button
                key={bt.label}
                className="group rounded-sm border border-border bg-card p-6 text-left transition-all hover:shadow-lg hover:shadow-foreground/5 hover:border-foreground/20"
              >
                <bt.icon size={28} className="text-foreground/70 group-hover:text-primary transition-colors" />
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {bt.label}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{bt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Four Key Sections */}
      <section className="py-14 lg:py-20 border-b border-border">
        <div className="editorial-container">
          <div className="grid gap-8 md:grid-cols-2">
            {sections.map((s, i) => (
              <div
                key={s.title}
                className="editorial-card group"
              >
                <div className={`relative overflow-hidden ${i % 2 === 0 ? "aspect-[4/3]" : "aspect-[3/2]"}`}>
                  <img
                    src={s.image}
                    alt={s.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <s.icon size={20} className="text-primary shrink-0" />
                    <h3 className="font-serif text-xl font-semibold text-foreground">
                      {s.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {s.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operator Guides from DB */}
      {pages && pages.length > 0 && (
        <section className="py-14 lg:py-20 border-b border-border">
          <div className="editorial-container">
            <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl text-center mb-10">
              OPERATOR <em className="font-normal">guides</em>
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {pages.map((page, index) => (
                <Link
                  key={page.id}
                  to={`/business/${page.slug}`}
                  className={`editorial-card-padded group p-8 ${index === 0 ? "md:col-span-2" : ""}`}
                >
                  <span className="editorial-label text-primary">Operator Guide</span>
                  <h3 className="mt-3 font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors md:text-2xl">
                    {page.title}
                  </h3>
                  {page.summary && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {page.summary}
                    </p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Read full guide <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Studies */}
      <section className="py-14 lg:py-20 border-b border-border">
        <div className="editorial-container">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl text-center mb-10">
            CASE <em className="font-normal">studies</em>
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {caseStudies.map((cs) => (
              <div key={cs.title} className="editorial-card group cursor-pointer">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={cs.image}
                    alt={cs.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-5">
                  <span className="editorial-label text-primary text-[0.6rem]">{cs.type}</span>
                  <h3 className="mt-2 font-serif text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {cs.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="bg-foreground py-16 lg:py-24">
        <div className="editorial-container text-center max-w-2xl mx-auto">
          <span className="editorial-label text-background/40">Get Started</span>
          <h2 className="mt-4 font-serif text-2xl font-semibold text-background md:text-4xl">
            Ready to Add Longevity Tech{" "}
            <em className="font-normal">to Your Business?</em>
          </h2>
          <p className="mt-4 text-sm text-background/60 leading-relaxed max-w-md mx-auto">
            Whether you're planning a new facility or upgrading an existing one,
            we'll help you find the right technology and supplier for your needs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button className="h-12 px-8 bg-background text-foreground text-sm font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-background/90 transition-colors">
              Request Consultation
            </button>
            <Link
              to="/products"
              className="inline-flex items-center justify-center h-12 px-8 border border-background/30 text-background text-sm font-semibold uppercase tracking-[0.12em] rounded-sm hover:border-background/60 transition-colors"
            >
              Browse Equipment
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BusinessHub;
