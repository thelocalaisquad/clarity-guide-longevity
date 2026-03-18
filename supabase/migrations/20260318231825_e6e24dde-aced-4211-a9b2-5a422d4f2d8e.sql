ALTER TABLE public.editions
  ADD COLUMN section_what_is_it text,
  ADD COLUMN section_how_it_works text,
  ADD COLUMN section_why_different text,
  ADD COLUMN section_who_is_it_for text,
  ADD COLUMN raw_information text;