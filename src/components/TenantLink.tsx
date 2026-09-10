import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { useHouse } from '@/contexts/HouseContext';

/**
 * Link that automatically keeps the current house prefix
 * (no prefix on a house subdomain, "/c/<slug>" when browsing by path).
 */
export const TenantLink = forwardRef<HTMLAnchorElement, LinkProps>(function TenantLink(
  { to, ...props },
  ref
) {
  const { href } = useHouse();
  const target = typeof to === 'string' ? href(to) : to;
  return <Link ref={ref} to={target} {...props} />;
});
