import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, RefreshCw } from "lucide-react";

interface Props { job: any; onRefresh: () => void; }

const StepArticle = ({ job, onRefresh }: Props) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [generating, setGenerating] = useState(false);

  const { data: output } = useQuery({
    queryKey: ["content-output-article", job.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("content_outputs")
        .select("*")
        .eq("job_id", job.id)
        .eq("output_group", "article")
        .order("version", { ascending: false })
        .limit(1)
        .single();
      return data;
    },
  });

  const [form, setForm] = useState({ title: "", body: "", meta_title: "", meta_description: "", slug: "" });

  useState(() => {
    if (output) setForm({ title: output.title || "", body: output.body || "", meta_title: output.meta_title || "", meta_description: output.meta_description || "", slug: output.slug || "" });
  });

  const handleGenerate = async () => {
    setGenerating(true);
    const { error } = await supabase.functions.invoke("generate-article", { body: { job_id: job.id } });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Article generated" });
    qc.invalidateQueries({ queryKey: ["content-output-article", job.id] });
    onRefresh();
    setGenerating(false);
  };

  const handleApprove = async () => {
    if (!output) return;
    await supabase.from("content_outputs").update({ ...form, approved: true }).eq("id", output.id);
    await supabase.from("activity_log").insert({ job_id: job.id, action_type: "article_approved", details: "Article approved" });
    toast({ title: "Article approved" });
    qc.invalidateQueries({ queryKey: ["content-output-article", job.id] });
    onRefresh();
  };

  if (!output) {
    return (
      <div className="text-center py-12 border border-dashed rounded-md space-y-4">
        <p className="text-muted-foreground">No article draft yet.</p>
        <Button onClick={handleGenerate} disabled={generating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`} />
          {generating ? "Generating…" : "Generate Article"}
        </Button>
      </div>
    );
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      {output.approved && <div className="flex items-center gap-2 text-emerald-600 text-sm"><CheckCircle className="h-4 w-4" /> Approved</div>}
      <div className="space-y-2"><Label>SEO Title</Label><Input value={form.meta_title || output.meta_title || ""} onChange={(e) => set("meta_title", e.target.value)} /></div>
      <div className="space-y-2"><Label>Slug</Label><Input value={form.slug || output.slug || ""} onChange={(e) => set("slug", e.target.value)} /></div>
      <div className="space-y-2"><Label>Meta Description</Label><Textarea value={form.meta_description || output.meta_description || ""} onChange={(e) => set("meta_description", e.target.value)} rows={2} /></div>
      <div className="space-y-2"><Label>Title</Label><Input value={form.title || output.title || ""} onChange={(e) => set("title", e.target.value)} /></div>
      <div className="space-y-2"><Label>Article Body</Label><Textarea value={form.body || output.body || ""} onChange={(e) => set("body", e.target.value)} rows={20} /></div>
      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={handleApprove}>Approve</Button>
        <Button variant="outline" onClick={handleGenerate} disabled={generating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`} /> Regenerate
        </Button>
      </div>
    </div>
  );
};

export default StepArticle;
