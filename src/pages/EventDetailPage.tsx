import { useParams } from 'react-router-dom';
import { TenantLink as Link } from '@/components/TenantLink';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useHouse } from '@/contexts/HouseContext';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, ArrowLeft, Users, Gift, Check, ListPlus } from 'lucide-react';
import type { Event } from '@/types/database';

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { house, isLoading: houseLoading, href } = useHouse();
  const { user, profile } = useAuth();

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as Event | null;
    },
    enabled: !!eventId,
  });

  const { data: participation } = useQuery({
    queryKey: ['participation', eventId, profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;
      const { data } = await supabase
        .from('event_participations')
        .select('*')
        .eq('event_id', eventId)
        .eq('profile_id', profile.id)
        .maybeSingle();
      return data;
    },
    enabled: !!eventId && !!profile?.id,
  });

  if (houseLoading || eventLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <Skeleton className="h-96 rounded-lg mb-8" />
          <Skeleton className="h-12 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    );
  }

  if (!event || !house) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Evento não encontrado</h1>
          <p className="text-muted-foreground mb-8">
            O evento que você procura não existe ou não está mais disponível.
          </p>
          <Button asChild>
            <Link to="/eventos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ver Eventos
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const eventDate = parseISO(event.event_date);
  const formattedDate = format(eventDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const isUpcoming = eventDate >= new Date();

  const handleJoinList = async () => {
    if (!user) {
      window.location.href = href(`/login?redirect=/evento/${eventId}`);
      return;
    }

    if (!profile) {
      window.location.href = href(`/completar-perfil?redirect=/evento/${eventId}`);
      return;
    }

    await supabase.from('event_participations').upsert({
      event_id: eventId,
      profile_id: profile.id,
      status: 'listed',
    });
  };

  const handleConfirmPresence = async () => {
    if (!profile) return;
    
    await supabase.from('event_participations').upsert({
      event_id: eventId,
      profile_id: profile.id,
      status: 'confirmed',
    });
  };

  return (
    <Layout>
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-primary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Button variant="secondary" size="sm" asChild className="glass">
            <Link to="/eventos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {isUpcoming && (
                    <Badge className="bg-success text-success-foreground">Em breve</Badge>
                  )}
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(eventDate, 'd MMM', { locale: ptBR })}
                  </Badge>
                </div>
                
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  {event.title}
                </h1>
                
                <p className="text-muted-foreground capitalize text-lg">
                  {formattedDate}
                </p>
              </CardContent>
            </Card>

            {/* Description */}
            {event.description && (
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="font-display text-xl">Sobre o Evento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {event.benefits && (
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="font-display text-xl flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    Benefícios para Inscritos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {event.benefits}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info */}
            <Card className="bg-card border-border/50 sticky top-24">
              <CardContent className="p-6 space-y-6">
                {/* Time */}
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Horário</p>
                    <p>
                      {event.start_time.slice(0, 5)}
                      {event.end_time && ` às ${event.end_time.slice(0, 5)}`}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-border">
                  {!participation ? (
                    <Button
                      className="w-full bg-gradient-primary hover:opacity-90"
                      size="lg"
                      onClick={handleJoinList}
                    >
                      <ListPlus className="mr-2 h-5 w-5" />
                      Entrar na Lista
                    </Button>
                  ) : participation.status === 'listed' ? (
                    <>
                      <Button
                        className="w-full bg-success hover:bg-success/90"
                        size="lg"
                        onClick={handleConfirmPresence}
                      >
                        <Check className="mr-2 h-5 w-5" />
                        Confirmar Presença
                      </Button>
                      <p className="text-sm text-center text-muted-foreground">
                        Você está na lista!
                      </p>
                    </>
                  ) : (
                    <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
                      <Check className="h-8 w-8 text-success mx-auto mb-2" />
                      <p className="font-semibold text-success">Presença Confirmada!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Nos vemos no evento
                      </p>
                    </div>
                  )}

                  {profile?.is_subscriber && participation?.status === 'confirmed' && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/evento/${eventId}/social`}>
                        <Users className="mr-2 h-5 w-5" />
                        Área Social
                      </Link>
                    </Button>
                  )}
                </div>

                {/* Subscription CTA */}
                {user && !profile?.is_subscriber && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm font-medium mb-2">
                      Quer conhecer quem vai ao evento?
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Assinantes têm acesso à área social exclusiva para se conectar antes do evento.
                    </p>
                    <Button size="sm" variant="outline" asChild className="w-full">
                      <Link to="/assinatura">
                        Ver Planos
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
