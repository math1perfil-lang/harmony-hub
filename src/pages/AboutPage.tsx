import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { useHouse } from '@/contexts/HouseContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Info } from 'lucide-react';

export default function AboutPage() {
  const { house, isLoading } = useHouse();

  const { data: photos } = useQuery({
    queryKey: ['house-photos', house?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('house_photos')
        .select('*')
        .eq('house_id', house!.id)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    enabled: !!house?.id,
  });

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
              <Info className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                Sobre a {house.name}
              </h1>
              <p className="text-muted-foreground">
                Conheça nossa história e proposta
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-invert">
            {house.about ? (
              <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                {house.about}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Em breve mais informações sobre nossa casa de eventos.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {!!photos?.length && (
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold mb-6">Conheça o espaço</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.image_url}
                  alt={photo.caption || `Foto da ${house.name}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover rounded-xl border border-border/50"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
