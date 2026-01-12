import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Building2 } from 'lucide-react';
import type { House } from '@/types/database';

const Index = () => {
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
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Casas de Eventos <span className="text-gradient">Exclusivas</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Descubra espaços únicos para experiências memoráveis. Conecte-se com pessoas incríveis em ambientes seguros e discretos.
            </p>
          </div>
        </div>
      </section>

      {/* Houses List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">
            Nossas Casas
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : houses && houses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {houses.map((house) => (
                <Link key={house.id} to={`/${house.slug}`}>
                  <Card className="group h-full bg-card border-border/50 hover:border-primary/50 hover-lift transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {house.logo_url ? (
                          <img 
                            src={house.logo_url} 
                            alt={house.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div 
                            className="h-16 w-16 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: house.primary_color || '#8B5CF6' }}
                          >
                            <Building2 className="h-8 w-8 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                            {house.name}
                          </h3>
                          {house.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {house.description}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma casa disponível</h3>
              <p className="text-muted-foreground">
                Em breve novas casas de eventos serão adicionadas.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
