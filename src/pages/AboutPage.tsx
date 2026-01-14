import { Layout } from '@/components/layout/Layout';
import { useHouse } from '@/contexts/HouseContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Info } from 'lucide-react';

export default function AboutPage() {
  const { house, isLoading } = useHouse();

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
    </Layout>
  );
}
