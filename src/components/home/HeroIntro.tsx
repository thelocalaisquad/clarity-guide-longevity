import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-sauna.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";
import wellnessImage from "@/assets/editorial-wellness.jpg";

const sidebarItems = [
  {
    category: "Red Light Therapy",
    title: "How Red Light Therapy Actually Works — And What It Doesn't Do",
    slug: "red-light-therapy",
    image: redlightImage,
  },
  {
    category: "Hyperbaric Oxygen",
    title: "Hyperbaric Oxygen Therapy: The Evidence Behind the Hype",
    slug: "hyperbaric-oxygen-therapy",
    image: facilityImage,
  },
  {
    category: "Cryotherapy",
    title: "Is Cryotherapy Worth It? What the Research Actually Shows",
    slug: "cryotherapy",
    image: wellnessImage,
  },
];

const HeroIntro = () => (
  <section className="pt-8 pb-14 lg:pt-12 lg:pb-20 border-b border-border">
    <div className="editorial-container">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Featured article */}
        <Link to="/technologies/infrared-sauna" className="group block">
          <div className="relative overflow-hidden rounded-sm aspect-[4/3]">
            <img
              src={heroImage}
              alt="Infrared sauna with warm natural light"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <div className="mt-5">
            <span className="editorial-label text-primary">Infrared Sauna</span>
            <h2 className="mt-2 font-serif text-3xl font-semibold leading-[1.2] text-foreground md:text-[2.5rem] lg:text-[2.75rem]">
              Everything You Need to Know About Infrared Saunas{" "}
              <em className="font-normal">Before</em> You Buy One
            </h2>
            <p className="mt-3 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
              From how they work to what the evidence says about recovery,
              detoxification, and cardiovascular health — our complete,
              independent guide.
            </p>
          </div>
        </Link>

        {/* Sidebar — "NEW and NOW" style */}
        <div>
          <h3 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            NEW <em className="font-normal">and</em> NOW
          </h3>
          <div className="mt-5 space-y-1">
            {sidebarItems.map((item, i) => (
              <Link
                key={item.slug}
                to={`/technologies/${item.slug}`}
                className="group flex gap-4 rounded-sm border border-border bg-card p-3 transition-all hover:shadow-md hover:shadow-foreground/5"
              >
                <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-sm">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex flex-col justify-center py-0.5">
                  <span className="editorial-label text-primary text-[0.65rem]">
                    {item.category}
                  </span>
                  <h4 className="mt-1 font-serif text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors md:text-[0.95rem]">
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroIntro;
