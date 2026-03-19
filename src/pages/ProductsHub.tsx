import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SITE_URL = "https://clarity-guide-longevity.lovable.app";

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

  const homeProducts = products?.filter(p => !p.is_commercial) || [];
  const commercialProducts = products?.filter(p => p.is_commercial) || [];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` },
    ],
  };

  return (
    <Layout>
      <Helmet>
        <title>Longevity Technology Products — Home & Commercial | Longevity Channel 1</title>
        <meta name="description" content="Browse longevity technology products for home and commercial use — infrared saunas, red light therapy panels, hyperbaric chambers, cryotherapy units and more." />
        <link rel="canonical" href={`${SITE_URL}/products`} />
      </Helmet>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="py-16 lg:py-24">
        <div className="editorial-container">
          <span className="editorial-label">Evaluate</span>
          <div className="editorial-divider mt-4" />
          <h1 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-5xl max-w-2xl leading-tight">
            Longevity Technology Products
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed">
            Descriptive, non-promotional evaluations of longevity technology products — 
            for both home and commercial use.
          </p>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="editorial-container">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-sm bg-muted" />
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {/* Home products */}
              {homeProducts.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">For Home Use</h2>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {homeProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.slug}`}
                        className="editorial-card-padded group p-7"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                              Home
                            </span>
                            <h3 className="mt-4 font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            {product.technologies && (
                              <span className="mt-1 block text-xs text-muted-foreground">
                                {(product.technologies as any).name}
                              </span>
                            )}
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                              {product.description}
                            </p>
                            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                              View details <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Commercial products */}
              {commercialProducts.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">For Commercial Use</h2>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {commercialProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.slug}`}
                        className="editorial-card-padded group p-7"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                              Commercial
                            </span>
                            <h3 className="mt-4 font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            {product.technologies && (
                              <span className="mt-1 block text-xs text-muted-foreground">
                                {(product.technologies as any).name}
                              </span>
                            )}
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                              {product.description}
                            </p>
                            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                              View details <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProductsHub;
