import { useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const signupSchema = z
  .object({
    email: z.string().trim().email('Email inválido').max(255),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').max(72),
    confirmPassword: z.string().min(6).max(72),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  });

export default function SignupPage() {
  const { user, isLoading, signUp } = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = useMemo(() => searchParams.get('redirect') || '/', [searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoading && user) {
    return <Navigate to={redirect} replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = signupSchema.safeParse({ email, password, confirmPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signUp(parsed.data.email, parsed.data.password);
      if (error) {
        // Avoid leaking exact auth error details.
        setError('Não foi possível criar sua conta. Tente outro email.');
        return;
      }
      // After signup, user might need to confirm email depending on backend settings.
      // We still allow continuing to profile completion to keep flow simple.
      window.location.href = `/completar-perfil?redirect=${encodeURIComponent(redirect)}`;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-3xl font-bold mb-2">Criar conta</h1>
          <p className="text-muted-foreground mb-8">
            Cadastre-se para participar dos eventos e usar a área social.
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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                {submitting ? 'Criando...' : 'Criar conta'}
              </Button>
            </form>
          </Card>

          <p className="text-sm text-muted-foreground mt-6">
            Já tem conta?{' '}
            <Link className="text-primary underline underline-offset-4" to={`/login?redirect=${encodeURIComponent(redirect)}`}>
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </Layout>
  );
}
