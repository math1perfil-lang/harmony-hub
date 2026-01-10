import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EventCard } from './EventCard';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarX } from 'lucide-react';
import type { Event } from '@/types/database';

interface EventsListProps {
  houseId: string;
  houseSlug: string;
  limit?: number;
}

export function EventsList({ houseId, houseSlug, limit }: EventsListProps) {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events', houseId],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .eq('house_id', houseId)
        .eq('is_active', true)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Event[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit || 6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[16/10] rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarX className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum evento agendado</h3>
        <p className="text-muted-foreground">
          Fique atento, novos eventos serão anunciados em breve!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} houseSlug={houseSlug} />
      ))}
    </div>
  );
}
