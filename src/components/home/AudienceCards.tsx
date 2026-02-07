import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-sauna.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";
import wellnessImage from "@/assets/editorial-wellness.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";

const articles = [
  {
    category: "Heat Therapy",
    title: "The Complete Guide to Infrared Saunas for Home Use",
    image: heroImage,
    slug: "infrared-sauna",
  },
  {
    category: "Photobiomodulation",
    title: "Red Light Therapy Panels: What to Look For",
    image: redlightImage,
    slug: "red-light-therapy",
  },
  {
    category: "Cold Exposure",
    title: "Cryotherapy vs Cold Plunge — A Practical Comparison",
    image: wellnessImage,
    slug: "cryotherapy",
  },
  {
    category: "Oxygen Therapy",
    title: "Is Hyperbaric Oxygen Therapy Right for Your Wellness Facility?",
    image: facilityImage,
    slug: "hyperbaric-oxygen-therapy",
  },
];

const AudienceCards = () => (
  <section className="py-16 lg:py-24 border-b border-border">
    <div className="editorial-container">
      <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl text-center mb-12">
        LATEST <em className="font-normal">articles</em>
      </h2>

      <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
        {articles.map((a) => (
          <Link
            key={a.slug}
            to={`/technologies/${a.slug}`}
            className="group block"
          >
            <div className="relative overflow-hidden rounded-sm aspect-[3/4]">
              <img
                src={a.image}
                alt={a.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-3">
              <span className="editorial-label text-primary text-[0.6rem]">
                {a.category}
              </span>
              <h3 className="mt-1 font-serif text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors md:text-base">
                {a.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default AudienceCards;
