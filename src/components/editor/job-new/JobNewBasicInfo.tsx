import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  form: Record<string, string>;
  saveField: (key: string, val: string) => void;
}

const JobNewBasicInfo = ({ form, saveField }: Props) => (
  <section className="space-y-4">
    <h2 className="text-lg font-medium text-foreground border-b pb-2">Basic Info</h2>
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input value={form.title} onChange={(e) => saveField("title", e.target.value)} placeholder="e.g. Red Light Therapy Deep Dive" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Content Type</Label>
          <select
            value={form.content_type}
            onChange={(e) => saveField("content_type", e.target.value)}
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
          <Input value={form.guest_name} onChange={(e) => saveField("guest_name", e.target.value)} placeholder="Dr. Jane Smith" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Product Name</Label>
          <Input value={form.product_name} onChange={(e) => saveField("product_name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Target Audience</Label>
          <Input value={form.target_audience} onChange={(e) => saveField("target_audience", e.target.value)} placeholder="Home users, Clinic operators" />
        </div>
      </div>
    </div>
  </section>
);

export default JobNewBasicInfo;
