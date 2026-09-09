import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { House } from '@/types/database';

export default function HousesDirectoryPage() {
  const { data: houses, isLoading } = useQuery({
    queryKey: ['houses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as House[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Casas na plataforma</h1>
            <p className="text-muted-foreground">Escolha uma casa para visitar o site dela.</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">Voltar</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : !houses?.length ? (
          <p className="text-muted-foreground">Nenhuma casa cadastrada ainda.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {houses.map((h) => (
              <Card key={h.id} className="p-6 border-border/50 hover-lift">
                <h2 className="font-display text-xl font-semibold mb-2">{h.name}</h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {h.description || 'Casa de eventos privados.'}
                </p>
                <Button asChild className="bg-gradient-primary hover:opacity-90">
                  <Link to={`/c/${h.slug}`}>Visitar site</Link>
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
