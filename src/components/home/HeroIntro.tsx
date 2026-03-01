import { useState } from "react";
import { Link } from "react-router-dom";
import ExpertDialog from "@/components/layout/ExpertDialog";
import heroImage from "@/assets/hero-sauna.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";
import wellnessImage from "@/assets/editorial-wellness.jpg";

const sidebarItems = [
{
  category: "Use At Home",
  title: "Build Your Personal Longevity Environment — From Saunas to Red Light",
  slug: "red-light-therapy",
  image: redlightImage,
  href: "/products"
},
{
  category: "Health and Wellness Businesses",
  title: "Add High-Value Recovery Tech to Your Gym, Clinic, or Spa",
  slug: "hyperbaric-oxygen-therapy",
  image: facilityImage,
  href: "/business"
},
{
  category: "Designers and Architects",
  title: "Integrate Longevity Technology Into Luxury Residential and Commercial Projects",
  slug: "cryotherapy",
  image: wellnessImage,
  href: "/designers"
}];


const HeroIntro = () => {
  const [expertOpen, setExpertOpen] = useState(false);
  return (
  <>
<section className="pt-8 pb-14 lg:pt-12 lg:pb-20 border-b border-border">
    <div className="editorial-container">

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Featured article with audience CTAs */}
        <div className="group block">
          <div className="relative overflow-hidden rounded-sm aspect-[16/10]">
            <img
            src={heroImage}
            alt="Infrared sauna with warm natural light"
            className="absolute inset-0 h-full w-full object-cover" />

            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h2 className="font-serif text-2xl font-semibold leading-[1.2] text-background md:text-3xl lg:text-[2.5rem]">
                Uncovering best longevity technology{" "}
                <em className="font-normal">
                  — and how to use it at home and in your business.
                
              </em>
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-background/70 md:text-[0.95rem]">
                The only place to see exactly what longevity technologies are available, how they work, and how to use them for yourself or for your business.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center h-12 px-8 bg-background text-foreground text-sm font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-background/90 transition-colors"
                >
                  Shop Now
                </Link>
                <button
                  onClick={() => setExpertOpen(true)}
                  className="inline-flex items-center justify-center h-12 px-8 border border-background text-background text-sm font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-background/10 transition-colors"
                >
                  Talk to an Expert
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {sidebarItems.map((item) =>
          <Link
            key={item.slug}
            to={item.href}
            className="group block relative overflow-hidden rounded-sm transition-all hover:shadow-lg hover:shadow-foreground/10">

              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-serif text-2xl font-bold leading-tight text-background md:text-3xl">
                    {item.category}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-background/70">
                    {item.title}
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  </section>
  <ExpertDialog open={expertOpen} onOpenChange={setExpertOpen} />
  </>
  );
};


export default HeroIntro;