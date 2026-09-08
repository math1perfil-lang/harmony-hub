CREATE POLICY "Anyone can view house media"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'house-media');

CREATE POLICY "House admins can upload own house media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'house-media'
  AND public.has_role(auth.uid(), 'house_admin'::app_role, ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "House admins can update own house media"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'house-media'
  AND public.has_role(auth.uid(), 'house_admin'::app_role, ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "House admins can delete own house media"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'house-media'
  AND public.has_role(auth.uid(), 'house_admin'::app_role, ((storage.foldername(name))[1])::uuid)
);