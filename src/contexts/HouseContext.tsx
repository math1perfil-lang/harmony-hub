import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getPathSlug, getSubdomainSlug } from '@/lib/tenant';
import type { House } from '@/types/database';

interface HouseContextType {
  house: House | null;
  slug: string | null;
  /** Prefix to prepend to internal links ("" on a subdomain, "/c/slug" otherwise). */
  basePath: string;
  href: (path: string) => string;
  isPlatform: boolean;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

const HouseContext = createContext<HouseContextType | undefined>(undefined);

export function HouseProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const subdomainSlug = useMemo(() => getSubdomainSlug(), []);
  const pathSlug = getPathSlug(location.pathname);
  const slug = subdomainSlug ?? pathSlug;
  const basePath = subdomainSlug ? '' : pathSlug ? `/c/${pathSlug}` : '';

  const [house, setHouse] = useState<House | null>(null);
  const [isLoading, setIsLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);

  const loadHouse = useCallback(async () => {
    if (!slug) {
      setHouse(null);
      setIsLoading(false);
      setError(null);
      return;
    }
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
        setHouse(null);
        setError('Casa não encontrada');
      }
    } catch (err: any) {
      const msg = typeof err?.message === 'string' ? err.message : null;
      setError(msg ? `Erro ao carregar a casa: ${msg}` : 'Erro ao carregar a casa');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadHouse();
  }, [loadHouse]);

  const href = useCallback(
    (path: string) => {
      const clean = path.startsWith('/') ? path : `/${path}`;
      if (!basePath) return clean;
      return clean === '/' ? basePath : `${basePath}${clean}`;
    },
    [basePath]
  );

  return (
    <HouseContext.Provider
      value={{ house, slug, basePath, href, isPlatform: !slug, isLoading, error, retry: loadHouse }}
    >
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
