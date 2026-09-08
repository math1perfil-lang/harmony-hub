const RESERVED_SUBDOMAINS = new Set([
  'www',
  'app',
  'admin',
  'api',
  'preview',
  'staging',
  'id-preview',
]);

const PLATFORM_HOST_SUFFIXES = ['lovable.app', 'lovableproject.com', 'lovable.dev'];

/** Returns the house slug encoded in the hostname (casa.meusite.com -> "casa"). */
export function getSubdomainSlug(host?: string): string | null {
  const hostname = (host ?? window.location.hostname).toLowerCase();

  if (hostname === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return null;
  if (PLATFORM_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) return null;

  const parts = hostname.split('.');
  if (parts.length < 3) return null;

  const sub = parts[0];
  if (!sub || RESERVED_SUBDOMAINS.has(sub)) return null;
  return sub;
}

/** Extracts the slug from a /c/<slug> style path, used when there is no subdomain. */
export function getPathSlug(pathname: string): string | null {
  const match = pathname.match(/^\/c\/([a-z0-9-]{2,})/i);
  return match ? match[1].toLowerCase() : null;
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}
