import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, RefreshCw } from "lucide-react";

interface Props { job: any; onRefresh: () => void; }

const StepNewsletter = ({ job, onRefresh }: Props) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [generating, setGenerating] = useState(false);

  const { data: output } = useQuery({
    queryKey: ["content-output-newsletter", job.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("content_outputs")
        .select("*")
        .eq("job_id", job.id)
        .eq("output_group", "newsletter")
        .order("version", { ascending: false })
        .limit(1)
        .single();
      return data;
    },
  });

  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");

  useState(() => {
    if (output) { setBody(output.body || ""); setTitle(output.title || ""); }
  });

  const handleGenerate = async () => {
    setGenerating(true);
    const { error } = await supabase.functions.invoke("generate-newsletter", { body: { job_id: job.id } });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Newsletter generated" });
    qc.invalidateQueries({ queryKey: ["content-output-newsletter", job.id] });
    onRefresh();
    setGenerating(false);
  };

  const handleSave = async () => {
    if (!output) return;
    await supabase.from("content_outputs").update({ title, body, approved: true }).eq("id", output.id);
    await supabase.from("activity_log").insert({ job_id: job.id, action_type: "newsletter_approved", details: "Newsletter approved" });
    toast({ title: "Newsletter saved & approved" });
    qc.invalidateQueries({ queryKey: ["content-output-newsletter", job.id] });
    onRefresh();
  };

  if (!output) {
    return (
      <div className="text-center py-12 border border-dashed rounded-md space-y-4">
        <p className="text-muted-foreground">No newsletter draft yet.</p>
        <Button onClick={handleGenerate} disabled={generating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`} />
          {generating ? "Generating…" : "Generate Newsletter"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {output.approved && <div className="flex items-center gap-2 text-emerald-600 text-sm"><CheckCircle className="h-4 w-4" /> Approved</div>}
      <div className="space-y-2"><Label>Headline</Label><Textarea value={title || output.title || ""} onChange={(e) => setTitle(e.target.value)} rows={2} /></div>
      <div className="space-y-2"><Label>Body</Label><Textarea value={body || output.body || ""} onChange={(e) => setBody(e.target.value)} rows={16} /></div>
      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={handleSave}>Save Approved Version</Button>
        <Button variant="outline" onClick={handleGenerate} disabled={generating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`} /> Regenerate
        </Button>
      </div>
    </div>
  );
};

export default StepNewsletter;
