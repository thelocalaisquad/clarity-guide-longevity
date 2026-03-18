import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface Props {
  job: any;
  onRefresh: () => void;
}

const StepIntake = ({ job, onRefresh }: Props) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const { data: source } = useQuery({
    queryKey: ["content-source", job.id],
    queryFn: async () => {
      const { data } = await supabase.from("content_sources").select("*").eq("job_id", job.id).order("created_at", { ascending: false }).limit(1).single();
      return data;
    },
  });

  const [form, setForm] = useState({
    title: job.title,
    content_type: job.content_type,
    guest_name: job.guest_name || "",
    product_name: job.product_name || "",
    target_audience: job.target_audience || "",
    primary_cta_label: job.primary_cta_label || "",
    primary_cta_url: job.primary_cta_url || "",
    secondary_cta_label: job.secondary_cta_label || "",
    secondary_cta_url: job.secondary_cta_url || "",
    tags: (job.tags || []).join(", "),
    internal_notes: job.internal_notes || "",
    transcript_text: "",
    video_url: "",
    research_notes: "",
  });

  useEffect(() => {
    if (source) {
      setForm((f) => ({
        ...f,
        transcript_text: source.transcript_text || "",
        video_url: source.video_url || "",
        research_notes: source.research_notes || "",
      }));
    }
  }, [source]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async (andProcess: boolean) => {
    setSaving(true);
    await supabase.from("content_jobs").update({
      title: form.title,
      content_type: form.content_type,
      guest_name: form.guest_name || null,
      product_name: form.product_name || null,
      target_audience: form.target_audience || null,
      primary_cta_label: form.primary_cta_label || null,
      primary_cta_url: form.primary_cta_url || null,
      secondary_cta_label: form.secondary_cta_label || null,
      secondary_cta_url: form.secondary_cta_url || null,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      internal_notes: form.internal_notes || null,
      status: andProcess ? "processing" : job.status,
    }).eq("id", job.id);

    if (source) {
      await supabase.from("content_sources").update({
        transcript_text: form.transcript_text || null,
        video_url: form.video_url || null,
        research_notes: form.research_notes || null,
      }).eq("id", source.id);
    } else if (form.transcript_text || form.video_url || form.research_notes) {
      await supabase.from("content_sources").insert({
        job_id: job.id,
        transcript_text: form.transcript_text || null,
        video_url: form.video_url || null,
        research_notes: form.research_notes || null,
        source_status: "uploaded",
      });
    }

    if (andProcess) {
      await supabase.functions.invoke("process-content", { body: { job_id: job.id } });
    }

    toast({ title: "Saved" });
    onRefresh();
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Content Type</Label>
            <select value={form.content_type} onChange={(e) => set("content_type", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="newsletter">Newsletter</option><option value="article">Article</option><option value="podcast">Podcast</option><option value="video">Video</option>
            </select>
          </div>
          <div className="space-y-2"><Label>Guest Name</Label><Input value={form.guest_name} onChange={(e) => set("guest_name", e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Product Name</Label><Input value={form.product_name} onChange={(e) => set("product_name", e.target.value)} /></div>
          <div className="space-y-2"><Label>Target Audience</Label><Input value={form.target_audience} onChange={(e) => set("target_audience", e.target.value)} /></div>
        </div>
        <div className="space-y-2"><Label>Transcript</Label><Textarea value={form.transcript_text} onChange={(e) => set("transcript_text", e.target.value)} rows={6} /></div>
        <div className="space-y-2"><Label>Video URL</Label><Input value={form.video_url} onChange={(e) => set("video_url", e.target.value)} type="url" /></div>
        <div className="space-y-2"><Label>Research Notes</Label><Textarea value={form.research_notes} onChange={(e) => set("research_notes", e.target.value)} rows={4} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Primary CTA Label</Label><Input value={form.primary_cta_label} onChange={(e) => set("primary_cta_label", e.target.value)} /></div>
          <div className="space-y-2"><Label>Primary CTA URL</Label><Input value={form.primary_cta_url} onChange={(e) => set("primary_cta_url", e.target.value)} type="url" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Secondary CTA Label</Label><Input value={form.secondary_cta_label} onChange={(e) => set("secondary_cta_label", e.target.value)} /></div>
          <div className="space-y-2"><Label>Secondary CTA URL</Label><Input value={form.secondary_cta_url} onChange={(e) => set("secondary_cta_url", e.target.value)} type="url" /></div>
        </div>
        <div className="space-y-2"><Label>Tags (comma separated)</Label><Input value={form.tags} onChange={(e) => set("tags", e.target.value)} /></div>
        <div className="space-y-2"><Label>Internal Notes</Label><Textarea value={form.internal_notes} onChange={(e) => set("internal_notes", e.target.value)} rows={3} /></div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>Save Draft</Button>
        <Button onClick={() => handleSave(true)} disabled={saving}>Save & Process</Button>
      </div>
    </div>
  );
};

export default StepIntake;
