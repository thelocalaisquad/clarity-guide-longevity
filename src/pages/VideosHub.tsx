import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const VideosHub = () => {
  const { data: videos, isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("id, title, slug, summary, audience_label, youtube_url")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?\s]+)/);
    return match?.[1] || "";
  };

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="editorial-container max-w-4xl">
          <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Videos
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Visual explanations of longevity technologies — how they work, 
            what sessions look like, and how they're installed.
          </p>
        </div>
      </section>

      <section className="border-t border-border py-12 lg:py-16">
        <div className="editorial-container">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded border border-border bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {videos?.map((video) => (
                <Link
                  key={video.id}
                  to={`/videos/${video.slug}`}
                  className="group rounded border border-border overflow-hidden transition-colors hover:border-primary/30"
                >
                  <div className="relative aspect-video bg-muted">
                    {video.youtube_url && (
                      <img
                        src={`https://img.youtube.com/vi/${getYouTubeId(video.youtube_url)}/mqdefault.jpg`}
                        alt={video.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 opacity-0 transition-opacity group-hover:opacity-100">
                      <Play size={40} className="text-background" />
                    </div>
                  </div>
                  <div className="p-4">
                    {video.audience_label && (
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {video.audience_label}
                      </span>
                    )}
                    <h2 className="mt-1 font-serif text-lg font-semibold text-foreground group-hover:text-primary">
                      {video.title}
                    </h2>
                    {video.summary && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {video.summary}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default VideosHub;
