import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { House } from '@/types/database';

interface HouseContextType {
  house: House | null;
  isLoading: boolean;
  error: string | null;
  setHouseBySlug: (slug: string) => Promise<void>;
}

const HouseContext = createContext<HouseContextType | undefined>(undefined);

export function HouseProvider({ children }: { children: ReactNode }) {
  const [house, setHouse] = useState<House | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setHouseBySlug = async (slug: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('houses')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (fetchError) throw fetchError;
      
      if (data) {
        setHouse(data as House);
      } else {
        setError('Casa de eventos não encontrada');
      }
    } catch (err) {
      setError('Erro ao carregar casa de eventos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Try to detect house from URL on mount
  useEffect(() => {
    const detectHouseFromUrl = async () => {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      
      // Check for /:slug pattern (new routing)
      const directSlugMatch = pathname.match(/^\/([^/]+)/);
      if (directSlugMatch) {
        const candidate = directSlugMatch[1];
        // Ignore placeholders like ":slug" and known non-tenant routes
        const reserved = new Set(['', 'house', 'login', 'cadastro']);
        if (!candidate.startsWith(':') && !reserved.has(candidate)) {
          await setHouseBySlug(candidate);
          return;
        }
      }

      // Backward compatibility: /house/:slug pattern
      const legacyMatch = pathname.match(/^\/house\/([^/]+)/);
      if (legacyMatch) {
        await setHouseBySlug(legacyMatch[1]);
        return;
      }

      // Check for subdomain
      const subdomain = hostname.split('.')[0];
      if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
        await setHouseBySlug(subdomain);
        return;
      }

      // Check for custom domain
      try {
        const { data } = await supabase
          .from('houses')
          .select('*')
          .eq('custom_domain', hostname)
          .eq('is_active', true)
          .maybeSingle();

        if (data) {
          setHouse(data as House);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error checking custom domain:', err);
      }

      setIsLoading(false);
    };

    detectHouseFromUrl();
  }, []);

  return (
    <HouseContext.Provider value={{ house, isLoading, error, setHouseBySlug }}>
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
