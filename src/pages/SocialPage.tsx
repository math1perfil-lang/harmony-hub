import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { TenantLink as Link } from '@/components/TenantLink';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SwipeArea } from '@/components/social/SwipeArea';
import { MatchesList } from '@/components/social/MatchesList';
import { useSocialProfiles, useMatches } from '@/hooks/useSocialProfiles';
import { useHouse } from '@/contexts/HouseContext';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Sparkles, Heart, Lock } from 'lucide-react';
import type { Event } from '@/types/database';

export default function SocialPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { house, isLoading: houseLoading } = useHouse();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('discover');

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

  const {
    profiles,
    isLoading: profilesLoading,
    refetch,
    like,
  } = useSocialProfiles({
    eventId: eventId || '',
    currentProfileId: profile?.id,
    interactionPreference: profile?.interaction_preference,
  });

  const { data: matches = [] } = useMatches(eventId || '', profile?.id);

  // Loading state
  if (houseLoading || authLoading || eventLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <Skeleton className="h-12 w-1/3 mb-8" />
          <Skeleton className="h-[60vh] max-w-sm mx-auto rounded-xl" />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Lock className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
          <h1 className="text-3xl font-display font-bold mb-4">Acesso Restrito</h1>
          <p className="text-muted-foreground mb-8">
            Você precisa estar logado para acessar a área social.
          </p>
          <Button asChild className="bg-gradient-primary hover:opacity-90">
            <Link to={`/login?redirect=/evento/${eventId}/social`}>
              Fazer Login
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // No profile
  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Lock className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
          <h1 className="text-3xl font-display font-bold mb-4">Complete seu Perfil</h1>
          <p className="text-muted-foreground mb-8">
            Você precisa completar seu perfil para acessar a área social.
          </p>
          <Button asChild className="bg-gradient-primary hover:opacity-90">
            <Link to={`/completar-perfil?redirect=/evento/${eventId}/social`}>
              Completar Perfil
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Not subscriber
  if (!profile.is_subscriber) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Sparkles className="h-16 w-16 mx-auto text-primary mb-6" />
          <h1 className="text-3xl font-display font-bold mb-4">Área Exclusiva</h1>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            A área social é exclusiva para assinantes. Conheça outros participantes e faça conexões antes do evento!
          </p>
          <div className="bg-card border border-border/50 rounded-xl p-6 max-w-sm mx-auto mb-8">
            <h3 className="font-semibold mb-4">Benefícios da Assinatura:</h3>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Ver perfis dos participantes
              </li>
              <li className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Curtir e fazer matches
              </li>
              <li className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Trocar mensagens antes do evento
              </li>
            </ul>
          </div>
          <Button asChild className="bg-gradient-primary hover:opacity-90">
            <Link to="/assinatura">
              Ver Planos
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Not confirmed for event
  if (!participation || participation.status !== 'confirmed') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Lock className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
          <h1 className="text-3xl font-display font-bold mb-4">Confirme sua Presença</h1>
          <p className="text-muted-foreground mb-8">
            Você precisa confirmar sua presença no evento para acessar a área social.
          </p>
          <Button asChild className="bg-gradient-primary hover:opacity-90">
            <Link to={`/evento/${eventId}`}>
              Ver Evento
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (!event || !house) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Evento não encontrado</h1>
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

  return (
    <Layout>
      {/* Header */}
      <section className="py-6 bg-card/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/evento/${eventId}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold">
                Área Social
              </h1>
              <p className="text-muted-foreground text-sm">
                {event.title}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="discover" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Descobrir
              </TabsTrigger>
              <TabsTrigger value="matches" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Matches ({matches.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discover">
              <SwipeArea
                profiles={profiles}
                currentProfile={profile}
                onLike={like}
                onRefresh={refetch}
                isLoading={profilesLoading}
              />
            </TabsContent>

            <TabsContent value="matches">
              <div className="max-w-2xl mx-auto">
                <MatchesList matches={matches} eventId={eventId || ''} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
