import { Link } from "react-router-dom";
import facilityImage from "@/assets/editorial-facility.jpg";
import heroImage from "@/assets/hero-sauna.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";
import wellnessImage from "@/assets/editorial-wellness.jpg";

const cards = [
  {
    category: "Our Process",
    title: "What It Is — Clear Definition & Mechanism of Action",
    image: heroImage,
    imageFirst: true,
    tall: true,
  },
  {
    category: "Evidence First",
    title: "What the Research Actually Says — And What It Doesn't",
    image: redlightImage,
    imageFirst: false,
    tall: false,
  },
  {
    category: "Practical Use",
    title: "Individual & Commercial Considerations for Every Technology",
    image: facilityImage,
    imageFirst: true,
    tall: false,
  },
  {
    category: "For Operators",
    title: "Installation, ROI & Operational Requirements at a Glance",
    image: wellnessImage,
    imageFirst: false,
    tall: true,
  },
];

const ApproachSection = () => (
  <section className="py-16 lg:py-24 border-b border-border">
    <div className="editorial-container">
      <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl text-center mb-12">
        HOW <em className="font-normal">we evaluate</em>
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card, i) => (
          <Link
            key={i}
            to="/technologies"
            className="group block editorial-card"
          >
            {card.imageFirst ? (
              <>
                <div className={`relative overflow-hidden ${card.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6">
                  <span className="editorial-label text-primary">{card.category}</span>
                  <h3 className="mt-2 font-serif text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                </div>
              </>
            ) : (
              <>
                <div className="p-6 pb-4">
                  <span className="editorial-label text-primary">{card.category}</span>
                  <h3 className="mt-2 font-serif text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                </div>
                <div className={`relative overflow-hidden ${card.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              </>
            )}
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default ApproachSection;
