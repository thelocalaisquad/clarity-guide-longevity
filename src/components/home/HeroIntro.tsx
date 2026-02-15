import { Link } from "react-router-dom";
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


const HeroIntro = () =>
<section className="pt-8 pb-14 lg:pt-12 lg:pb-20 border-b border-border">
    <div className="editorial-container">
      {/* B2B Banner */}
      <Link
      to="/business"
      className="mb-6 flex items-center justify-center gap-2 rounded-sm bg-foreground px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-background transition-colors hover:bg-foreground/90"
      style={{ fontFamily: "'Source Sans 3', sans-serif" }}>

        Looking to add longevity tech to your business? → Explore Business Solutions
      </Link>

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
                The only place where you can see behind the scenes in the
                fastest growing market in health.
              </p>

              {/* Audience Split CTAs */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                to="/products"
                className="inline-flex items-center justify-center h-12 px-8 bg-background text-foreground text-sm font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-background/90 transition-colors">

                  Shop Products
                </Link>
                <Link
                to="/business"
                className="inline-flex items-center justify-center h-12 px-8 border-2 border-background text-background text-sm font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-background/10 transition-colors">

                  For Your Business
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <h3 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            NEW <em className="font-normal">and</em> NOW
          </h3>
          <div className="mt-5 space-y-1">
            {sidebarItems.map((item) =>
          <Link
            key={item.slug}
            to={item.href}
            className="group flex gap-4 rounded-sm border border-border bg-card p-3 transition-all hover:shadow-md hover:shadow-foreground/5">

                <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-sm">
                  <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />

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
          )}
          </div>
        </div>
      </div>
    </div>
  </section>;


export default HeroIntro;