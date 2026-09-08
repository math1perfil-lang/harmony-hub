-- unique slug for subdomain routing
CREATE UNIQUE INDEX IF NOT EXISTS houses_slug_key ON public.houses (lower(slug));

ALTER TABLE public.houses ADD COLUMN IF NOT EXISTS cover_image_url text;
ALTER TABLE public.houses ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.houses ADD COLUMN IF NOT EXISTS contact_email text;
ALTER TABLE public.houses ADD COLUMN IF NOT EXISTS contact_phone text;
ALTER TABLE public.houses ADD COLUMN IF NOT EXISTS instagram_url text;

-- house admins can update their own house
CREATE POLICY "House admins can update own house"
ON public.houses FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'house_admin'::app_role, id))
WITH CHECK (public.has_role(auth.uid(), 'house_admin'::app_role, id));

CREATE TABLE public.house_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id uuid NOT NULL REFERENCES public.houses(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.house_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.house_photos TO authenticated;
GRANT ALL ON public.house_photos TO service_role;

ALTER TABLE public.house_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view photos of active houses"
ON public.house_photos FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.houses h WHERE h.id = house_id AND h.is_active = true));

CREATE POLICY "House admins manage own house photos"
ON public.house_photos FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'house_admin'::app_role, house_id))
WITH CHECK (public.has_role(auth.uid(), 'house_admin'::app_role, house_id));

CREATE TRIGGER handle_house_photos_updated_at
BEFORE UPDATE ON public.house_photos
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- self-service house registration
CREATE OR REPLACE FUNCTION public.create_house_with_admin(
  _slug text,
  _name text,
  _description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _house_id uuid;
  _clean_slug text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  _clean_slug := lower(regexp_replace(coalesce(_slug, ''), '[^a-zA-Z0-9-]', '', 'g'));
  IF length(_clean_slug) < 3 THEN
    RAISE EXCEPTION 'invalid slug';
  END IF;

  IF EXISTS (SELECT 1 FROM public.houses WHERE lower(slug) = _clean_slug) THEN
    RAISE EXCEPTION 'slug already taken';
  END IF;

  INSERT INTO public.houses (slug, name, description)
  VALUES (_clean_slug, _name, _description)
  RETURNING id INTO _house_id;

  INSERT INTO public.user_roles (user_id, house_id, role)
  VALUES (auth.uid(), _house_id, 'house_admin')
  ON CONFLICT DO NOTHING;

  RETURN _house_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_house_with_admin(text, text, text) TO authenticated;