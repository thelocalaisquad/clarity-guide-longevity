import { Link } from "react-router-dom";
import wellnessImage from "@/assets/editorial-wellness.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";
import heroImage from "@/assets/hero-sauna.jpg";

const items = [
  {
    category: "Evidence Review",
    title: "What Does the Science Actually Say About Infrared Saunas?",
    image: heroImage,
    slug: "infrared-sauna",
    imageFirst: true,
    tall: true,
  },
  {
    category: "Technology Guide",
    title: "Red Light Therapy: A Complete Breakdown for Beginners",
    image: redlightImage,
    slug: "red-light-therapy",
    imageFirst: false,
    tall: false,
  },
  {
    category: "Operator Insight",
    title: "How to Choose the Right Longevity Tech for Your Facility",
    image: facilityImage,
    slug: "business",
    imageFirst: true,
    tall: false,
  },
  {
    category: "Deep Dive",
    title: "Hyperbaric Oxygen Therapy: Worth the Investment?",
    image: wellnessImage,
    slug: "hyperbaric-oxygen-therapy",
    imageFirst: false,
    tall: true,
  },
  {
    category: "Comparison",
    title: "Cold Plunge vs Whole-Body Cryotherapy — What's the Difference?",
    image: heroImage,
    slug: "cryotherapy",
    imageFirst: true,
    tall: false,
  },
  {
    category: "Wellness",
    title: "PEMF Therapy Explained: Mechanism, Evidence & Practical Use",
    image: redlightImage,
    slug: "pemf-therapy",
    imageFirst: false,
    tall: false,
  },
];

const WhatWeCover = () => (
  <section className="py-16 lg:py-24 border-b border-border">
    <div className="editorial-container">
      <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl text-center mb-12">
        ICYMI: <em className="font-normal">Stories Readers Are Loving</em>
      </h2>

      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item) => {
          const linkTo = item.slug.includes("-")
            ? `/technologies/${item.slug}`
            : `/${item.slug}`;

          return (
            <Link
              key={item.slug}
              to={linkTo}
              className="group block editorial-card"
            >
              {item.imageFirst ? (
                <>
                  <div className={`relative overflow-hidden ${item.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5">
                    <span className="editorial-label text-primary">{item.category}</span>
                    <h3 className="mt-2 font-serif text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-5 pb-3">
                    <span className="editorial-label text-primary">{item.category}</span>
                    <h3 className="mt-2 font-serif text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className={`relative overflow-hidden ${item.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

export default WhatWeCover;
