import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, RefreshCw, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAutosave } from "@/hooks/useAutosave";

interface Props { job: any; onRefresh: () => void; }

const CHANNELS = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "x_thread", label: "X Thread" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
  { key: "pinterest", label: "Pinterest" },
  { key: "reddit", label: "Reddit" },
  { key: "quote_card", label: "Quote Card" },
  { key: "clip_title", label: "Clip Titles" },
];

const StepSocial = ({ job, onRefresh }: Props) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("linkedin");
  const [generating, setGenerating] = useState<string | null>(null);

  const { data: outputs } = useQuery({
    queryKey: ["content-output-social", job.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("content_outputs")
        .select("*")
        .eq("job_id", job.id)
        .eq("output_group", "social")
        .order("version", { ascending: false });
      return data || [];
    },
  });

  const getOutput = (channel: string) => outputs?.find((o) => o.channel === channel);

  const handleGenerate = async (channel?: string) => {
    setGenerating(channel || "all");
    const { error } = await supabase.functions.invoke("generate-social", {
      body: { job_id: job.id, channel: channel || undefined },
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Social content generated" });
    qc.invalidateQueries({ queryKey: ["content-output-social", job.id] });
    onRefresh();
    setGenerating(null);
  };

  const handleSave = async (channel: string, body: string) => {
    const output = getOutput(channel);
    if (output) {
      await supabase.from("content_outputs").update({ body }).eq("id", output.id);
    }
    toast({ title: "Saved" });
  };

  const handleApprove = async (channel: string) => {
    const output = getOutput(channel);
    if (output) {
      await supabase.from("content_outputs").update({ approved: true }).eq("id", output.id);
      await supabase.from("activity_log").insert({ job_id: job.id, action_type: `social_${channel}_approved`, details: `${channel} approved` });
      toast({ title: `${channel} approved` });
      qc.invalidateQueries({ queryKey: ["content-output-social", job.id] });
    }
  };

  const currentOutput = getOutput(activeTab);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b overflow-x-auto">
        {CHANNELS.map((ch) => {
          const o = getOutput(ch.key);
          return (
            <button
              key={ch.key}
              onClick={() => setActiveTab(ch.key)}
              className={cn(
                "px-3 py-2 text-xs font-medium border-b-2 -mb-px whitespace-nowrap flex items-center gap-1.5",
                activeTab === ch.key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {o?.approved && <CheckCircle className="h-3 w-3 text-emerald-600" />}
              {ch.label}
            </button>
          );
        })}
      </div>

      {currentOutput ? (
        <ChannelEditor
          key={`${activeTab}-${currentOutput.id}`}
          channel={activeTab}
          output={currentOutput}
          onSave={(body) => handleSave(activeTab, body)}
          onApprove={() => handleApprove(activeTab)}
          onRegenerate={() => handleGenerate(activeTab)}
          generating={generating === activeTab}
        />
      ) : (
        <div className="text-center py-8 border border-dashed rounded-md space-y-4">
          <p className="text-muted-foreground text-sm">No {activeTab} content yet.</p>
          <Button onClick={() => handleGenerate(activeTab)} disabled={!!generating} size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`} /> Generate
          </Button>
        </div>
      )}

      <div className="pt-4 border-t">
        <Button variant="outline" onClick={() => handleGenerate()} disabled={!!generating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${generating === "all" ? "animate-spin" : ""}`} /> Generate All Channels
        </Button>
      </div>
    </div>
  );
};

function ChannelEditor({ channel, output, onSave, onApprove, onRegenerate, generating }: {
  channel: string; output: any; onSave: (body: string) => void; onApprove: () => void; onRegenerate: () => void; generating: boolean;
}) {
  const [body, setBody] = useState(output.body || "");
  const [autosaved, setAutosaved] = useState(false);

  useEffect(() => {
    setBody(output.body || "");
    setAutosaved(false);
  }, [output.id, output.body]);

  // Autosave
  useAutosave(async () => {
    if (output) {
      await supabase.from("content_outputs").update({ body }).eq("id", output.id);
      setAutosaved(true);
    }
  }, [body], 3000);

  return (
    <div className="space-y-4">
      {autosaved && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Save className="h-3 w-3" /> Autosaved</div>}
      {output.approved && <div className="flex items-center gap-2 text-sm" style={{ color: "hsl(var(--primary))" }}><CheckCircle className="h-4 w-4" /> Approved</div>}
      <Textarea value={body} onChange={(e) => { setBody(e.target.value); setAutosaved(false); }} rows={10} />
      <div className="flex gap-3">
        <Button size="sm" onClick={() => onSave(body)}>Save</Button>
        {!output.approved && <Button size="sm" variant="outline" onClick={onApprove}>Approve</Button>}
        <Button size="sm" variant="outline" onClick={onRegenerate} disabled={generating}>
          <RefreshCw className={`mr-2 h-3 w-3 ${generating ? "animate-spin" : ""}`} /> Regenerate
        </Button>
      </div>
    </div>
  );
}

export default StepSocial;
