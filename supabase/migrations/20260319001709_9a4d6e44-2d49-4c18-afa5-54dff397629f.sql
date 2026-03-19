CREATE TABLE public.visual_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.content_jobs(id) ON DELETE CASCADE,
  related_output_id uuid REFERENCES public.content_outputs(id) ON DELETE SET NULL,
  image_url text,
  overlay_headline text,
  overlay_subheadline text,
  cta_text text,
  template_name text NOT NULL DEFAULT 'center',
  platform text NOT NULL DEFAULT 'linkedin',
  output_image_url text,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.visual_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Editors can do everything on visual_assets"
  ON public.visual_assets
  FOR ALL
  TO authenticated
  USING (is_editor_or_admin(auth.uid()))
  WITH CHECK (is_editor_or_admin(auth.uid()));

CREATE TRIGGER update_visual_assets_updated_at
  BEFORE UPDATE ON public.visual_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();