import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProductsHub = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, description, is_commercial, technologies(name)")
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
            Products
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Descriptive, non-promotional evaluations of longevity technology products — 
            for both home and commercial use.
          </p>
        </div>
      </section>

      <section className="border-t border-border py-12 lg:py-16">
        <div className="editorial-container">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded border border-border bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {products?.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group rounded border border-border p-6 transition-colors hover:border-primary/30 hover:bg-sage-light"
                >
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${product.is_commercial ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                      {product.is_commercial ? "Commercial" : "Home"}
                    </span>
                  </div>
                  <h2 className="mt-3 font-serif text-lg font-semibold text-foreground group-hover:text-primary">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    View details <ArrowRight size={14} />
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

export default ProductsHub;
