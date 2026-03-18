
-- Create editions table
CREATE TABLE public.editions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_number text NOT NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Recovery',
  published_date date NOT NULL DEFAULT CURRENT_DATE,
  author text NOT NULL DEFAULT '',
  read_time text NOT NULL DEFAULT '5 min',
  meta_description text,
  lead_summary text,
  lead_summary_plain text,
  body_html text,
  video_embed_url text,
  video_caption text,
  video_title text,
  expert_name text,
  expert_title text,
  expert_credential text,
  expert_photo_url text,
  product_name text,
  product_description text,
  product_price_range text,
  product_image_url text,
  product_image_alt text,
  product_cta_url text,
  faqs jsonb DEFAULT '[]'::jsonb,
  canonical_url text,
  og_image text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.editions ENABLE ROW LEVEL SECURITY;

-- Public can read published editions
CREATE POLICY "Public read published editions"
  ON public.editions FOR SELECT
  TO public
  USING (is_published = true);

-- Authenticated users can do everything
CREATE POLICY "Authenticated users full access"
  ON public.editions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER update_editions_updated_at
  BEFORE UPDATE ON public.editions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
