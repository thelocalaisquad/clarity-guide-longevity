import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, RefreshCw } from "lucide-react";

interface Props {
  job: any;
  onRefresh: () => void;
}

const StepBrief = ({ job, onRefresh }: Props) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);

  const { data: brief, isLoading } = useQuery({
    queryKey: ["content-brief", job.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("content_briefs")
        .select("*")
        .eq("job_id", job.id)
        .order("version", { ascending: false })
        .limit(1)
        .single();
      return data;
    },
  });

  const [editForm, setEditForm] = useState<any>(null);

  const startEdit = () => {
    if (brief) {
      setEditForm({
        summary: brief.summary || "",
        newsletter_angle: brief.newsletter_angle || "",
        article_angle: brief.article_angle || "",
      });
      setEditing(true);
    }
  };

  const saveEdit = async () => {
    if (!brief || !editForm) return;
    await supabase.from("content_briefs").update({
      summary: editForm.summary,
      newsletter_angle: editForm.newsletter_angle,
      article_angle: editForm.article_angle,
    }).eq("id", brief.id);
    toast({ title: "Brief updated" });
    setEditing(false);
    qc.invalidateQueries({ queryKey: ["content-brief", job.id] });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const { error } = await supabase.functions.invoke("process-content", { body: { job_id: job.id } });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Brief generated" });
    qc.invalidateQueries({ queryKey: ["content-brief", job.id] });
    onRefresh();
    setGenerating(false);
  };

  const handleApprove = async () => {
    if (!brief) return;
    await supabase.from("content_briefs").update({ approved: true }).eq("id", brief.id);
    await supabase.from("content_jobs").update({ status: "brief_ready" }).eq("id", job.id);
    await supabase.from("activity_log").insert({ job_id: job.id, action_type: "brief_approved", details: "Brief approved" });
    toast({ title: "Brief approved" });
    qc.invalidateQueries({ queryKey: ["content-brief", job.id] });
    onRefresh();
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  if (!brief) {
    return (
      <div className="text-center py-12 border border-dashed rounded-md space-y-4">
        <p className="text-muted-foreground">No brief generated yet.</p>
        <Button onClick={handleGenerate} disabled={generating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`} />
          {generating ? "Generating…" : "Generate Brief"}
        </Button>
      </div>
    );
  }

  const jsonToList = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return []; }
  };

  return (
    <div className="space-y-6">
      {brief.approved && (
        <div className="flex items-center gap-2 text-emerald-600 text-sm">
          <CheckCircle className="h-4 w-4" /> Brief Approved
        </div>
      )}

      {editing ? (
        <div className="space-y-4">
          <div className="space-y-2"><Label>Summary</Label><Textarea value={editForm.summary} onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })} rows={4} /></div>
          <div className="space-y-2"><Label>Newsletter Angle</Label><Textarea value={editForm.newsletter_angle} onChange={(e) => setEditForm({ ...editForm, newsletter_angle: e.target.value })} rows={3} /></div>
          <div className="space-y-2"><Label>Article Angle</Label><Textarea value={editForm.article_angle} onChange={(e) => setEditForm({ ...editForm, article_angle: e.target.value })} rows={3} /></div>
          <div className="flex gap-3">
            <Button onClick={saveEdit}>Save</Button>
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {brief.summary && <div><h3 className="text-sm font-semibold mb-1">Summary</h3><p className="text-sm text-muted-foreground whitespace-pre-wrap">{brief.summary}</p></div>}

          {jsonToList(brief.key_insights).length > 0 && (
            <div><h3 className="text-sm font-semibold mb-1">Key Insights</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">{jsonToList(brief.key_insights).map((i: string, idx: number) => <li key={idx}>{i}</li>)}</ul>
            </div>
          )}

          {jsonToList(brief.key_quotes).length > 0 && (
            <div><h3 className="text-sm font-semibold mb-1">Key Quotes</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">{jsonToList(brief.key_quotes).map((q: string, idx: number) => <li key={idx}>"{q}"</li>)}</ul>
            </div>
          )}

          {jsonToList(brief.headline_options).length > 0 && (
            <div><h3 className="text-sm font-semibold mb-1">Headline Options</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">{jsonToList(brief.headline_options).map((h: string, idx: number) => <li key={idx}>{h}</li>)}</ul>
            </div>
          )}

          {brief.newsletter_angle && <div><h3 className="text-sm font-semibold mb-1">Newsletter Angle</h3><p className="text-sm text-muted-foreground">{brief.newsletter_angle}</p></div>}
          {brief.article_angle && <div><h3 className="text-sm font-semibold mb-1">Article Angle</h3><p className="text-sm text-muted-foreground">{brief.article_angle}</p></div>}

          {jsonToList(brief.social_hooks).length > 0 && (
            <div><h3 className="text-sm font-semibold mb-1">Social Hooks</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">{jsonToList(brief.social_hooks).map((s: string, idx: number) => <li key={idx}>{s}</li>)}</ul>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t">
        {!brief.approved && <Button onClick={handleApprove}>Approve Brief</Button>}
        {!editing && <Button variant="outline" onClick={startEdit}>Edit Brief</Button>}
        <Button variant="outline" onClick={handleGenerate} disabled={generating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`} /> Regenerate
        </Button>
      </div>
    </div>
  );
};

export default StepBrief;
