import { supabase } from '@/integrations/supabase/client';

const BUCKET = 'house-media';
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Uploads a file inside the house folder and returns a long-lived URL. */
export async function uploadHouseImage(houseId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${houseId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, TEN_YEARS);
  if (signError || !data?.signedUrl) throw signError ?? new Error('Falha ao gerar link da imagem');

  return data.signedUrl;
}
