import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useHouse } from '@/contexts/HouseContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, AlertTriangle, Heart, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RulesPage() {
  const { slug } = useParams<{ slug: string }>();
  const { house, isLoading, setHouseBySlug } = useHouse();

  useEffect(() => {
    if (slug && (!house || house.slug !== slug)) {
      setHouseBySlug(slug);
    }
  }, [slug, house, setHouseBySlug]);

  if (isLoading || !house) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <Skeleton className="h-12 w-1/3 mb-8" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 bg-card/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                Regras e Código de Conduta
              </h1>
              <p className="text-muted-foreground">
                Diretrizes para uma convivência harmoniosa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {house.rules ? (
            <div className="max-w-3xl mx-auto">
              <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                {house.rules}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Default Rules */}
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Respeito e Consentimento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>• O consentimento é fundamental e deve ser sempre respeitado.</p>
                  <p>• "Não" significa "não" em qualquer situação.</p>
                  <p>• Respeite os limites de cada pessoa.</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-success" />
                    Privacidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>• Fotografias e gravações são estritamente proibidas.</p>
                  <p>• O que acontece aqui, fica aqui.</p>
                  <p>• Discrição é essencial.</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-info" />
                    Comportamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>• Seja educado e cordial com todos.</p>
                  <p>• Consumo responsável de álcool.</p>
                  <p>• Siga as orientações da equipe.</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-destructive/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Proibições
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>• Comportamento abusivo ou assédio.</p>
                  <p>• Substâncias ilegais.</p>
                  <p>• Qualquer forma de discriminação.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
