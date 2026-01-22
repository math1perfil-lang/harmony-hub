import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { House } from '@/types/database';

interface HouseContextType {
  house: House | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

const HouseContext = createContext<HouseContextType | undefined>(undefined);

export function HouseProvider({ children }: { children: ReactNode }) {
  const [house, setHouse] = useState<House | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHouse = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Single-house mode: Load the first active house
      const { data, error: fetchError } = await supabase
        .from('houses')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setHouse(data as House);
      } else {
        setError('Nenhuma casa de eventos configurada');
      }
    } catch (err: any) {
      const msg = typeof err?.message === 'string' ? err.message : null;
      // Most common in preview when backend is temporarily unreachable
      setError(msg ? `Erro ao carregar casa de eventos: ${msg}` : 'Erro ao carregar casa de eventos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHouse();
  }, []);

  return (
    <HouseContext.Provider value={{ house, isLoading, error, retry: loadHouse }}>
      {children}
    </HouseContext.Provider>
  );
}

export function useHouse() {
  const context = useContext(HouseContext);
  if (context === undefined) {
    throw new Error('useHouse must be used within a HouseProvider');
  }
  return context;
}
