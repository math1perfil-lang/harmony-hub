import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { uploadHouseImage } from '@/lib/houseMedia';
import { Trash2 } from 'lucide-react';

interface HousePhoto {
  id: string;
  house_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export default function HousePhotosTab({ houseId }: { houseId: string }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: photos, isLoading } = useQuery({
    queryKey: ['house-photos', houseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('house_photos')
        .select('*')
        .eq('house_id', houseId)
        .order('sort_order');
      if (error) throw error;
      return data as HousePhoto[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (files: FileList) => {
      let order = photos?.length ?? 0;
      for (const file of Array.from(files)) {
        const url = await uploadHouseImage(houseId, file);
        const { error } = await supabase
          .from('house_photos')
          .insert({ house_id: houseId, image_url: url, sort_order: order++ });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: 'Fotos adicionadas' });
      queryClient.invalidateQueries({ queryKey: ['house-photos', houseId] });
    },
    onError: () => toast({ title: 'Não foi possível enviar as fotos', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('house_photos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['house-photos', houseId] }),
  });

  return (
    <Card className="p-6 border-border/50 max-w-4xl">
      <div className="space-y-2 mb-6">
        <Label htmlFor="photos">Adicionar fotos da casa</Label>
        <Input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          disabled={uploading || addMutation.isPending}
          onChange={async (e) => {
            const files = e.target.files;
            if (!files?.length) return;
            setUploading(true);
            await addMutation.mutateAsync(files).catch(() => undefined);
            setUploading(false);
            e.target.value = '';
          }}
        />
        <p className="text-xs text-muted-foreground">
          Estas fotos aparecem na página "Conheça a casa" do seu site.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
          ))}
        </div>
      ) : !photos?.length ? (
        <p className="text-muted-foreground text-sm">Nenhuma foto enviada ainda.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.image_url}
                alt={photo.caption || 'Foto da casa'}
                className="aspect-[4/3] w-full object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteMutation.mutate(photo.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
