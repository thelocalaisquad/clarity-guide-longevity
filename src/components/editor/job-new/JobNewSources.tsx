import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
  form: Record<string, string>;
  saveField: (key: string, val: string) => void;
}

const JobNewSources = ({ form, saveField }: Props) => (
  <section className="space-y-4">
    <h2 className="text-lg font-medium text-foreground border-b pb-2">Source Materials</h2>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Transcript</Label>
        <Textarea value={form.transcript_text} onChange={(e) => saveField("transcript_text", e.target.value)} rows={6} placeholder="Paste transcript here…" />
      </div>
      <div className="space-y-2">
        <Label>Video URL</Label>
        <Input value={form.video_url} onChange={(e) => saveField("video_url", e.target.value)} placeholder="https://youtube.com/…" type="url" />
      </div>
      <div className="space-y-2">
        <Label>Research Notes</Label>
        <Textarea value={form.research_notes} onChange={(e) => saveField("research_notes", e.target.value)} rows={4} placeholder="Any relevant research or context…" />
      </div>
    </div>
  </section>
);

export default JobNewSources;
