
-- Technologies table
CREATE TABLE public.technologies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  how_it_works TEXT,
  evidence TEXT,
  individual_use TEXT,
  operator_use TEXT,
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  technology_id UUID REFERENCES public.technologies(id) ON DELETE SET NULL,
  description TEXT,
  is_commercial BOOLEAN NOT NULL DEFAULT false,
  specs JSONB DEFAULT '[]'::jsonb,
  installation_notes TEXT,
  safety_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  youtube_url TEXT NOT NULL,
  summary TEXT,
  transcript TEXT,
  audience_label TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Video-technology junction
CREATE TABLE public.video_technologies (
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  technology_id UUID REFERENCES public.technologies(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (video_id, technology_id)
);

-- Operator pages table
CREATE TABLE public.operator_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Operator page - technology junction
CREATE TABLE public.operator_page_technologies (
  operator_page_id UUID REFERENCES public.operator_pages(id) ON DELETE CASCADE NOT NULL,
  technology_id UUID REFERENCES public.technologies(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (operator_page_id, technology_id)
);

-- Comparison pages table
CREATE TABLE public.comparison_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Comparison page - technology junction
CREATE TABLE public.comparison_page_technologies (
  comparison_page_id UUID REFERENCES public.comparison_pages(id) ON DELETE CASCADE NOT NULL,
  technology_id UUID REFERENCES public.technologies(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (comparison_page_id, technology_id)
);

-- Enable RLS on all tables (public read, admin write later)
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_page_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_page_technologies ENABLE ROW LEVEL SECURITY;

-- Public read policies (content is public-facing)
CREATE POLICY "Public read technologies" ON public.technologies FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public read video_technologies" ON public.video_technologies FOR SELECT USING (true);
CREATE POLICY "Public read operator_pages" ON public.operator_pages FOR SELECT USING (true);
CREATE POLICY "Public read operator_page_technologies" ON public.operator_page_technologies FOR SELECT USING (true);
CREATE POLICY "Public read comparison_pages" ON public.comparison_pages FOR SELECT USING (true);
CREATE POLICY "Public read comparison_page_technologies" ON public.comparison_page_technologies FOR SELECT USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_technologies_updated_at BEFORE UPDATE ON public.technologies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_operator_pages_updated_at BEFORE UPDATE ON public.operator_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_comparison_pages_updated_at BEFORE UPDATE ON public.comparison_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_products_technology ON public.products(technology_id);
CREATE INDEX idx_products_commercial ON public.products(is_commercial);
