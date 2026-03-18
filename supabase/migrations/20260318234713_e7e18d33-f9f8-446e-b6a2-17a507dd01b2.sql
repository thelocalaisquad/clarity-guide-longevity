
-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

-- 2. User roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security definer function for role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: check if user is editor or admin
CREATE OR REPLACE FUNCTION public.is_editor_or_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin', 'editor')
  )
$$;

-- RLS on user_roles
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Editors read all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_editor_or_admin(auth.uid()));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Content jobs
CREATE TABLE public.content_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content_type text NOT NULL DEFAULT 'newsletter',
  guest_name text,
  product_name text,
  target_audience text,
  primary_cta_label text,
  primary_cta_url text,
  secondary_cta_label text,
  secondary_cta_url text,
  tags text[] DEFAULT '{}',
  internal_notes text,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.content_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Editors can do everything on content_jobs" ON public.content_jobs FOR ALL TO authenticated USING (public.is_editor_or_admin(auth.uid())) WITH CHECK (public.is_editor_or_admin(auth.uid()));

-- 6. Content sources
CREATE TABLE public.content_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.content_jobs(id) ON DELETE CASCADE NOT NULL,
  transcript_text text,
  transcript_file_url text,
  video_url text,
  research_notes text,
  source_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.content_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Editors can do everything on content_sources" ON public.content_sources FOR ALL TO authenticated USING (public.is_editor_or_admin(auth.uid())) WITH CHECK (public.is_editor_or_admin(auth.uid()));

-- 7. Content briefs
CREATE TABLE public.content_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.content_jobs(id) ON DELETE CASCADE NOT NULL,
  summary text,
  key_insights jsonb DEFAULT '[]',
  key_quotes jsonb DEFAULT '[]',
  angles jsonb DEFAULT '[]',
  headline_options jsonb DEFAULT '[]',
  newsletter_angle text,
  article_angle text,
  social_hooks jsonb DEFAULT '[]',
  approved boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.content_briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Editors can do everything on content_briefs" ON public.content_briefs FOR ALL TO authenticated USING (public.is_editor_or_admin(auth.uid())) WITH CHECK (public.is_editor_or_admin(auth.uid()));

-- 8. Content outputs
CREATE TABLE public.content_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.content_jobs(id) ON DELETE CASCADE NOT NULL,
  output_group text NOT NULL DEFAULT 'newsletter',
  channel text NOT NULL DEFAULT 'email',
  title text,
  body text,
  meta_title text,
  meta_description text,
  slug text,
  approved boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.content_outputs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Editors can do everything on content_outputs" ON public.content_outputs FOR ALL TO authenticated USING (public.is_editor_or_admin(auth.uid())) WITH CHECK (public.is_editor_or_admin(auth.uid()));

-- 9. Publishing targets
CREATE TABLE public.publishing_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  target_type text NOT NULL DEFAULT 'webhook',
  webhook_url text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.publishing_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Editors can do everything on publishing_targets" ON public.publishing_targets FOR ALL TO authenticated USING (public.is_editor_or_admin(auth.uid())) WITH CHECK (public.is_editor_or_admin(auth.uid()));

-- 10. Publishing jobs
CREATE TABLE public.publishing_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.content_jobs(id) ON DELETE CASCADE NOT NULL,
  output_id uuid REFERENCES public.content_outputs(id) ON DELETE SET NULL,
  destination text NOT NULL,
  payload_json jsonb,
  status text NOT NULL DEFAULT 'pending',
  response_code integer,
  response_body text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.publishing_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Editors can do everything on publishing_jobs" ON public.publishing_jobs FOR ALL TO authenticated USING (public.is_editor_or_admin(auth.uid())) WITH CHECK (public.is_editor_or_admin(auth.uid()));

-- 11. Activity log
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.content_jobs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  details text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Editors can do everything on activity_log" ON public.activity_log FOR ALL TO authenticated USING (public.is_editor_or_admin(auth.uid())) WITH CHECK (public.is_editor_or_admin(auth.uid()));

-- Update triggers for updated_at
CREATE TRIGGER update_content_jobs_updated_at BEFORE UPDATE ON public.content_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_content_outputs_updated_at BEFORE UPDATE ON public.content_outputs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_publishing_jobs_updated_at BEFORE UPDATE ON public.publishing_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
