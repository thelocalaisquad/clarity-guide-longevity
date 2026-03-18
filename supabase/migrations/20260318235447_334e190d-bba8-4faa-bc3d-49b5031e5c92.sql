
-- Create storage bucket for transcript files
INSERT INTO storage.buckets (id, name, public)
VALUES ('transcripts', 'transcripts', false);

-- RLS: editors can upload and read transcripts
CREATE POLICY "Editors can upload transcripts"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'transcripts' AND public.is_editor_or_admin(auth.uid())
);

CREATE POLICY "Editors can read transcripts"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'transcripts' AND public.is_editor_or_admin(auth.uid())
);

CREATE POLICY "Editors can delete transcripts"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'transcripts' AND public.is_editor_or_admin(auth.uid())
);
