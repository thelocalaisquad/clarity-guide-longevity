-- 1. Add source_job_id to editions
ALTER TABLE public.editions
  ADD COLUMN IF NOT EXISTS source_job_id uuid;

CREATE INDEX IF NOT EXISTS idx_editions_source_job_id ON public.editions(source_job_id);

-- 2. Backfill source_job_id from approved content_outputs by slug match
UPDATE public.editions e
SET source_job_id = co.job_id
FROM public.content_outputs co
WHERE e.source_job_id IS NULL
  AND co.slug = e.slug
  AND co.output_group = 'article'
  AND co.approved = true;

-- 3. Trigger function: on visual_assets approval, sync editions.og_image
CREATE OR REPLACE FUNCTION public.sync_edition_og_image_on_visual_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _base_url text;
  _final_url text;
  _supabase_url text;
  _path text;
BEGIN
  -- Only fire when approved transitions to true and we have an image
  IF NEW.approved IS TRUE
     AND (OLD.approved IS DISTINCT FROM NEW.approved)
     AND NEW.image_url IS NOT NULL THEN

    -- Strip existing query string
    _base_url := split_part(NEW.image_url, '?', 1);

    -- Try to normalize signed URLs to public URLs
    SELECT decrypted_secret INTO _supabase_url
    FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL' LIMIT 1;

    IF _supabase_url IS NOT NULL THEN
      -- Match /object/sign/<path> or /object/public/<path>
      _path := substring(_base_url FROM '/object/(?:sign|public)/(.+)$');
      IF _path IS NOT NULL THEN
        _base_url := _supabase_url || '/storage/v1/object/public/' || _path;
      END IF;
    END IF;

    _final_url := _base_url || '?v=' || extract(epoch FROM now())::bigint;

    -- Update all editions tied to this job
    UPDATE public.editions
    SET og_image = _final_url,
        updated_at = now()
    WHERE source_job_id = NEW.job_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_edition_og_image ON public.visual_assets;

CREATE TRIGGER trg_sync_edition_og_image
AFTER INSERT OR UPDATE OF approved ON public.visual_assets
FOR EACH ROW
EXECUTE FUNCTION public.sync_edition_og_image_on_visual_approval();