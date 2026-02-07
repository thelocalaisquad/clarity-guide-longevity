import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-sauna.jpg";
import redlightImage from "@/assets/editorial-redlight.jpg";
import facilityImage from "@/assets/editorial-facility.jpg";
import wellnessImage from "@/assets/editorial-wellness.jpg";

const techImages: Record<string, string> = {
  "infrared-sauna": heroImage,
  "red-light-therapy": redlightImage,
  "hyperbaric-oxygen-therapy": facilityImage,
  "cryotherapy": wellnessImage,
  "pemf-therapy": facilityImage,
};

const TechnologiesHub = () => {
  const { data: technologies, isLoading } = useQuery({
    queryKey: ["technologies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technologies")
        .select("id, name, slug, description")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      {/* Header section */}
      <section className="py-16 lg:py-24">
        <div className="editorial-container">
          <span className="editorial-label">Explore</span>
          <div className="editorial-divider mt-4" />
          <h1 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-5xl max-w-2xl leading-tight">
            Technologies
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed">
            Each technology is examined through the same structured lens: what it is, how it works,
            what the evidence says, and how it's used.
          </p>
        </div>
      </section>

      {/* Card grid */}
      <section className="pb-20 lg:pb-28">
        <div className="editorial-container">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-sm bg-muted" />
              ))}
            </div>
          ) : (
            <>
              {/* Featured first item */}
              {technologies && technologies.length > 0 && (
                <Link
                  to={`/technologies/${technologies[0].slug}`}
                  className="editorial-card group mb-6 block"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="relative aspect-[4/3] md:aspect-auto">
                      <img
                        src={techImages[technologies[0].slug] || facilityImage}
                        alt={technologies[0].name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-8 lg:p-12">
                      <span className="editorial-label text-primary">Featured</span>
                      <h2 className="mt-3 font-serif text-2xl font-semibold text-foreground group-hover:text-primary transition-colors md:text-3xl">
                        {technologies[0].name}
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {technologies[0].description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        Read full overview <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Remaining as image cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {technologies?.slice(1).map((tech) => (
                  <Link
                    key={tech.id}
                    to={`/technologies/${tech.slug}`}
                    className="editorial-card group"
                  >
                    <div className="relative aspect-[4/3]">
                      <img
                        src={techImages[tech.slug] || facilityImage}
                        alt={tech.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="p-5">
                      <h2 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {tech.name}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {tech.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        Read more <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TechnologiesHub;
