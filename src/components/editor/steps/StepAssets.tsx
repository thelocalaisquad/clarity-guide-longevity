import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { usePublishToLive } from "@/hooks/usePublishToLive";
import { withImageCacheBust, toPublicStorageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Image as ImageIcon,
  FileText,
  Mail,
  Share2,
  Video,
  Globe,
  Upload,
  Check,
  Pencil,
  Download,
  Trash2,
  Copy,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

interface Props {
  job: any;
  onRefresh: () => void;
}

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  x: "X / Twitter",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  substack: "Substack",
  email: "Email",
};

const StepAssets = ({ job, onRefresh }: Props) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { publish, publishing } = usePublishToLive(job.id);
  const [uploading, setUploading] = useState(false);

  const { data: visuals } = useQuery({
    queryKey: ["assets-visuals", job.id],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("visual_assets")
        .select("*")
        .eq("job_id", job.id)
        .order("created_at", { ascending: false });
      return (data as any[]) || [];
    },
  });

  const { data: outputs } = useQuery({
    queryKey: ["assets-outputs", job.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("content_outputs")
        .select("*")
        .eq("job_id", job.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: source } = useQuery({
    queryKey: ["assets-source", job.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("content_sources")
        .select("*")
        .eq("job_id", job.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: edition } = useQuery({
    queryKey: ["assets-edition", job.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("editions")
        .select("*")
        .eq("source_job_id", job.id)
        .maybeSingle();
      return data;
    },
  });

  const article = outputs?.find((o) => o.output_group === "article" && o.approved)
    || outputs?.find((o) => o.output_group === "article");
  const newsletter = outputs?.find((o) => o.output_group === "newsletter" && o.approved)
    || outputs?.find((o) => o.output_group === "newsletter");
  const socials = (outputs || []).filter((o) => o.output_group === "social");

  const liveImageUrl = edition?.og_image ? toPublicStorageUrl(edition.og_image).split("?")[0] : null;

  const refreshAll = () => {
    qc.invalidateQueries({ queryKey: ["assets-visuals", job.id] });
    qc.invalidateQueries({ queryKey: ["assets-outputs", job.id] });
    qc.invalidateQueries({ queryKey: ["assets-edition", job.id] });
    qc.invalidateQueries({ queryKey: ["visual-assets", job.id] });
    onRefresh();
  };

  const handleSetLiveHero = async (assetId: string) => {
    await (supabase as any)
      .from("visual_assets")
      .update({ approved: false })
      .eq("job_id", job.id)
      .neq("id", assetId);
    await (supabase as any)
      .from("visual_assets")
      .update({ approved: true, updated_at: new Date().toISOString() })
      .eq("id", assetId);
    toast({ title: "Set as live hero", description: "Publishing to live site…" });
    qc.invalidateQueries({ queryKey: ["assets-visuals", job.id] });
    await publish();
    qc.invalidateQueries({ queryKey: ["assets-edition", job.id] });
  };

  const handleEditOverlays = (assetId: string) => {
    navigate(`/jobs/${job.id}?step=visuals&assetId=${assetId}`);
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm("Delete this draft visual?")) return;
    await (supabase as any).from("visual_assets").delete().eq("id", assetId);
    toast({ title: "Deleted" });
    qc.invalidateQueries({ queryKey: ["assets-visuals", job.id] });
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${job.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("transcripts")
        .upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("transcripts").getPublicUrl(path);
      const { error: insErr } = await (supabase as any).from("visual_assets").insert({
        job_id: job.id,
        image_url: pub.publicUrl,
        template_name: "editorial",
        platform: "linkedin",
        approved: false,
      });
      if (insErr) throw insErr;
      toast({ title: "Image uploaded", description: "Saved as a draft visual." });
      qc.invalidateQueries({ queryKey: ["assets-visuals", job.id] });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text || "");
    toast({ title: "Copied to clipboard" });
  };

  const goToStep = (stepIndex: number) => {
    navigate(`/jobs/${job.id}?step=${stepIndex}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Assets</h2>
          <p className="text-sm text-muted-foreground">
            Everything produced for this job in one place. Pick the live hero, edit copy, or re-publish.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={refreshAll}>
          <RefreshCw className="mr-2 h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      {/* 1. Hero / Visuals */}
      <Section
        icon={<ImageIcon className="h-4 w-4" />}
        title="Hero & Visuals"
        count={visuals?.length || 0}
        defaultOpen
        right={
          <label className="inline-flex">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-accent",
                uploading && "opacity-50 pointer-events-none"
              )}
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "Uploading…" : "Upload image"}
            </span>
          </label>
        }
      >
        {!visuals?.length ? (
          <EmptyState text="No visuals yet. Upload one or generate from Step 6." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visuals.map((v: any) => {
              const publicUrl = v.image_url ? toPublicStorageUrl(v.image_url).split("?")[0] : null;
              const isLive = !!(liveImageUrl && publicUrl && liveImageUrl === publicUrl);
              return (
                <div key={v.id} className="border rounded-lg overflow-hidden bg-card">
                  <div className="relative aspect-square bg-muted">
                    {v.image_url ? (
                      <img
                        src={withImageCacheBust(v.image_url, v.updated_at)}
                        alt={v.overlay_headline || "Visual"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {isLive && (
                        <Badge className="bg-emerald-600 text-white border-0">Live hero</Badge>
                      )}
                      {v.approved && !isLive && (
                        <Badge variant="secondary">Approved</Badge>
                      )}
                      {!v.approved && <Badge variant="outline">Draft</Badge>}
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="capitalize">{v.platform} · {v.template_name}</span>
                    </div>
                    {v.overlay_headline && (
                      <p className="text-sm font-medium line-clamp-2">{v.overlay_headline}</p>
                    )}
                    <div className="flex flex-wrap gap-1 pt-1">
                      <Button
                        size="sm"
                        variant={isLive ? "secondary" : "default"}
                        disabled={isLive || publishing}
                        onClick={() => handleSetLiveHero(v.id)}
                        className="h-7 text-xs"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        {isLive ? "Live" : "Set as live hero"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditOverlays(v.id)}
                        className="h-7 text-xs"
                      >
                        <Pencil className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      {v.image_url && (
                        <a
                          href={withImageCacheBust(v.image_url, v.updated_at)}
                          download
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button size="sm" variant="ghost" className="h-7 text-xs">
                            <Download className="mr-1 h-3 w-3" /> Download
                          </Button>
                        </a>
                      )}
                      {!v.approved && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(v.id)}
                          className="h-7 text-xs text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-1 h-3 w-3" /> Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* 2. Article */}
      <Section
        icon={<FileText className="h-4 w-4" />}
        title="Article"
        count={article ? 1 : 0}
        right={
          <Button size="sm" variant="outline" onClick={() => goToStep(3)}>
            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit in Step 4
          </Button>
        }
      >
        {!article ? (
          <EmptyState text="No article yet. Generate one in Step 4." />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {article.approved ? (
                <Badge className="bg-emerald-600 text-white border-0">Approved</Badge>
              ) : (
                <Badge variant="outline">Draft</Badge>
              )}
              <span className="text-xs text-muted-foreground">
                Updated {new Date(article.updated_at).toLocaleString()}
              </span>
            </div>
            {article.title && <h3 className="font-semibold">{article.title}</h3>}
            {article.meta_description && (
              <p className="text-sm text-muted-foreground italic">{article.meta_description}</p>
            )}
            {article.body && (
              <div className="text-sm text-foreground/80 max-h-48 overflow-y-auto whitespace-pre-wrap border rounded p-3 bg-muted/30">
                {article.body.slice(0, 1200)}
                {article.body.length > 1200 && "…"}
              </div>
            )}
          </div>
        )}
      </Section>

      {/* 3. Newsletter */}
      <Section
        icon={<Mail className="h-4 w-4" />}
        title="Newsletter"
        count={newsletter ? 1 : 0}
        right={
          <Button size="sm" variant="outline" onClick={() => goToStep(2)}>
            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit in Step 3
          </Button>
        }
      >
        {!newsletter ? (
          <EmptyState text="No newsletter draft yet." />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {newsletter.approved ? (
                <Badge className="bg-emerald-600 text-white border-0">Approved</Badge>
              ) : (
                <Badge variant="outline">Draft</Badge>
              )}
              <span className="text-xs text-muted-foreground">
                Updated {new Date(newsletter.updated_at).toLocaleString()}
              </span>
            </div>
            {newsletter.title && <h3 className="font-semibold">{newsletter.title}</h3>}
            {newsletter.body && (
              <div className="text-sm text-foreground/80 max-h-48 overflow-y-auto whitespace-pre-wrap border rounded p-3 bg-muted/30">
                {newsletter.body.slice(0, 1200)}
                {newsletter.body.length > 1200 && "…"}
              </div>
            )}
          </div>
        )}
      </Section>

      {/* 4. Social posts */}
      <Section
        icon={<Share2 className="h-4 w-4" />}
        title="Social posts"
        count={socials.length}
        right={
          <Button size="sm" variant="outline" onClick={() => goToStep(4)}>
            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit in Step 5
          </Button>
        }
      >
        {!socials.length ? (
          <EmptyState text="No social posts generated yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {socials.map((s) => (
              <div key={s.id} className="border rounded-lg p-3 space-y-2 bg-card">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {SOCIAL_LABELS[s.channel] || s.channel}
                  </span>
                  {s.approved ? (
                    <Badge className="bg-emerald-600 text-white border-0">Approved</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </div>
                <div className="text-sm text-foreground/80 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {s.body || <span className="italic text-muted-foreground">Empty</span>}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => handleCopy(s.body || "")}
                  >
                    <Copy className="mr-1 h-3 w-3" /> Copy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* 5. Source video & transcript */}
      <Section
        icon={<Video className="h-4 w-4" />}
        title="Source video & transcript"
        count={source ? 1 : 0}
      >
        {!source ? (
          <EmptyState text="No source captured yet." />
        ) : (
          <div className="space-y-3">
            {source.video_url && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Video
                </p>
                <a
                  href={source.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary underline break-all"
                >
                  {source.video_url}
                </a>
              </div>
            )}
            {source.transcript_file_url && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Transcript file
                </p>
                <a
                  href={source.transcript_file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary underline"
                >
                  Open transcript <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            {source.research_notes && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Research notes
                </p>
                <div className="text-sm whitespace-pre-wrap border rounded p-3 bg-muted/30 max-h-40 overflow-y-auto">
                  {source.research_notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Section>

      {/* 6. Live edition snapshot */}
      <Section
        icon={<Globe className="h-4 w-4" />}
        title="Live edition"
        count={edition ? 1 : 0}
        right={
          <Button size="sm" onClick={publish} disabled={publishing}>
            <RefreshCw className={cn("mr-2 h-3.5 w-3.5", publishing && "animate-spin")} />
            {publishing ? "Publishing…" : "Re-publish now"}
          </Button>
        }
      >
        {!edition ? (
          <EmptyState text="Not yet published to the live site." />
        ) : (
          <div className="flex gap-4 flex-wrap">
            {edition.og_image && (
              <img
                src={withImageCacheBust(edition.og_image, edition.updated_at)}
                alt={edition.title}
                className="w-32 h-32 object-cover rounded border"
              />
            )}
            <div className="flex-1 min-w-[200px] space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Edition {edition.edition_number}</Badge>
                {edition.is_published && (
                  <Badge className="bg-emerald-600 text-white border-0">Published</Badge>
                )}
              </div>
              <p className="font-semibold">{edition.title}</p>
              <p className="text-xs text-muted-foreground">
                Updated {new Date(edition.updated_at).toLocaleString()}
              </p>
              <a
                href={`https://longevitychannel1.com/editions/${edition.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary underline text-sm"
              >
                View live <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
};

const Section = ({
  icon,
  title,
  count,
  children,
  right,
  defaultOpen = false,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  children: React.ReactNode;
  right?: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between gap-3">
            <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left">
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  open && "rotate-180"
                )}
              />
              {icon}
              <CardTitle className="text-base">{title}</CardTitle>
              <Badge variant="outline" className="ml-1">
                {count}
              </Badge>
            </CollapsibleTrigger>
            {right && <div onClick={(e) => e.stopPropagation()}>{right}</div>}
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-4 pt-0">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

const EmptyState = ({ text }: { text: string }) => (
  <p className="text-sm text-muted-foreground italic py-2">{text}</p>
);

export default StepAssets;
