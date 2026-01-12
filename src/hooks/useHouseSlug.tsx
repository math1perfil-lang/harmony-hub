import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHouse } from '@/contexts/HouseContext';

export function useHouseSlug() {
  const { slug } = useParams<{ slug: string }>();
  const { house, isLoading, error, setHouseBySlug } = useHouse();

  useEffect(() => {
    if (slug && (!house || house.slug !== slug)) {
      setHouseBySlug(slug);
    }
  }, [slug, house, setHouseBySlug]);

  return { house, isLoading, error, slug };
}
