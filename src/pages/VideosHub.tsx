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
        <div className="editorial-container">
          <span className="editorial-label">Watch</span>
          <div className="editorial-divider mt-4" />
          <h1 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-5xl max-w-2xl leading-tight">
            Videos
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed">
            Visual explanations of longevity technologies — how they work, 
            what sessions look like, and how they're installed.
          </p>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="editorial-container">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 animate-pulse rounded-sm bg-muted" />
              ))}
            </div>
          ) : (
            <>
              {/* Featured first video */}
              {videos && videos.length > 0 && (
                <Link
                  to={`/videos/${videos[0].slug}`}
                  className="editorial-card group mb-6 block"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="relative aspect-video md:aspect-auto md:min-h-[300px]">
                      {videos[0].youtube_url && (
                        <img
                          src={`https://img.youtube.com/vi/${getYouTubeId(videos[0].youtube_url)}/maxresdefault.jpg`}
                          alt={videos[0].title}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 transition-colors group-hover:bg-foreground/20">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background/90 shadow-lg">
                          <Play size={22} className="text-foreground ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-8 lg:p-12">
                      {videos[0].audience_label && (
                        <span className="editorial-label text-primary">{videos[0].audience_label}</span>
                      )}
                      <h2 className="mt-3 font-serif text-2xl font-semibold text-foreground group-hover:text-primary transition-colors md:text-3xl">
                        {videos[0].title}
                      </h2>
                      {videos[0].summary && (
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {videos[0].summary}
                        </p>
                      )}
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        Watch now <Play size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Remaining videos */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {videos?.slice(1).map((video) => (
                  <Link
                    key={video.id}
                    to={`/videos/${video.slug}`}
                    className="editorial-card group"
                  >
                    <div className="relative aspect-video">
                      {video.youtube_url && (
                        <img
                          src={`https://img.youtube.com/vi/${getYouTubeId(video.youtube_url)}/mqdefault.jpg`}
                          alt={video.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-foreground/5 transition-colors group-hover:bg-foreground/15">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play size={18} className="text-foreground ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      {video.audience_label && (
                        <span className="editorial-label text-primary">{video.audience_label}</span>
                      )}
                      <h2 className="mt-2 font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {video.title}
                      </h2>
                      {video.summary && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {video.summary}
                        </p>
                      )}
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

export default VideosHub;
