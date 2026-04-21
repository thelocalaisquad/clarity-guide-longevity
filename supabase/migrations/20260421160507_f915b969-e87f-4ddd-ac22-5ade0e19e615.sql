DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'visual_assets'
      AND policyname = 'Public can read approved visual assets'
  ) THEN
    CREATE POLICY "Public can read approved visual assets"
    ON public.visual_assets
    FOR SELECT
    TO public
    USING (approved = true);
  END IF;
END $$;

DROP TRIGGER IF EXISTS trg_sync_edition_og_image ON public.visual_assets;

CREATE TRIGGER trg_sync_edition_og_image
AFTER INSERT OR UPDATE OF approved ON public.visual_assets
FOR EACH ROW
EXECUTE FUNCTION public.sync_edition_og_image_on_visual_approval();