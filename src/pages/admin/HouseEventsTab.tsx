import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { uploadHouseImage } from '@/lib/houseMedia';
import { Trash2 } from 'lucide-react';
import type { Event } from '@/types/database';

const empty = {
  title: '',
  description: '',
  benefits: '',
  event_date: '',
  start_time: '22:00',
  end_time: '',
  image_url: '',
};

export default function HouseEventsTab({ houseId }: { houseId: string }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events', houseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('house_id', houseId)
        .order('event_date', { ascending: false });
      if (error) throw error;
      return data as Event[];
    },
  });

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const reset = () => {
    setForm({ ...empty });
    setEditingId(null);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        house_id: houseId,
        title: form.title.trim(),
        description: form.description.trim() || null,
        benefits: form.benefits.trim() || null,
        event_date: form.event_date,
        start_time: form.start_time,
        end_time: form.end_time || null,
        image_url: form.image_url || null,
      };
      if (editingId) {
        const { error } = await supabase.from('events').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('events').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: editingId ? 'Evento atualizado' : 'Evento criado' });
      reset();
      queryClient.invalidateQueries({ queryKey: ['admin-events', houseId] });
      queryClient.invalidateQueries({ queryKey: ['events', houseId] });
    },
    onError: () => toast({ title: 'Não foi possível salvar o evento', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Evento removido' });
      queryClient.invalidateQueries({ queryKey: ['admin-events', houseId] });
      queryClient.invalidateQueries({ queryKey: ['events', houseId] });
    },
    onError: () => toast({ title: 'Não foi possível remover o evento', variant: 'destructive' }),
  });

  const onImage = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadHouseImage(houseId, file);
      set('image_url', url);
    } catch {
      toast({ title: 'Erro ao enviar a imagem', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.event_date || !form.start_time) {
      toast({ title: 'Preencha nome, data e horário', variant: 'destructive' });
      return;
    }
    saveMutation.mutate();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6 border-border/50">
        <h2 className="font-display text-xl font-semibold mb-4">
          {editingId ? 'Editar evento' : 'Novo evento'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nome do evento</Label>
            <Input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} maxLength={120} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" value={form.event_date} onChange={(e) => set('event_date', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start">Início</Label>
              <Input id="start" type="time" value={form.start_time} onChange={(e) => set('start_time', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">Término</Label>
              <Input id="end" type="time" value={form.end_time} onChange={(e) => set('end_time', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Descrição</Label>
            <Textarea id="desc" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} maxLength={2000} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="benefits">Benefícios / condições</Label>
            <Textarea id="benefits" rows={3} value={form.benefits} onChange={(e) => set('benefits', e.target.value)} maxLength={1000} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="img">Imagem do evento</Label>
            <Input id="img" type="file" accept="image/*" disabled={uploading} onChange={(e) => onImage(e.target.files?.[0])} />
            {form.image_url && <img src={form.image_url} alt="Imagem do evento" className="mt-2 rounded-lg h-32 object-cover" />}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saveMutation.isPending} className="bg-gradient-primary hover:opacity-90">
              {saveMutation.isPending ? 'Salvando...' : editingId ? 'Salvar evento' : 'Criar evento'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={reset}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="p-6 border-border/50">
        <h2 className="font-display text-xl font-semibold mb-4">Eventos da casa</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : !events?.length ? (
          <p className="text-muted-foreground text-sm">Nenhum evento cadastrado ainda.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((ev) => (
              <li key={ev.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/50">
                <div className="min-w-0">
                  <p className="font-medium truncate">{ev.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(`${ev.event_date}T00:00:00`).toLocaleDateString('pt-BR')} · {ev.start_time?.slice(0, 5)}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(ev.id);
                      setForm({
                        title: ev.title,
                        description: ev.description ?? '',
                        benefits: ev.benefits ?? '',
                        event_date: ev.event_date,
                        start_time: ev.start_time?.slice(0, 5) ?? '22:00',
                        end_time: ev.end_time?.slice(0, 5) ?? '',
                        image_url: ev.image_url ?? '',
                      });
                    }}
                  >
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(ev.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
