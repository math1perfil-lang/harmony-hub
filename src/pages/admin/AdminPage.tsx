import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useHouse } from '@/contexts/HouseContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { House } from '@/types/database';
import HouseSettingsTab from './HouseSettingsTab';
import HouseEventsTab from './HouseEventsTab';
import HousePhotosTab from './HousePhotosTab';
import HouseMembersTab from './HouseMembersTab';

export default function AdminPage() {
  const { user, isLoading: authLoading, adminHouseIds } = useAuth();
  const { house: contextHouse, isLoading: houseLoading, href } = useHouse();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) navigate(href('/login') + '?redirect=' + encodeURIComponent(href('/painel')), { replace: true });
  }, [authLoading, user, navigate, href]);

  const fallbackHouseId = adminHouseIds[0];

  const { data: fallbackHouse, isLoading: fallbackLoading } = useQuery({
    queryKey: ['admin-house', fallbackHouseId],
    queryFn: async () => {
      const { data, error } = await supabase.from('houses').select('*').eq('id', fallbackHouseId!).maybeSingle();
      if (error) throw error;
      return data as House | null;
    },
    enabled: !contextHouse && !!fallbackHouseId,
  });

  const house = contextHouse ?? fallbackHouse ?? null;
  const isAdmin = useMemo(
    () => !!house && adminHouseIds.includes(house.id),
    [house, adminHouseIds]
  );

  if (authLoading || houseLoading || fallbackLoading) {
    return (
      <div className="container mx-auto px-4 py-16 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!house || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl font-bold mb-4">Acesso restrito</h1>
          <p className="text-muted-foreground mb-8">
            Esta área é exclusiva para administradores de casas. Cadastre sua casa para receber seu painel.
          </p>
          <Button asChild className="bg-gradient-primary hover:opacity-90">
            <Link to="/criar-casa">Cadastrar minha casa</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Painel · {house.name}</h1>
            <p className="text-muted-foreground text-sm">
              Endereço público: <span className="text-foreground">{house.slug}.meusite.com</span>
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to={`/c/${house.slug}`}>Ver site da casa</Link>
          </Button>
        </div>

        <Tabs defaultValue="conteudo">
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="conteudo">Identidade e textos</TabsTrigger>
            <TabsTrigger value="eventos">Eventos</TabsTrigger>
            <TabsTrigger value="fotos">Fotos da casa</TabsTrigger>
            <TabsTrigger value="frequentadores">Frequentadores</TabsTrigger>
          </TabsList>

          <TabsContent value="conteudo">
            <HouseSettingsTab house={house} onSaved={() => setRefreshKey((k) => k + 1)} key={refreshKey} />
          </TabsContent>
          <TabsContent value="eventos">
            <HouseEventsTab houseId={house.id} />
          </TabsContent>
          <TabsContent value="fotos">
            <HousePhotosTab houseId={house.id} />
          </TabsContent>
          <TabsContent value="frequentadores">
            <HouseMembersTab houseId={house.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
