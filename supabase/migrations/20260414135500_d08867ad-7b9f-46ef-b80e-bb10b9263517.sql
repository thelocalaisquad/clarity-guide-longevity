
-- Create editor_settings table (single-row config)
CREATE TABLE public.editor_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auto_publish_enabled boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert default row
INSERT INTO public.editor_settings (id) VALUES (gen_random_uuid());

-- Enable RLS
ALTER TABLE public.editor_settings ENABLE ROW LEVEL SECURITY;

-- Editors/admins can read and update
CREATE POLICY "Editors can read editor_settings"
ON public.editor_settings FOR SELECT
TO authenticated
USING (is_editor_or_admin(auth.uid()));

CREATE POLICY "Editors can update editor_settings"
ON public.editor_settings FOR UPDATE
TO authenticated
USING (is_editor_or_admin(auth.uid()))
WITH CHECK (is_editor_or_admin(auth.uid()));

-- Timestamp trigger
CREATE TRIGGER update_editor_settings_updated_at
BEFORE UPDATE ON public.editor_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Function to check auto-publish on approval changes
CREATE OR REPLACE FUNCTION public.notify_auto_publish()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _job_id uuid;
  _supabase_url text;
  _service_key text;
BEGIN
  -- Only fire when approved changes to true
  IF NEW.approved IS TRUE AND (OLD.approved IS NOT TRUE) THEN
    -- Get job_id
    _job_id := NEW.job_id;
    
    -- Get config
    SELECT decrypted_secret INTO _supabase_url FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL' LIMIT 1;
    SELECT decrypted_secret INTO _service_key FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1;
    
    -- Call edge function via pg_net
    PERFORM extensions.http_post(
      url := _supabase_url || '/functions/v1/check-auto-publish',
      body := jsonb_build_object('job_id', _job_id),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || _service_key
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger on content_outputs
CREATE TRIGGER trg_auto_publish_content_outputs
AFTER UPDATE OF approved ON public.content_outputs
FOR EACH ROW
EXECUTE FUNCTION public.notify_auto_publish();

-- Trigger on content_briefs
CREATE TRIGGER trg_auto_publish_content_briefs
AFTER UPDATE OF approved ON public.content_briefs
FOR EACH ROW
EXECUTE FUNCTION public.notify_auto_publish();
