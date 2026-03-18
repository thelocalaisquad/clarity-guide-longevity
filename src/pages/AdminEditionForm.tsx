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
  // Structured sections
  raw_information: z.string().optional(),
  section_what_is_it: z.string().optional(),
  section_how_it_works: z.string().optional(),
  section_why_different: z.string().optional(),
  section_who_is_it_for: z.string().optional(),
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
      raw_information: "",
      section_what_is_it: "",
      section_how_it_works: "",
      section_why_different: "",
      section_who_is_it_for: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "faqs" });

  const watchTitle = form.watch("title");
  useEffect(() => {
    if (!isEdit && watchTitle) {
      form.setValue("slug", slugify(watchTitle));
    }
  }, [watchTitle, isEdit, form]);

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
        raw_information: data.raw_information ?? "",
        section_what_is_it: data.section_what_is_it ?? "",
        section_how_it_works: data.section_how_it_works ?? "",
        section_why_different: data.section_why_different ?? "",
        section_who_is_it_for: data.section_who_is_it_for ?? "",
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

  const Section = ({ title, children, step }: { title: string; children: React.ReactNode; step?: string }) => (
    <fieldset className="space-y-4 border border-border rounded-sm p-4">
      <legend className="font-serif text-lg font-semibold text-foreground px-2">
        {step && <span className="text-muted-foreground mr-2">{step}</span>}
        {title}
      </legend>
      {children}
    </fieldset>
  );

  const Field = ({ label, children, span, hint }: { label: string; children: React.ReactNode; span?: boolean; hint?: string }) => (
    <div className={span ? "col-span-full" : ""}>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground mb-1.5">{hint}</p>}
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

        {/* Step 1 — Core Content */}
        <Section title="Core Content" step="1">
          <p className="text-sm text-muted-foreground -mt-2">The raw inputs you always upload: video, source material, and product.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Field label="Video Embed URL" span>
              <Input {...form.register("video_embed_url")} placeholder="https://www.youtube.com/embed/…" />
            </Field>
            <Field label="Video Title">
              <Input {...form.register("video_title")} />
            </Field>
            <Field label="Video Caption">
              <Input {...form.register("video_caption")} />
            </Field>
          </div>

          <Field label="Raw Information / Research Notes" span hint="Paste your source material, research, or rough notes here. This won't be published — it's your reference.">
            <Textarea rows={8} {...form.register("raw_information")} placeholder="Paste research, data, interview notes…" className="font-mono text-xs" />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Product Name">
              <Input {...form.register("product_name")} />
            </Field>
            <Field label="Product Price Range">
              <Input {...form.register("product_price_range")} placeholder="$5,299 – $6,499" />
            </Field>
            <Field label="Product Description" span>
              <Textarea rows={3} {...form.register("product_description")} />
            </Field>
            <Field label="Product Image URL">
              <Input {...form.register("product_image_url")} />
            </Field>
            <Field label="Product Image Alt Text">
              <Input {...form.register("product_image_alt")} />
            </Field>
            <Field label="Product CTA URL" span>
              <Input {...form.register("product_cta_url")} placeholder="https://…" />
            </Field>
          </div>
        </Section>

        {/* Step 2 — Structured Sections */}
        <Section title="Structured Sections" step="2">
          <p className="text-sm text-muted-foreground -mt-2">The newsletter body — written in a consistent format every time.</p>

          <Field label="Lead Summary (HTML)" span hint="The bold opening paragraph shown at the top of the edition.">
            <Textarea rows={4} {...form.register("lead_summary")} placeholder="<strong>Bold opener…</strong> rest of summary" />
          </Field>
          <Field label="Lead Summary (Plain text)" span hint="Plain text version for social sharing and previews.">
            <Textarea rows={3} {...form.register("lead_summary_plain")} placeholder="Plain text version for social sharing" />
          </Field>

          <Field label="What Is It?" span hint="Introduce the technology or product. What does it do?">
            <Textarea rows={5} {...form.register("section_what_is_it")} placeholder="<p>This is a…</p>" />
          </Field>
          <Field label="How It Works" span hint="Explain the mechanism. How does the science or technology work?">
            <Textarea rows={5} {...form.register("section_how_it_works")} placeholder="<p>It works by…</p>" />
          </Field>
          <Field label="Why Is It Different?" span hint="What sets this apart from alternatives? Why should readers care?">
            <Textarea rows={5} {...form.register("section_why_different")} placeholder="<p>Unlike other approaches…</p>" />
          </Field>
          <Field label="Who Is It For?" span hint="Target audiences — home users, gym owners, clinics, biohackers…">
            <Textarea rows={5} {...form.register("section_who_is_it_for")} placeholder="<p>This is ideal for…</p>" />
          </Field>

          <Field label="Legacy Body (HTML)" span hint="Optional fallback. If structured sections above are filled, they take priority.">
            <Textarea rows={6} {...form.register("body_html")} placeholder="<h2>Section…</h2><p>…</p>" className="font-mono text-xs" />
          </Field>
        </Section>

        {/* Step 3 — Expert + FAQs */}
        <Section title="Expert + FAQs" step="3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Expert Name">
              <Input {...form.register("expert_name")} />
            </Field>
            <Field label="Expert Title / Credentials Line">
              <Input {...form.register("expert_title")} />
            </Field>
            <Field label="Expert Quote / Credential" span>
              <Textarea rows={2} {...form.register("expert_credential")} />
            </Field>
            <Field label="Expert Photo URL">
              <Input {...form.register("expert_photo_url")} />
            </Field>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <Label className="text-sm font-semibold block mb-3">FAQs</Label>
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
          </div>
        </Section>

        {/* Step 4 — Metadata & SEO */}
        <Section title="Metadata & SEO" step="4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4 mt-4">
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
