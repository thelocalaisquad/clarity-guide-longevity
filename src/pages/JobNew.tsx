import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import EditorLayout from "@/components/editor/EditorLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEditorAuth } from "@/hooks/useEditorAuth";

const JobNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useEditorAuth();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content_type: "newsletter",
    guest_name: "",
    product_name: "",
    target_audience: "",
    primary_cta_label: "",
    primary_cta_url: "",
    secondary_cta_label: "",
    secondary_cta_url: "",
    tags: "",
    internal_notes: "",
    transcript_text: "",
    video_url: "",
    research_notes: "",
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async (andProcess: boolean) => {
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setSaving(true);

    const { data: job, error: jobErr } = await supabase
      .from("content_jobs")
      .insert({
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
        owner_id: session?.user?.id ?? null,
        status: andProcess ? "processing" : "new",
      })
      .select()
      .single();

    if (jobErr || !job) {
      toast({ title: "Error creating job", description: jobErr?.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    // Create content source
    if (form.transcript_text || form.video_url || form.research_notes) {
      await supabase.from("content_sources").insert({
        job_id: job.id,
        transcript_text: form.transcript_text || null,
        video_url: form.video_url || null,
        research_notes: form.research_notes || null,
        source_status: "uploaded",
      });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      job_id: job.id,
      user_id: session?.user?.id ?? null,
      action_type: "job_created",
      details: `Job "${form.title}" created`,
    });

    if (andProcess) {
      // Call process-content edge function
      const { error: fnErr } = await supabase.functions.invoke("process-content", {
        body: { job_id: job.id },
      });
      if (fnErr) {
        toast({ title: "Processing started with errors", description: fnErr.message, variant: "destructive" });
      }
    }

    toast({ title: "Job created successfully" });
    navigate(`/jobs/${job.id}`);
    setSaving(false);
  };

  return (
    <EditorLayout>
      <div className="max-w-3xl space-y-8">
        <h1 className="text-2xl font-semibold text-foreground">Create New Content Job</h1>

        <div className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-foreground border-b pb-2">Basic Info</h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Red Light Therapy Deep Dive" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <select
                    value={form.content_type}
                    onChange={(e) => set("content_type", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="newsletter">Newsletter</option>
                    <option value="article">Article</option>
                    <option value="podcast">Podcast</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Guest Name</Label>
                  <Input value={form.guest_name} onChange={(e) => set("guest_name", e.target.value)} placeholder="Dr. Jane Smith" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input value={form.product_name} onChange={(e) => set("product_name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Input value={form.target_audience} onChange={(e) => set("target_audience", e.target.value)} placeholder="Home users, Clinic operators" />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-foreground border-b pb-2">Source Materials</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Transcript</Label>
                <Textarea value={form.transcript_text} onChange={(e) => set("transcript_text", e.target.value)} rows={6} placeholder="Paste transcript here…" />
              </div>
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input value={form.video_url} onChange={(e) => set("video_url", e.target.value)} placeholder="https://youtube.com/…" type="url" />
              </div>
              <div className="space-y-2">
                <Label>Research Notes</Label>
                <Textarea value={form.research_notes} onChange={(e) => set("research_notes", e.target.value)} rows={4} placeholder="Any relevant research or context…" />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-foreground border-b pb-2">CTAs & Metadata</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary CTA Label</Label>
                <Input value={form.primary_cta_label} onChange={(e) => set("primary_cta_label", e.target.value)} placeholder="Shop Now" />
              </div>
              <div className="space-y-2">
                <Label>Primary CTA URL</Label>
                <Input value={form.primary_cta_url} onChange={(e) => set("primary_cta_url", e.target.value)} placeholder="https://…" type="url" />
              </div>
              <div className="space-y-2">
                <Label>Secondary CTA Label</Label>
                <Input value={form.secondary_cta_label} onChange={(e) => set("secondary_cta_label", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Secondary CTA URL</Label>
                <Input value={form.secondary_cta_url} onChange={(e) => set("secondary_cta_url", e.target.value)} type="url" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="longevity, red light, recovery" />
            </div>
            <div className="space-y-2">
              <Label>Internal Notes</Label>
              <Textarea value={form.internal_notes} onChange={(e) => set("internal_notes", e.target.value)} rows={3} />
            </div>
          </section>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
            Save & Process
          </Button>
        </div>
      </div>
    </EditorLayout>
  );
};

export default JobNew;
