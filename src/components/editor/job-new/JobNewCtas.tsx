import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface Props {
  form: Record<string, string>;
  saveField: (key: string, val: string) => void;
  handleSuggestTags: () => void;
  suggestingTags: boolean;
}

const JobNewCtas = ({ form, saveField, handleSuggestTags, suggestingTags }: Props) => (
  <section className="space-y-4">
    <h2 className="text-lg font-medium text-foreground border-b pb-2">CTAs & Metadata</h2>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Primary CTA Label</Label>
        <Input value={form.primary_cta_label} onChange={(e) => saveField("primary_cta_label", e.target.value)} placeholder="Shop Now" />
      </div>
      <div className="space-y-2">
        <Label>Primary CTA URL</Label>
        <Input value={form.primary_cta_url} onChange={(e) => saveField("primary_cta_url", e.target.value)} placeholder="https://…" type="url" />
      </div>
      <div className="space-y-2">
        <Label>Secondary CTA Label</Label>
        <Input value={form.secondary_cta_label} onChange={(e) => saveField("secondary_cta_label", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Secondary CTA URL</Label>
        <Input value={form.secondary_cta_url} onChange={(e) => saveField("secondary_cta_url", e.target.value)} type="url" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Tags / Hashtags (comma separated)</Label>
        <Button type="button" variant="ghost" size="sm" onClick={handleSuggestTags} disabled={suggestingTags}>
          {suggestingTags ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5" />}
          Suggest with AI
        </Button>
      </div>
      <Input value={form.tags} onChange={(e) => saveField("tags", e.target.value)} placeholder="longevity, red light, recovery" />
    </div>
    <div className="space-y-2">
      <Label>Internal Notes</Label>
      <Textarea value={form.internal_notes} onChange={(e) => saveField("internal_notes", e.target.value)} rows={3} />
    </div>
  </section>
);

export default JobNewCtas;
