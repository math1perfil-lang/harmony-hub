import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { slugify } from '@/lib/tenant';
import { toast } from '@/hooks/use-toast';

const schema = z.object({
  name: z.string().trim().min(2, 'Informe o nome da casa').max(80),
  slug: z.string().trim().regex(/^[a-z0-9-]{3,40}$/, 'Endereço inválido (use apenas letras, números e hífen)'),
  description: z.string().trim().max(500).optional(),
});

export default function CreateHousePage() {
  const { user, isLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  useEffect(() => {
    if (!isLoading && !user) navigate('/cadastro?redirect=/criar-casa', { replace: true });
  }, [isLoading, user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse({ name, slug, description });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error: rpcError } = await supabase.rpc('create_house_with_admin', {
        _slug: parsed.data.slug,
        _name: parsed.data.name,
        _description: parsed.data.description || null,
      });

      if (rpcError) {
        setError(
          rpcError.message.includes('slug already taken')
            ? 'Este endereço já está em uso. Escolha outro.'
            : 'Não foi possível criar a casa. Tente novamente.'
        );
        return;
      }

      await refreshProfile();
      toast({ title: 'Casa criada!', description: 'Agora configure sua página no painel.' });
      navigate(`/c/${parsed.data.slug}/painel`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Voltar
        </Link>
        <h1 className="font-display text-3xl font-bold mt-4 mb-2">Cadastre sua casa</h1>
        <p className="text-muted-foreground mb-8">
          Em poucos segundos sua casa ganha um site próprio e um painel de gestão completo.
        </p>

        <Card className="p-6 border-border/50">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da casa</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Endereço público</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
              />
              <p className="text-xs text-muted-foreground">
                Seu site ficará em <span className="text-foreground">{slug || 'suacasa'}.meusite.com</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição curta</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={4}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full bg-gradient-primary hover:opacity-90">
              {submitting ? 'Criando...' : 'Criar casa'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
