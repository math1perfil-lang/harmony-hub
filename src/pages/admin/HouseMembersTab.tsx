import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { Profile } from '@/types/database';

export default function HouseMembersTab({ houseId }: { houseId: string }) {
  const { data: members, isLoading } = useQuery({
    queryKey: ['house-members', houseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('house_id', houseId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  return (
    <Card className="p-6 border-border/50 max-w-4xl">
      <h2 className="font-display text-xl font-semibold mb-4">Frequentadores cadastrados</h2>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : !members?.length ? (
        <p className="text-muted-foreground text-sm">Nenhum cadastro ainda.</p>
      ) : (
        <ul className="space-y-3">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/50">
              <div>
                <p className="font-medium">{m.nickname}</p>
                <p className="text-xs text-muted-foreground">
                  {m.profile_type === 'couple' ? 'Casal' : 'Individual'} · {m.age} anos · {m.city}
                </p>
              </div>
              <div className="flex gap-2">
                {m.is_subscriber && <Badge>Assinante</Badge>}
                {!m.is_active && <Badge variant="destructive">Bloqueado</Badge>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
