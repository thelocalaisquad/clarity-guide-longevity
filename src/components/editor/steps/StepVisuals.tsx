import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePublishToLive } from "@/hooks/usePublishToLive";
import { cn } from "@/lib/utils";
import {
  Upload,
  RefreshCw,
  CheckCircle,
  Save,
  ImageIcon,
  Sparkles,
  Type,
  LayoutTemplate,
  Monitor,
  Globe,
} from "lucide-react";

interface Props {
  job: any;
  onRefresh: () => void;
}

const TEMPLATES = [
  { key: "editorial", label: "Editorial", icon: "📰" },
  { key: "banner", label: "Banner Strip", icon: "▬" },
  { key: "split", label: "Split Frame", icon: "◧" },
  { key: "quote", label: "Expert Quote", icon: "❝" },
] as const;

const PLATFORMS = [
  { key: "linkedin", label: "LinkedIn", aspect: "1:1", width: 600, height: 600 },
  { key: "instagram", label: "Instagram", aspect: "4:5", width: 540, height: 675 },
  { key: "x", label: "X", aspect: "16:9", width: 640, height: 360 },
] as const;

type TemplateKey = (typeof TEMPLATES)[number]["key"];
type PlatformKey = (typeof PLATFORMS)[number]["key"];

const StepVisuals = ({ job, onRefresh }: Props) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { publish, publishing } = usePublishToLive(job.id);
  const [searchParams] = useSearchParams();

  // Fetch the live edition to show "Currently Live" badge on visuals
  const { data: liveEdition } = useQuery({
    queryKey: ["live-edition-for-job", job.id],
    queryFn: async () => {
      const slug = (job.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const { data } = await supabase
        .from("editions")
        .select("og_image, slug")
        .eq("slug", slug)
        .maybeSingle();
      return data;
    },
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectedHeadline, setSelectedHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [ctaText, setCtaText] = useState(job.primary_cta_label || "Learn More");
  const [template, setTemplate] = useState<TemplateKey>("editorial");
  const [platform, setPlatform] = useState<PlatformKey>("linkedin");
  const [saving, setSaving] = useState(false);

  // Fetch existing visual assets
  const { data: assets } = useQuery({
    queryKey: ["visual-assets", job.id],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("visual_assets")
        .select("*")
        .eq("job_id", job.id)
        .order("created_at", { ascending: false });
      return (data as any[]) || [];
    },
  });

  // Fetch approved social outputs for context
  const { data: socialOutputs } = useQuery({
    queryKey: ["social-outputs-for-visuals", job.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("content_outputs")
        .select("*")
        .eq("job_id", job.id)
        .eq("output_group", "social")
        .eq("approved", true);
      return data || [];
    },
  });

  const currentPlatform = PLATFORMS.find((p) => p.key === platform)!;

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `visuals/${job.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("transcripts").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: signedData, error: signedErr } = await supabase.storage.from("transcripts").createSignedUrl(path, 3600);
    if (signedErr || !signedData?.signedUrl) {
      toast({ title: "Failed to get image URL", variant: "destructive" });
      setUploading(false);
      return;
    }
    setImageUrl(signedData.signedUrl);
    setUploading(false);
    toast({ title: "Image uploaded" });
  };

  // Generate headline options
  const handleGenerateHeadlines = async () => {
    setGenerating(true);
    const firstSocial = socialOutputs?.[0];
    const { data, error } = await supabase.functions.invoke("generate-headlines", {
      body: {
        job_id: job.id,
        channel: platform,
        product_name: job.product_name || job.title,
        social_body: firstSocial?.body || "",
      },
    });

    if (error) {
      toast({ title: "Error generating headlines", description: error.message, variant: "destructive" });
    } else if (data?.headlines) {
      setHeadlines(data.headlines);
      toast({ title: "Headlines generated" });
    }
    setGenerating(false);
  };

  // Draw preview on canvas
  useEffect(() => {
    drawPreview();
  }, [imageUrl, selectedHeadline, subheadline, ctaText, template, platform]);

  const drawPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = currentPlatform.width;
    const h = currentPlatform.height;
    canvas.width = w * 2;
    canvas.height = h * 2;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(2, 2);

    // Light background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    // Draw product image if available
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        drawWithImage(ctx, w, h, img);
      };
      img.src = imageUrl;
    } else {
      // Placeholder
      ctx.fillStyle = "#f5f5f0";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#999";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Upload a product image", w / 2, h / 2);
      drawOverlay(ctx, w, h);
    }
  };

  const drawWithImage = (ctx: CanvasRenderingContext2D, w: number, h: number, img: HTMLImageElement) => {
    const headline = selectedHeadline || "Your Headline Here";

    switch (template) {
      case "editorial": {
        // Top white band with serif headline, image below
        const topBand = h * 0.28;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, topBand);

        // Draw image in remaining area
        const imgArea = h - topBand;
        const scale = Math.max(w / img.width, imgArea / img.height);
        const iw = img.width * scale;
        const ih = img.height * scale;
        ctx.drawImage(img, (w - iw) / 2, topBand + (imgArea - ih) / 2, iw, ih);

        // Subtle gradient at bottom for CTA
        if (ctaText) {
          const grad = ctx.createLinearGradient(0, h - 80, 0, h);
          grad.addColorStop(0, "rgba(0,0,0,0)");
          grad.addColorStop(1, "rgba(0,0,0,0.45)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, h - 80, w, 80);
        }

        // Headline in top band
        const headSize = Math.min(w / 10, 48);
        ctx.textAlign = "left";
        ctx.fillStyle = "#1a1a1a";
        ctx.font = `bold ${headSize}px "Playfair Display", "Georgia", serif`;
        wrapText(ctx, headline, 32, headSize + 16, w - 64, headSize * 1.15);

        // Subheadline
        if (subheadline) {
          ctx.font = `${Math.min(w / 28, 16)}px "Source Sans 3", sans-serif`;
          ctx.fillStyle = "#666";
          ctx.fillText(subheadline, 32, topBand - 12, w - 64);
        }

        // CTA at bottom right
        if (ctaText) {
          ctx.textAlign = "right";
          ctx.fillStyle = "#ffffff";
          ctx.font = `600 ${Math.min(w / 30, 14)}px "Source Sans 3", sans-serif`;
          ctx.fillText(ctaText.toUpperCase(), w - 28, h - 20);
        }
        break;
      }
      case "banner": {
        // Full bleed image with white banner across top
        const scale = Math.max(w / img.width, h / img.height);
        const iw = img.width * scale;
        const ih = img.height * scale;
        ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);

        // White banner strip at top
        const bannerH = h * 0.18;
        ctx.fillStyle = "rgba(255,255,255,0.94)";
        ctx.fillRect(0, 0, w, bannerH);

        // Thin accent line
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, bannerH, w, 2);

        const headSize = Math.min(w / 13, 36);
        ctx.textAlign = "center";
        ctx.fillStyle = "#1a1a1a";
        ctx.font = `bold ${headSize}px "Playfair Display", "Georgia", serif`;
        ctx.fillText(headline, w / 2, bannerH / 2 + headSize / 3, w - 48);

        // CTA strip at bottom
        if (ctaText) {
          const ctaH = 44;
          ctx.fillStyle = "rgba(255,255,255,0.94)";
          ctx.fillRect(0, h - ctaH, w, ctaH);
          ctx.fillStyle = "#1a1a1a";
          ctx.fillRect(0, h - ctaH, w, 2);
          ctx.font = `600 ${Math.min(w / 30, 13)}px "Source Sans 3", sans-serif`;
          ctx.fillText(ctaText.toUpperCase(), w / 2, h - ctaH / 2 + 5);
        }
        break;
      }
      case "split": {
        // Left: white panel with text. Right: image
        const splitX = w * 0.42;

        // Left panel
        ctx.fillStyle = "#faf9f6";
        ctx.fillRect(0, 0, splitX, h);

        // Right image
        const imgW = w - splitX;
        const scale = Math.max(imgW / img.width, h / img.height);
        const iw = img.width * scale;
        const ih = img.height * scale;
        ctx.save();
        ctx.beginPath();
        ctx.rect(splitX, 0, imgW, h);
        ctx.clip();
        ctx.drawImage(img, splitX + (imgW - iw) / 2, (h - ih) / 2, iw, ih);
        ctx.restore();

        // Thin vertical divider
        ctx.fillStyle = "#e0ddd8";
        ctx.fillRect(splitX - 1, 0, 1, h);

        // Headline on left
        const headSize = Math.min(splitX / 5, 36);
        ctx.textAlign = "left";
        ctx.fillStyle = "#1a1a1a";
        ctx.font = `bold ${headSize}px "Playfair Display", "Georgia", serif`;
        wrapText(ctx, headline, 28, h * 0.25, splitX - 56, headSize * 1.2);

        // Subheadline
        if (subheadline) {
          ctx.font = `${Math.min(splitX / 12, 15)}px "Source Sans 3", sans-serif`;
          ctx.fillStyle = "#777";
          wrapText(ctx, subheadline, 28, h * 0.62, splitX - 56, 20);
        }

        // CTA at bottom of left panel
        if (ctaText) {
          ctx.fillStyle = "#1a1a1a";
          ctx.font = `600 ${Math.min(splitX / 12, 13)}px "Source Sans 3", sans-serif`;
          ctx.fillText(ctaText.toUpperCase(), 28, h - 32);
          // Underline
          const tw = ctx.measureText(ctaText.toUpperCase()).width;
          ctx.fillRect(28, h - 28, tw, 1);
        }
        break;
      }
      case "quote": {
        // Full bleed image with elegant white quote card overlay
        const scale = Math.max(w / img.width, h / img.height);
        const iw = img.width * scale;
        const ih = img.height * scale;
        ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);

        // Soft light overlay
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(0, 0, w, h);

        // White quote card in center
        const cardW = w * 0.78;
        const cardH = h * 0.42;
        const cardX = (w - cardW) / 2;
        const cardY = (h - cardH) / 2;
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 4);
        ctx.fill();

        // Quote mark
        const quoteSize = Math.min(w / 6, 72);
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.font = `bold ${quoteSize}px "Playfair Display", "Georgia", serif`;
        ctx.fillText("\u201C", w / 2, cardY + quoteSize * 0.7);

        // Quote text
        const headSize = Math.min(w / 16, 28);
        ctx.fillStyle = "#1a1a1a";
        ctx.font = `italic ${headSize}px "Playfair Display", "Georgia", serif`;
        wrapText(ctx, headline, w / 2, cardY + cardH * 0.45, cardW - 56, headSize * 1.3);

        // Attribution
        if (subheadline) {
          ctx.font = `${Math.min(w / 30, 13)}px "Source Sans 3", sans-serif`;
          ctx.fillStyle = "#888";
          ctx.fillText(`— ${subheadline}`, w / 2, cardY + cardH - 24, cardW - 56);
        }
        break;
      }
    }
  };

  const drawOverlay = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // For placeholder only — minimal text
    if (!selectedHeadline) return;
    const headSize = Math.min(w / 10, 48);
    ctx.textAlign = "center";
    ctx.fillStyle = "#1a1a1a";
    ctx.font = `bold ${headSize}px "Playfair Display", "Georgia", serif`;
    wrapText(ctx, selectedHeadline, w / 2, h * 0.35, w - 60, headSize * 1.15);
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line.trim(), x, currentY);
        line = word + " ";
        currentY += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
  };

  // Save visual asset
  const handleSave = async (approve = false) => {
    setSaving(true);
    const payload = {
      job_id: job.id,
      related_output_id: socialOutputs?.[0]?.id || null,
      image_url: imageUrl,
      overlay_headline: selectedHeadline,
      overlay_subheadline: subheadline || null,
      cta_text: ctaText || null,
      template_name: template,
      platform,
      approved: approve,
    };

    const { error } = await (supabase as any).from("visual_assets").insert(payload);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    toast({ title: approve ? "Visual approved & saved" : "Draft saved" });
    await supabase.from("activity_log").insert({
      job_id: job.id,
      action_type: approve ? "visual_approved" : "visual_draft_saved",
      details: `${platform} - ${template} template`,
    });
    qc.invalidateQueries({ queryKey: ["visual-assets", job.id] });
    onRefresh();
    setSaving(false);

    // Auto-push to live site immediately on Approve
    if (approve) {
      await publish();
    }
  };

  const handleApproveExisting = async (assetId: string) => {
    await (supabase as any).from("visual_assets").update({ approved: true }).eq("id", assetId);
    toast({ title: "Visual approved" });
    qc.invalidateQueries({ queryKey: ["visual-assets", job.id] });
  };

  // Make a specific asset the unambiguous live winner, then publish
  const handlePushToLive = async (assetId: string) => {
    // Demote all other approved visuals for this job
    await (supabase as any)
      .from("visual_assets")
      .update({ approved: false })
      .eq("job_id", job.id)
      .neq("id", assetId);
    // Promote this one
    await (supabase as any)
      .from("visual_assets")
      .update({ approved: true })
      .eq("id", assetId);
    // Bump created_at so latest-approved tiebreakers prefer it too
    await (supabase as any)
      .from("visual_assets")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", assetId);
    qc.invalidateQueries({ queryKey: ["visual-assets", job.id] });
    await publish();
  };

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Product Image</h3>
        </div>
        <div className="border border-dashed rounded-sm p-6 text-center bg-card">
          {imageUrl ? (
            <div className="space-y-3">
              <img
                src={imageUrl}
                alt="Product"
                className="max-h-40 mx-auto rounded-sm object-cover"
              />
              <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                <Upload className="h-3 w-3" /> Replace image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          ) : (
            <label className="cursor-pointer space-y-2 block">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {uploading ? "Uploading…" : "Click to upload product image"}
              </p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          )}
        </div>
      </section>

      {/* Headline Generation */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Overlay Headlines</h3>
          </div>
          <Button size="sm" variant="outline" onClick={handleGenerateHeadlines} disabled={generating}>
            <RefreshCw className={cn("mr-2 h-3 w-3", generating && "animate-spin")} />
            {headlines.length ? "Regenerate" : "Generate"}
          </Button>
        </div>

        {headlines.length > 0 && (
          <div className="grid gap-2">
            {headlines.map((h, i) => (
              <button
                key={i}
                onClick={() => setSelectedHeadline(h)}
                className={cn(
                  "text-left text-sm p-3 rounded-sm border transition-colors",
                  selectedHeadline === h
                    ? "border-foreground bg-foreground/5 font-medium"
                    : "border-border hover:border-foreground/30"
                )}
              >
                {h}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs">Selected Headline</Label>
          <Input
            value={selectedHeadline}
            onChange={(e) => setSelectedHeadline(e.target.value)}
            placeholder="Type or select a headline…"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Subheadline (optional)</Label>
            <Input
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              placeholder="Supporting text…"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">CTA Text</Label>
            <Input
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Learn More"
            />
          </div>
        </div>
      </section>

      {/* Template & Platform Selectors */}
      <div className="grid grid-cols-2 gap-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Template</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.key}
                onClick={() => setTemplate(t.key)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-sm border text-xs transition-colors",
                  template === t.key
                    ? "border-foreground bg-foreground/5 font-medium"
                    : "border-border hover:border-foreground/30"
                )}
              >
                <span className="text-lg">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Platform</h3>
          </div>
          <div className="space-y-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPlatform(p.key)}
                className={cn(
                  "w-full text-left text-sm p-3 rounded-sm border transition-colors flex justify-between",
                  platform === p.key
                    ? "border-foreground bg-foreground/5 font-medium"
                    : "border-border hover:border-foreground/30"
                )}
              >
                <span>{p.label}</span>
                <span className="text-muted-foreground">{p.aspect}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Preview */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Preview</h3>
          <Badge variant="outline" className="text-[10px]">
            {currentPlatform.width}×{currentPlatform.height}
          </Badge>
        </div>
        <div className="flex justify-center bg-muted/50 p-4 rounded-sm border">
          <canvas
            ref={canvasRef}
            className="rounded-sm shadow-sm"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-2 border-t">
        <Button onClick={() => handleSave(false)} disabled={saving || !selectedHeadline}>
          <Save className="mr-2 h-4 w-4" /> Save Draft
        </Button>
        <Button
          variant="default"
          onClick={() => handleSave(true)}
          disabled={saving || publishing || !selectedHeadline || !imageUrl}
        >
          <CheckCircle className="mr-2 h-4 w-4" /> Approve & Push Live
        </Button>
        <Button variant="outline" onClick={publish} disabled={publishing}>
          <Globe className={cn("mr-2 h-4 w-4", publishing && "animate-spin")} />
          {publishing ? "Updating…" : "Re-sync Live Site"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        <strong>Approve & Push Live</strong> saves the new visual and immediately updates the public page. Use <strong>Re-sync</strong> to re-push without changes.
      </p>

      {/* Existing Assets */}
      {assets && assets.length > 0 && (
        <section className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-semibold text-foreground">Saved Visuals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assets.map((asset: any) => {
              const isLive = !!liveEdition?.og_image && !!asset.image_url &&
                liveEdition.og_image.split("?")[0].endsWith(asset.image_url.split("?")[0].split("/").pop() || "___nope___");
              return (
              <div
                key={asset.id}
                className={cn(
                  "border rounded-sm p-3 bg-card space-y-2",
                  isLive && "border-foreground"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium capitalize">
                    {asset.platform} · {asset.template_name}
                  </span>
                  <div className="flex items-center gap-1">
                    {isLive && (
                      <Badge className="text-[10px] font-medium bg-foreground text-background">
                        ● Live
                      </Badge>
                    )}
                    {asset.approved ? (
                      <Badge variant="outline" className="text-[10px] font-medium">
                        ✓ Approved
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs"
                        onClick={() => handleApproveExisting(asset.id)}
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm font-medium leading-snug">{asset.overlay_headline}</p>
                {asset.overlay_subheadline && (
                  <p className="text-xs text-muted-foreground">{asset.overlay_subheadline}</p>
                )}
                {asset.image_url && !isLive && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs w-full mt-1"
                    disabled={publishing}
                    onClick={() => handlePushToLive(asset.id)}
                  >
                    <Globe className={cn("mr-2 h-3 w-3", publishing && "animate-spin")} />
                    Push this to live
                  </Button>
                )}
              </div>
            );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default StepVisuals;
