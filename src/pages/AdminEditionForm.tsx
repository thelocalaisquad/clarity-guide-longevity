import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const editionSchema = z.object({
  edition_number: z.string().min(1, "Required"),
  title: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  published_date: z.string().min(1, "Required"),
  author: z.string().min(1, "Required"),
  read_time: z.string().min(1, "Required"),
  meta_description: z.string().optional(),
  lead_summary: z.string().optional(),
  lead_summary_plain: z.string().optional(),
  body_html: z.string().optional(),
  video_embed_url: z.string().optional(),
  video_caption: z.string().optional(),
  video_title: z.string().optional(),
  expert_name: z.string().optional(),
  expert_title: z.string().optional(),
  expert_credential: z.string().optional(),
  expert_photo_url: z.string().optional(),
  product_name: z.string().optional(),
  product_description: z.string().optional(),
  product_price_range: z.string().optional(),
  product_image_url: z.string().optional(),
  product_image_alt: z.string().optional(),
  product_cta_url: z.string().optional(),
  canonical_url: z.string().optional(),
  og_image: z.string().optional(),
  is_published: z.boolean(),
  faqs: z.array(faqSchema),
});

type EditionFormData = z.infer<typeof editionSchema>;

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const AdminEditionForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const form = useForm<EditionFormData>({
    resolver: zodResolver(editionSchema),
    defaultValues: {
      edition_number: "",
      title: "",
      slug: "",
      category: "Recovery",
      published_date: new Date().toISOString().split("T")[0],
      author: "",
      read_time: "5 min",
      meta_description: "",
      lead_summary: "",
      lead_summary_plain: "",
      body_html: "",
      video_embed_url: "",
      video_caption: "",
      video_title: "",
      expert_name: "",
      expert_title: "",
      expert_credential: "",
      expert_photo_url: "",
      product_name: "",
      product_description: "",
      product_price_range: "",
      product_image_url: "",
      product_image_alt: "",
      product_cta_url: "",
      canonical_url: "",
      og_image: "",
      is_published: false,
      faqs: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "faqs" });

  // Auto-generate slug from title
  const watchTitle = form.watch("title");
  useEffect(() => {
    if (!isEdit && watchTitle) {
      form.setValue("slug", slugify(watchTitle));
    }
  }, [watchTitle, isEdit, form]);

  // Load existing edition for edit
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from("editions").select("*").eq("id", id).single();
      if (error || !data) {
        toast({ title: "Edition not found", variant: "destructive" });
        navigate("/admin/editions");
        return;
      }
      const faqs = Array.isArray(data.faqs) ? (data.faqs as { question: string; answer: string }[]) : [];
      form.reset({
        ...data,
        published_date: data.published_date ?? new Date().toISOString().split("T")[0],
        meta_description: data.meta_description ?? "",
        lead_summary: data.lead_summary ?? "",
        lead_summary_plain: data.lead_summary_plain ?? "",
        body_html: data.body_html ?? "",
        video_embed_url: data.video_embed_url ?? "",
        video_caption: data.video_caption ?? "",
        video_title: data.video_title ?? "",
        expert_name: data.expert_name ?? "",
        expert_title: data.expert_title ?? "",
        expert_credential: data.expert_credential ?? "",
        expert_photo_url: data.expert_photo_url ?? "",
        product_name: data.product_name ?? "",
        product_description: data.product_description ?? "",
        product_price_range: data.product_price_range ?? "",
        product_image_url: data.product_image_url ?? "",
        product_image_alt: data.product_image_alt ?? "",
        product_cta_url: data.product_cta_url ?? "",
        canonical_url: data.canonical_url ?? "",
        og_image: data.og_image ?? "",
        faqs,
      });
    })();
  }, [id]);

  const onSubmit = async (values: EditionFormData) => {
    setSaving(true);
    const payload = {
      ...values,
      faqs: values.faqs as unknown as { question: string; answer: string }[],
    } as any;

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("editions").update(payload).eq("id", id!));
    } else {
      ({ error } = await supabase.from("editions").insert(payload));
    }
    setSaving(false);

    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isEdit ? "Edition updated" : "Edition created" });
      navigate("/admin/editions");
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <fieldset className="space-y-4 border border-border rounded-sm p-4">
      <legend className="font-serif text-lg font-semibold text-foreground px-2">{title}</legend>
      {children}
    </fieldset>
  );

  const Field = ({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) => (
    <div className={span ? "col-span-full" : ""}>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/editions"><ArrowLeft size={16} /></Link>
        </Button>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          {isEdit ? "Edit Edition" : "New Edition"}
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basics */}
        <Section title="Edition Basics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Edition Number">
              <Input {...form.register("edition_number")} placeholder="001" />
            </Field>
            <Field label="Category">
              <Input {...form.register("category")} placeholder="Recovery" />
            </Field>
            <Field label="Read Time">
              <Input {...form.register("read_time")} placeholder="8 min" />
            </Field>
            <Field label="Title" span>
              <Input {...form.register("title")} placeholder="The Science Behind…" />
            </Field>
            <Field label="Slug" span>
              <Input {...form.register("slug")} placeholder="auto-generated-from-title" />
            </Field>
            <Field label="Author">
              <Input {...form.register("author")} placeholder="Dr. Sarah Mitchell" />
            </Field>
            <Field label="Published Date">
              <Input type="date" {...form.register("published_date")} />
            </Field>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                checked={form.watch("is_published")}
                onCheckedChange={(v) => form.setValue("is_published", v)}
              />
              <Label>Published</Label>
            </div>
          </div>
        </Section>

        {/* Lead Summary */}
        <Section title="Lead Summary">
          <Field label="Lead Summary (HTML)" span>
            <Textarea rows={4} {...form.register("lead_summary")} placeholder="<strong>Bold opener…</strong> rest of summary" />
          </Field>
          <Field label="Lead Summary (Plain text)" span>
            <Textarea rows={3} {...form.register("lead_summary_plain")} placeholder="Plain text version for social sharing" />
          </Field>
        </Section>

        {/* Video */}
        <Section title="Video">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Embed URL" span>
              <Input {...form.register("video_embed_url")} placeholder="https://www.youtube.com/embed/…" />
            </Field>
            <Field label="Video Title">
              <Input {...form.register("video_title")} />
            </Field>
            <Field label="Caption">
              <Input {...form.register("video_caption")} />
            </Field>
          </div>
        </Section>

        {/* Expert */}
        <Section title="Expert Callout">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name">
              <Input {...form.register("expert_name")} />
            </Field>
            <Field label="Title / Credentials Line">
              <Input {...form.register("expert_title")} />
            </Field>
            <Field label="Quote / Credential" span>
              <Textarea rows={2} {...form.register("expert_credential")} />
            </Field>
            <Field label="Photo URL">
              <Input {...form.register("expert_photo_url")} />
            </Field>
          </div>
        </Section>

        {/* Body */}
        <Section title="Body Content">
          <Field label="Article Body (HTML)" span>
            <Textarea rows={12} {...form.register("body_html")} placeholder="<h2>Section…</h2><p>…</p>" className="font-mono text-xs" />
          </Field>
        </Section>

        {/* Product */}
        <Section title="Product Spotlight">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Product Name">
              <Input {...form.register("product_name")} />
            </Field>
            <Field label="Price Range">
              <Input {...form.register("product_price_range")} placeholder="$5,299 – $6,499" />
            </Field>
            <Field label="Description" span>
              <Textarea rows={3} {...form.register("product_description")} />
            </Field>
            <Field label="Image URL">
              <Input {...form.register("product_image_url")} />
            </Field>
            <Field label="Image Alt Text">
              <Input {...form.register("product_image_alt")} />
            </Field>
            <Field label="CTA URL" span>
              <Input {...form.register("product_cta_url")} placeholder="https://…" />
            </Field>
          </div>
        </Section>

        {/* FAQs */}
        <Section title="FAQs">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-2 border-b border-border pb-4 mb-4">
              <div className="flex justify-between items-start">
                <Field label={`Question ${index + 1}`} span>
                  <Input {...form.register(`faqs.${index}.question`)} />
                </Field>
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="mt-5 ml-2 shrink-0">
                  <Trash2 size={14} />
                </Button>
              </div>
              <Field label="Answer" span>
                <Textarea rows={2} {...form.register(`faqs.${index}.answer`)} />
              </Field>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ question: "", answer: "" })}>
            <Plus size={14} /> Add FAQ
          </Button>
        </Section>

        {/* SEO */}
        <Section title="SEO">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Meta Description" span>
              <Textarea rows={2} {...form.register("meta_description")} />
            </Field>
            <Field label="Canonical URL">
              <Input {...form.register("canonical_url")} />
            </Field>
            <Field label="OG Image URL">
              <Input {...form.register("og_image")} />
            </Field>
          </div>
        </Section>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Update Edition" : "Create Edition"}
          </Button>
          {isEdit && form.watch("is_published") && (
            <Button type="button" variant="outline" asChild>
              <Link to={`/editions/${form.watch("slug")}`} target="_blank">
                <Eye size={14} /> Preview
              </Link>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminEditionForm;
