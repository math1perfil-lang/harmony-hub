import { useMemo, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { TenantLink as Link } from '@/components/TenantLink';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().trim().email('Email inválido').max(255),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').max(72),
});

export default function LoginPage() {
  const { user, isLoading, signIn } = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = useMemo(() => searchParams.get('redirect') || '/', [searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoading && user) {
    return <Navigate to={redirect} replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signIn(parsed.data.email, parsed.data.password);
      if (error) {
        setError('Não foi possível entrar. Verifique seus dados.');
        return;
      }
      // AuthProvider will update session; Navigate above will handle redirect.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-3xl font-bold mb-2">Entrar</h1>
          <p className="text-muted-foreground mb-8">
            Acesse sua conta para confirmar presença e usar a área social.
          </p>

          <Card className="p-6 border-border/50">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                {submitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Card>

          <p className="text-sm text-muted-foreground mt-6">
            Ainda não tem conta?{' '}
            <Link className="text-primary underline underline-offset-4" to={`/cadastro?redirect=${encodeURIComponent(redirect)}`}>
              Criar conta
            </Link>
          </p>
        </div>
      </main>
    </Layout>
  );
}
