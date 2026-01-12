import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { EventsList } from '@/components/events/EventsList';
import { useHouse } from '@/contexts/HouseContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';

export default function EventsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { house, isLoading, setHouseBySlug } = useHouse();

  useEffect(() => {
    if (!slug || slug.startsWith(':')) return;
    if (!house || house.slug !== slug) {
      setHouseBySlug(slug);
    }
  }, [slug, house, setHouseBySlug]);

  if (!slug || slug.startsWith(':')) {
    return <Navigate to="/" replace />;
  }

  if (isLoading || !house) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <Skeleton className="h-12 w-1/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
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
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                Agenda de Eventos
              </h1>
              <p className="text-muted-foreground">
                Confira todos os eventos programados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <EventsList houseId={house.id} houseSlug={house.slug} />
        </div>
      </section>
    </Layout>
  );
}
