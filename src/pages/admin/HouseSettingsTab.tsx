import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { uploadHouseImage } from '@/lib/houseMedia';
import type { House } from '@/types/database';

interface Props {
  house: House;
  onSaved: () => void;
}

export default function HouseSettingsTab({ house, onSaved }: Props) {
  const [form, setForm] = useState({
    name: house.name,
    description: house.description ?? '',
    about: house.about ?? '',
    rules: house.rules ?? '',
    logo_url: house.logo_url ?? '',
    primary_color: house.primary_color ?? '#8B5CF6',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const onLogo = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadHouseImage(house.id, file);
      set('logo_url', url);
      toast({ title: 'Logo enviada', description: 'Salve as alterações para publicar.' });
    } catch {
      toast({ title: 'Erro ao enviar a imagem', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('houses')
        .update({
          name: form.name.trim(),
          description: form.description.trim() || null,
          about: form.about.trim() || null,
          rules: form.rules.trim() || null,
          logo_url: form.logo_url || null,
          primary_color: form.primary_color,
        })
        .eq('id', house.id);

      if (error) throw error;
      toast({ title: 'Alterações salvas' });
      onSaved();
    } catch {
      toast({ title: 'Não foi possível salvar', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 border-border/50 space-y-5 max-w-3xl">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da casa</Label>
        <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={80} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição curta (aparece na capa)</Label>
        <Textarea id="description" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} maxLength={500} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="about">Página "Conheça a casa"</Label>
        <Textarea id="about" rows={8} value={form.about} onChange={(e) => set('about', e.target.value)} maxLength={5000} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rules">Regras da casa</Label>
        <Textarea id="rules" rows={8} value={form.rules} onChange={(e) => set('rules', e.target.value)} maxLength={5000} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="logo">Logo</Label>
          <Input id="logo" type="file" accept="image/*" disabled={uploading} onChange={(e) => onLogo(e.target.files?.[0])} />
          {form.logo_url && <img src={form.logo_url} alt="Logo da casa" className="h-16 w-auto mt-2 rounded" />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Cor principal</Label>
          <Input id="color" type="color" value={form.primary_color} onChange={(e) => set('primary_color', e.target.value)} className="h-10 w-24 p-1" />
        </div>
      </div>

      <Button onClick={onSave} disabled={saving} className="bg-gradient-primary hover:opacity-90">
        {saving ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </Card>
  );
}
