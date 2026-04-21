DROP POLICY IF EXISTS "Authenticated users full access" ON public.editions;

CREATE POLICY "Editors can manage editions"
ON public.editions
FOR ALL
TO authenticated
USING (public.is_editor_or_admin(auth.uid()))
WITH CHECK (public.is_editor_or_admin(auth.uid()));