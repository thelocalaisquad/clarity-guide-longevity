import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import facilityImage from "@/assets/editorial-facility.jpg";

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
      {/* Hero with image */}
      <section className="relative py-16 lg:py-24">
        <div className="editorial-container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="editorial-label">For Operators</span>
              <div className="editorial-divider mt-4" />
              <h1 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-5xl leading-tight">
                Business &amp; Operations
              </h1>
              <p className="mt-5 max-w-lg text-base text-muted-foreground leading-relaxed">
                Practical, pattern-focused guidance for operators integrating longevity 
                technologies into commercial wellness settings.
              </p>
            </div>
            <div>
              <img src={facilityImage} alt="Modern wellness facility" className="w-full aspect-[3/2] object-cover rounded-sm" />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="editorial-container">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-sm bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {pages?.map((page, index) => (
                <Link
                  key={page.id}
                  to={`/business/${page.slug}`}
                  className={`editorial-card-padded group p-8 lg:p-10 ${index === 0 ? 'md:col-span-2' : ''}`}
                >
                  <span className="editorial-label text-primary">Operator Guide</span>
                  <h2 className="mt-3 font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors md:text-2xl">
                    {page.title}
                  </h2>
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
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BusinessHub;
