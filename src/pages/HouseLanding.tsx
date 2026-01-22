import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { EventsList } from '@/components/events/EventsList';
import { useHouse } from '@/contexts/HouseContext';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Shield, Users, Heart, Calendar } from 'lucide-react';

export default function HouseLanding() {
  const { house, isLoading, error, retry } = useHouse();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <Skeleton className="h-12 w-1/3 mb-4" />
          <Skeleton className="h-6 w-2/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !house) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-4">
            Casa não encontrada
          </h1>
          <p className="text-muted-foreground mb-8">
            {error || 'A casa de eventos não está disponível no momento.'}
          </p>
          <Button onClick={retry} className="bg-gradient-primary hover:opacity-90">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Bem-vindo à{' '}
              <span className="text-gradient">{house.name}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              {house.description || 'Um espaço exclusivo para eventos privados. Conecte-se com pessoas incríveis em um ambiente seguro e discreto.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 shadow-glow">
                <Link to="/eventos">
                  Ver Eventos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/sobre">Conhecer a Casa</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-card border border-border/50 hover-lift">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Privacidade</h3>
              <p className="text-muted-foreground">
                Ambiente seguro e discreto. Seus dados são protegidos e sua privacidade é nossa prioridade.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border/50 hover-lift">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Conexões</h3>
              <p className="text-muted-foreground">
                Encontre pessoas compatíveis antes mesmo do evento através da nossa área social exclusiva.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border/50 hover-lift">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Respeito</h3>
              <p className="text-muted-foreground">
                Comunidade baseada em consentimento, respeito mútuo e boas práticas de convivência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Próximos Eventos
              </h2>
              <p className="text-muted-foreground">
                Confira nossa agenda e reserve seu lugar
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/eventos">
                <Calendar className="mr-2 h-4 w-4" />
                Ver Todos
              </Link>
            </Button>
          </div>
          
          <EventsList houseId={house.id} limit={3} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Faça parte da nossa comunidade
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Crie sua conta e tenha acesso exclusivo à nossa área social, conecte-se com outros participantes antes dos eventos.
          </p>
          <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 shadow-glow">
            <Link to="/cadastro">
              Criar Minha Conta
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
