import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import EditorLayout from "@/components/editor/EditorLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEditorAuth } from "@/hooks/useEditorAuth";
import { Save, Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import JobNewBasicInfo from "@/components/editor/job-new/JobNewBasicInfo";
import JobNewSources from "@/components/editor/job-new/JobNewSources";
import JobNewCtas from "@/components/editor/job-new/JobNewCtas";

const JobNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useEditorAuth();
  const [saving, setSaving] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [suggestingTags, setSuggestingTags] = useState(false);

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

  const set = useCallback((key: string, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
  }, []);

  // Auto-create or auto-update on every field change
  const saveField = useCallback(async (key: string, val: string) => {
    set(key, val);

    const updatedForm = { ...form, [key]: val };

    if (!updatedForm.title.trim() && !jobId) return; // need title to create

    const jobPayload = {
      title: updatedForm.title || "Untitled",
      content_type: updatedForm.content_type,
      guest_name: updatedForm.guest_name || null,
      product_name: updatedForm.product_name || null,
      target_audience: updatedForm.target_audience || null,
      primary_cta_label: updatedForm.primary_cta_label || null,
      primary_cta_url: updatedForm.primary_cta_url || null,
      secondary_cta_label: updatedForm.secondary_cta_label || null,
      secondary_cta_url: updatedForm.secondary_cta_url || null,
      tags: updatedForm.tags ? updatedForm.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      internal_notes: updatedForm.internal_notes || null,
      owner_id: session?.user?.id ?? null,
      status: "new" as const,
    };

    if (!jobId) {
      // Create
      const { data: job, error } = await supabase
        .from("content_jobs")
        .insert(jobPayload)
        .select()
        .single();
      if (error || !job) return;
      setJobId(job.id);
      setLastSaved(new Date());

      // Create source row
      if (updatedForm.transcript_text || updatedForm.video_url || updatedForm.research_notes) {
        await supabase.from("content_sources").insert({
          job_id: job.id,
          transcript_text: updatedForm.transcript_text || null,
          video_url: updatedForm.video_url || null,
          research_notes: updatedForm.research_notes || null,
          source_status: "uploaded",
        });
      }

      await supabase.from("activity_log").insert({
        job_id: job.id,
        user_id: session?.user?.id ?? null,
        action_type: "job_created",
        details: `Job "${updatedForm.title}" created`,
      });
    } else {
      // Update job
      await supabase.from("content_jobs").update(jobPayload).eq("id", jobId);

      // Update or create source
      const sourceFields = ["transcript_text", "video_url", "research_notes"];
      if (sourceFields.includes(key)) {
        const { data: existing } = await supabase
          .from("content_sources")
          .select("id")
          .eq("job_id", jobId)
          .limit(1)
          .single();

        const sourcePayload = {
          transcript_text: updatedForm.transcript_text || null,
          video_url: updatedForm.video_url || null,
          research_notes: updatedForm.research_notes || null,
          source_status: "uploaded" as const,
        };

        if (existing) {
          await supabase.from("content_sources").update(sourcePayload).eq("id", existing.id);
        } else {
          await supabase.from("content_sources").insert({ job_id: jobId, ...sourcePayload });
        }
      }
      setLastSaved(new Date());
    }
  }, [form, jobId, session, set]);

  const handleSuggestTags = async () => {
    setSuggestingTags(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-hashtags", {
        body: {
          title: form.title,
          guest_name: form.guest_name,
          product_name: form.product_name,
          target_audience: form.target_audience,
          transcript_text: form.transcript_text?.slice(0, 500),
          research_notes: form.research_notes?.slice(0, 500),
        },
      });
      if (error) throw error;
      const tags = data?.hashtags || [];
      const newTags = tags.join(", ");
      saveField("tags", form.tags ? `${form.tags}, ${newTags}` : newTags);
      toast({ title: "Hashtags suggested", description: `Added ${tags.length} tags` });
    } catch (e: any) {
      toast({ title: "Error suggesting tags", description: e.message, variant: "destructive" });
    }
    setSuggestingTags(false);
  };

  const handleProcess = async () => {
    if (!jobId) {
      toast({ title: "Save some content first", variant: "destructive" });
      return;
    }
    setSaving(true);
    await supabase.from("content_jobs").update({ status: "processing" }).eq("id", jobId);
    const { error } = await supabase.functions.invoke("process-content", { body: { job_id: jobId } });
    if (error) toast({ title: "Processing error", description: error.message, variant: "destructive" });
    else toast({ title: "Processing started" });
    navigate(`/jobs/${jobId}`);
    setSaving(false);
  };

  return (
    <EditorLayout>
      <div className="max-w-3xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Create Newsletter</h1>
          {lastSaved && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Save className="h-3 w-3" /> Saved {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <JobNewBasicInfo form={form} saveField={saveField} />
          <JobNewSources form={form} saveField={saveField} />
          <JobNewCtas form={form} saveField={saveField} handleSuggestTags={handleSuggestTags} suggestingTags={suggestingTags} />
        </div>

        <div className="flex gap-3 pt-4 border-t">
          {jobId && (
            <Button onClick={handleProcess} disabled={saving}>
              {saving ? "Processing…" : "Save & Process"}
            </Button>
          )}
          {jobId && (
            <Button variant="outline" onClick={() => navigate(`/jobs/${jobId}`)}>
              View Job
            </Button>
          )}
        </div>
      </div>
    </EditorLayout>
  );
};

export default JobNew;
