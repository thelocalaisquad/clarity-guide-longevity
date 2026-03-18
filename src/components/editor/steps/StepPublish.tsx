import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Send, RefreshCw, Eye } from "lucide-react";

interface Props { job: any; onRefresh: () => void; }

const DESTINATIONS = ["website", "newsletter", "linkedin", "x", "instagram", "reddit", "webhook"];

const StepPublish = ({ job, onRefresh }: Props) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [previewDest, setPreviewDest] = useState<string | null>(null);

  const { data: pubJobs } = useQuery({
    queryKey: ["publishing-jobs", job.id],
    queryFn: async () => {
      const { data } = await supabase.from("publishing_jobs").select("*").eq("job_id", job.id).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: targets } = useQuery({
    queryKey: ["publishing-targets-active"],
    queryFn: async () => {
      const { data } = await supabase.from("publishing_targets").select("*").eq("active", true);
      return data || [];
    },
  });

  const toggle = (d: string) => setSelected((s) => s.includes(d) ? s.filter((x) => x !== d) : [...s, d]);

  const handlePublish = async () => {
    if (selected.length === 0) { toast({ title: "Select at least one destination", variant: "destructive" }); return; }
    setPublishing(true);

    for (const dest of selected) {
      const { error } = await supabase.functions.invoke("trigger-publish-webhook", {
        body: { job_id: job.id, destination: dest },
      });
      if (error) toast({ title: `Error publishing to ${dest}`, description: error.message, variant: "destructive" });
    }

    await supabase.from("content_jobs").update({ status: "publishing" }).eq("id", job.id);
    toast({ title: "Publishing initiated" });
    qc.invalidateQueries({ queryKey: ["publishing-jobs", job.id] });
    onRefresh();
    setPublishing(false);
  };

  const handleRetry = async (pubJobId: string) => {
    const pubJob = pubJobs?.find((p) => p.id === pubJobId);
    if (!pubJob) return;
    await supabase.functions.invoke("trigger-publish-webhook", {
      body: { job_id: job.id, destination: pubJob.destination, publishing_job_id: pubJob.id },
    });
    toast({ title: "Retrying…" });
    qc.invalidateQueries({ queryKey: ["publishing-jobs", job.id] });
  };

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    sent: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Select Destinations</h2>

      <div className="flex flex-wrap gap-2">
        {DESTINATIONS.map((d) => (
          <button
            key={d}
            onClick={() => toggle(d)}
            className={`text-sm px-4 py-2 rounded-md border transition-colors capitalize ${
              selected.includes(d) ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button onClick={handlePublish} disabled={publishing || selected.length === 0}>
          <Send className="mr-2 h-4 w-4" /> {publishing ? "Publishing…" : "Publish Selected"}
        </Button>
      </div>

      {/* Previous publishing jobs */}
      {pubJobs && pubJobs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Publishing History</h3>
          {pubJobs.map((pj) => (
            <div key={pj.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">{pj.destination}</span>
                  <Badge className={`text-xs ${statusColor[pj.status] || ""}`}>{pj.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(pj.created_at).toLocaleString()}</p>
                {pj.error_message && <p className="text-xs text-destructive">{pj.error_message}</p>}
              </div>
              <div className="flex gap-2">
                {pj.payload_json && (
                  <Button size="sm" variant="ghost" onClick={() => setPreviewDest(previewDest === pj.id ? null : pj.id)}>
                    <Eye className="h-3 w-3" />
                  </Button>
                )}
                {pj.status === "failed" && (
                  <Button size="sm" variant="outline" onClick={() => handleRetry(pj.id)}>
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Payload preview */}
          {previewDest && (() => {
            const pj = pubJobs.find((p) => p.id === previewDest);
            if (!pj?.payload_json) return null;
            return (
              <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-64">
                {JSON.stringify(pj.payload_json, null, 2)}
              </pre>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default StepPublish;
