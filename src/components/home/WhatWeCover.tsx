import wellnessImage from "@/assets/editorial-wellness.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";

const WhatWeCover = () => (
  <section className="py-16 lg:py-24 border-b border-border">
    <div className="editorial-container">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr_1fr] items-start">
        {/* Text column */}
        <div className="lg:col-span-1">
          <span className="editorial-label text-primary">About</span>
          <h2 className="mt-3 font-serif text-2xl font-semibold text-foreground md:text-3xl leading-tight">
            What <em className="font-normal">is</em> longevity technology?
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            Evidence-informed tools and therapies designed to support healthspan —
            the period of life spent in good health.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
            We evaluate each technology on its own terms — what it does, how it
            works, and what the evidence says.
          </p>
        </div>

        {/* Two staggered images */}
        <div className="hidden lg:block">
          <img
            src={wellnessImage}
            alt="Wellness lifestyle"
            className="w-full aspect-[3/4] object-cover rounded-sm"
          />
        </div>
        <div className="hidden lg:block mt-12">
          <img
            src={redlightImage}
            alt="Red light therapy"
            className="w-full aspect-[3/4] object-cover rounded-sm"
          />
        </div>
      </div>
    </div>
  </section>
);

export default WhatWeCover;
