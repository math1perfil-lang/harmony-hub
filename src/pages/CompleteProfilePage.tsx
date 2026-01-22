import { useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useHouse } from '@/contexts/HouseContext';
import { supabase } from '@/integrations/supabase/client';
import type { ProfileType, IdentityType, InteractionPreference } from '@/types/database';

const profileSchema = z.object({
  nickname: z.string().trim().min(2, 'Apelido muito curto').max(40),
  profileType: z.enum(['individual', 'couple']),
  age: z.coerce.number().int().min(18, 'Idade mínima: 18').max(99),
  city: z.string().trim().min(2, 'Cidade inválida').max(60),
  identity: z.enum(['man', 'woman', 'non_binary', 'other']),
  identityOther: z.string().trim().max(60).optional(),
  interactionPreference: z.enum(['individuals', 'couples', 'all']),
  bio: z.string().trim().max(500).optional(),
});

export default function CompleteProfilePage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const { house, isLoading: houseLoading } = useHouse();
  const [searchParams] = useSearchParams();
  const redirect = useMemo(() => searchParams.get('redirect') || '/', [searchParams]);

  const [nickname, setNickname] = useState('');
  const [profileType, setProfileType] = useState<ProfileType>('individual');
  const [age, setAge] = useState<number>(18);
  const [city, setCity] = useState('');
  const [identity, setIdentity] = useState<IdentityType>('man');
  const [identityOther, setIdentityOther] = useState('');
  const [interactionPreference, setInteractionPreference] = useState<InteractionPreference>('all');
  const [bio, setBio] = useState('');

  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authLoading && !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(`/completar-perfil?redirect=${redirect}`)}`} replace />;
  }

  if (!authLoading && profile) {
    return <Navigate to={redirect} replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) return;
    if (!house) {
      setError('Casa não carregada. Tente novamente.');
      return;
    }

    // Photos: min 3 max 5
    if (photos.length < 3 || photos.length > 5) {
      setError('Envie no mínimo 3 e no máximo 5 fotos.');
      return;
    }

    const parsed = profileSchema.safeParse({
      nickname,
      profileType,
      age,
      city,
      identity,
      identityOther: identity === 'other' ? identityOther : undefined,
      interactionPreference,
      bio,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos');
      return;
    }

    setSubmitting(true);
    try {
      // Upload photos (first photo becomes avatar_url for now)
      const uploadedUrls: string[] = [];
      for (const file of photos) {
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(path, file, { upsert: false, contentType: file.type });
        if (uploadError) {
          setError('Falha ao enviar fotos. Tente novamente.');
          return;
        }
        const { data } = supabase.storage.from('profile-photos').getPublicUrl(path);
        uploadedUrls.push(data.publicUrl);
      }

      const avatarUrl = uploadedUrls[0] ?? null;

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          house_id: house.id,
          nickname: parsed.data.nickname,
          profile_type: parsed.data.profileType,
          age: parsed.data.age,
          city: parsed.data.city,
          avatar_url: avatarUrl,
          bio: parsed.data.bio ?? null,
          identity: parsed.data.identity,
          identity_other: parsed.data.identity === 'other' ? (parsed.data.identityOther || null) : null,
          interaction_preference: parsed.data.interactionPreference,
          is_subscriber: false,
          subscription_expires_at: null,
          is_active: true,
        });

      if (insertError) {
        setError('Não foi possível salvar seu perfil.');
        return;
      }

      window.location.href = redirect;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-3xl font-bold mb-2">Complete seu perfil</h1>
          <p className="text-muted-foreground mb-8">
            Singles e casais: preencha seus dados e envie de 3 a 5 fotos.
          </p>

          <Card className="p-6 border-border/50">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">Apelido</Label>
                  <Input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileType">Tipo</Label>
                  <select
                    id="profileType"
                    value={profileType}
                    onChange={(e) => setProfileType(e.target.value as ProfileType)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="individual">Single</option>
                    <option value="couple">Casal</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input id="age" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="identity">Identidade</Label>
                  <select
                    id="identity"
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value as IdentityType)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="man">Homem</option>
                    <option value="woman">Mulher</option>
                    <option value="non_binary">Não-binário</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interactionPreference">Interesse em</Label>
                  <select
                    id="interactionPreference"
                    value={interactionPreference}
                    onChange={(e) => setInteractionPreference(e.target.value as InteractionPreference)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="all">Todos</option>
                    <option value="individuals">Singles</option>
                    <option value="couples">Casais</option>
                  </select>
                </div>
              </div>

              {identity === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="identityOther">Qual?</Label>
                  <Input
                    id="identityOther"
                    value={identityOther}
                    onChange={(e) => setIdentityOther(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (opcional)</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photos">Fotos (mín. 3, máx. 5)</Label>
                <Input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setPhotos(files);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Dica: envie fotos nítidas e recentes. A primeira será sua foto principal.
                </p>
                {photos.length > 0 && (
                  <p className="text-sm text-muted-foreground">{photos.length} foto(s) selecionada(s)</p>
                )}
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={submitting || authLoading || houseLoading}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {submitting ? 'Salvando...' : 'Salvar perfil'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to={redirect}>Cancelar</Link>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </Layout>
  );
}
