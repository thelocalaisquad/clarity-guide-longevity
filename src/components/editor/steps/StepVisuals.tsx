import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
} from "lucide-react";

interface Props {
  job: any;
  onRefresh: () => void;
}

const TEMPLATES = [
  { key: "center", label: "Center Headline", icon: "⊞" },
  { key: "top_cta", label: "Top + CTA Strip", icon: "▬" },
  { key: "side_panel", label: "Side Panel", icon: "◧" },
  { key: "quote", label: "Quote Overlay", icon: "❝" },
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

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectedHeadline, setSelectedHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [ctaText, setCtaText] = useState(job.primary_cta_label || "Learn More");
  const [template, setTemplate] = useState<TemplateKey>("center");
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

    const { data: urlData } = supabase.storage.from("transcripts").getPublicUrl(path);
    setImageUrl(urlData.publicUrl);
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

    // Background
    ctx.fillStyle = "#141414";
    ctx.fillRect(0, 0, w, h);

    // Draw product image if available
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const scale = Math.max(w / img.width, h / img.height);
        const iw = img.width * scale;
        const ih = img.height * scale;
        ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);

        // Overlay
        drawOverlay(ctx, w, h);
      };
      img.src = imageUrl;
    } else {
      // Placeholder
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#555";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Upload a product image", w / 2, h / 2);
      drawOverlay(ctx, w, h);
    }
  };

  const drawOverlay = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    if (!selectedHeadline && !subheadline && !ctaText) return;

    const headline = selectedHeadline || "Your Headline Here";
    const headlineFontSize = Math.min(w / 12, 40);
    const subFontSize = Math.min(w / 20, 20);
    const ctaFontSize = Math.min(w / 24, 16);

    switch (template) {
      case "center": {
        // Dark gradient overlay
        const grad = ctx.createLinearGradient(0, h * 0.4, 0, h);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, "rgba(0,0,0,0.75)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${headlineFontSize}px sans-serif`;
        wrapText(ctx, headline, w / 2, h * 0.6, w - 60, headlineFontSize * 1.2);

        if (subheadline) {
          ctx.font = `${subFontSize}px sans-serif`;
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.fillText(subheadline, w / 2, h * 0.82, w - 60);
        }
        break;
      }
      case "top_cta": {
        // Top bar
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, w, headlineFontSize * 2.8);

        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${headlineFontSize * 0.9}px sans-serif`;
        ctx.fillText(headline, w / 2, headlineFontSize * 1.8, w - 40);

        // CTA strip at bottom
        if (ctaText) {
          ctx.fillStyle = "#f5f5f5";
          ctx.fillRect(0, h - 50, w, 50);
          ctx.fillStyle = "#141414";
          ctx.font = `bold ${ctaFontSize}px sans-serif`;
          ctx.fillText(ctaText.toUpperCase(), w / 2, h - 20);
        }
        break;
      }
      case "side_panel": {
        // Left panel
        const panelW = w * 0.42;
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, panelW, h);

        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${headlineFontSize * 0.85}px sans-serif`;
        wrapText(ctx, headline, 24, h * 0.35, panelW - 48, headlineFontSize);

        if (subheadline) {
          ctx.font = `${subFontSize * 0.9}px sans-serif`;
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          wrapText(ctx, subheadline, 24, h * 0.6, panelW - 48, subFontSize * 1.2);
        }

        if (ctaText) {
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${ctaFontSize}px sans-serif`;
          ctx.fillText(ctaText.toUpperCase(), 24, h * 0.85);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          const textW = ctx.measureText(ctaText.toUpperCase()).width;
          ctx.beginPath();
          ctx.moveTo(24, h * 0.85 + 4);
          ctx.lineTo(24 + textW, h * 0.85 + 4);
          ctx.stroke();
        }
        break;
      }
      case "quote": {
        // Full dark overlay
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, w, h);

        // Quote marks
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = `bold ${headlineFontSize * 3}px serif`;
        ctx.fillText("\u201C", w / 2, h * 0.32);

        // Headline as quote
        ctx.fillStyle = "#ffffff";
        ctx.font = `italic ${headlineFontSize * 0.95}px serif`;
        wrapText(ctx, headline, w / 2, h * 0.48, w - 80, headlineFontSize * 1.15);

        // Attribution line
        if (subheadline) {
          ctx.font = `${subFontSize * 0.85}px sans-serif`;
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.fillText(`— ${subheadline}`, w / 2, h * 0.78, w - 60);
        }
        break;
      }
    }
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
    } else {
      toast({ title: approve ? "Visual approved & saved" : "Draft saved" });
      await supabase.from("activity_log").insert({
        job_id: job.id,
        action_type: approve ? "visual_approved" : "visual_draft_saved",
        details: `${platform} - ${template} template`,
      });
      qc.invalidateQueries({ queryKey: ["visual-assets", job.id] });
      onRefresh();
    }
    setSaving(false);
  };

  const handleApproveExisting = async (assetId: string) => {
    await (supabase as any).from("visual_assets").update({ approved: true }).eq("id", assetId);
    toast({ title: "Visual approved" });
    qc.invalidateQueries({ queryKey: ["visual-assets", job.id] });
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
      <div className="flex gap-3 pt-2 border-t">
        <Button onClick={() => handleSave(false)} disabled={saving || !selectedHeadline}>
          <Save className="mr-2 h-4 w-4" /> Save Draft
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSave(true)}
          disabled={saving || !selectedHeadline || !imageUrl}
        >
          <CheckCircle className="mr-2 h-4 w-4" /> Approve & Save
        </Button>
      </div>

      {/* Existing Assets */}
      {assets && assets.length > 0 && (
        <section className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-semibold text-foreground">Saved Visuals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assets.map((asset: any) => (
              <div
                key={asset.id}
                className="border rounded-sm p-3 bg-card space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium capitalize">
                    {asset.platform} · {asset.template_name}
                  </span>
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
                <p className="text-sm font-medium leading-snug">{asset.overlay_headline}</p>
                {asset.overlay_subheadline && (
                  <p className="text-xs text-muted-foreground">{asset.overlay_subheadline}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StepVisuals;
