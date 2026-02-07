import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      <section className="py-16 lg:py-24">
        <div className="editorial-container max-w-4xl">
          <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Technologies
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Each technology is examined through the same structured lens: what it is, how it works,
            what the evidence says, and how it's used.
          </p>
        </div>
      </section>

      <section className="border-t border-border py-12 lg:py-16">
        <div className="editorial-container">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded border border-border bg-muted" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {technologies?.map((tech) => (
                <Link
                  key={tech.id}
                  to={`/technologies/${tech.slug}`}
                  className="group block rounded border border-border p-6 transition-colors hover:border-primary/30 hover:bg-sage-light"
                >
                  <h2 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary">
                    {tech.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {tech.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Read more <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
              {technologies?.length === 0 && (
                <p className="text-muted-foreground">No technologies published yet.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TechnologiesHub;
