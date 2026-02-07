import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      <section className="py-16 lg:py-24">
        <div className="editorial-container max-w-4xl">
          <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Business &amp; Operations
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Practical, pattern-focused guidance for operators integrating longevity 
            technologies into commercial wellness settings.
          </p>
        </div>
      </section>

      <section className="border-t border-border py-12 lg:py-16">
        <div className="editorial-container">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded border border-border bg-muted" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {pages?.map((page) => (
                <Link
                  key={page.id}
                  to={`/business/${page.slug}`}
                  className="group block rounded border border-border p-6 transition-colors hover:border-primary/30 hover:bg-sage-light"
                >
                  <h2 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary">
                    {page.title}
                  </h2>
                  {page.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {page.summary}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Read more <ArrowRight size={14} />
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
