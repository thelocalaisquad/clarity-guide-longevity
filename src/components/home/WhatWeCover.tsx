import wellnessImage from "@/assets/editorial-wellness.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";

const pillars = [
  { title: "Evidence Review", desc: "What the research actually says — summarised without hype." },
  { title: "How It Works", desc: "Clear mechanism explanations for each technology." },
  { title: "Practical Use", desc: "Considerations for home and commercial settings." },
];

const WhatWeCover = () => (
  <section className="py-20 lg:py-28">
    <div className="editorial-container">
      {/* Header row */}
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-start">
        <div>
          <span className="editorial-label">What We Cover</span>
          <div className="editorial-divider mt-4" />
          <h2 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-4xl leading-tight">
            What is longevity technology?
          </h2>
          <p className="editorial-prose mt-6">
            Longevity technologies are evidence-informed tools and therapies designed to
            support healthspan — the period of life spent in good health. From infrared
            saunas to PEMF devices, we evaluate each on its own terms.
          </p>
        </div>
        <div className="hidden lg:grid grid-cols-2 gap-3">
          <img
            src={wellnessImage}
            alt="Wellness lifestyle"
            className="w-full aspect-[3/4] object-cover rounded-sm"
          />
          <img
            src={redlightImage}
            alt="Red light therapy panel"
            className="w-full aspect-[3/4] object-cover rounded-sm mt-8"
          />
        </div>
      </div>

      {/* Pillar cards */}
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="rounded-sm border border-border bg-card p-7 lg:p-8"
          >
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {p.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhatWeCover;
