/**
 * Canonical InTelleX / Looping Binary public hosts.
 * These must NEVER be treated as campus custom domains.
 */

export const CANONICAL_SITE_URL = 'https://intellex.loopingbinary.com';

const BUILTIN_PLATFORM_HOSTS = [
  'localhost',
  '127.0.0.1',
  'intellex.loopingbinary.com',
  'www.intellex.loopingbinary.com',
  'intellex.cm',
  'www.intellex.cm',
] as const;

function hostFromEnvValue(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const host = String(raw)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .split('/')[0]
    .split(':')[0]
    .replace(/\.$/, '');
  return host || null;
}

/** All hosts that belong to the main InTelleX app (not a white-label campus). */
export function platformHostSet(): Set<string> {
  const hosts = new Set<string>(BUILTIN_PLATFORM_HOSTS);
  for (const value of [
    process.env.APP_PUBLIC_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_URL,
    ...(process.env.PLATFORM_HOSTS || '').split(','),
  ]) {
    const h = hostFromEnvValue(value);
    if (h) hosts.add(h);
  }
  return hosts;
}

export function isPlatformHostname(host: string | null | undefined): boolean {
  if (!host) return true;
  const h = hostFromEnvValue(host);
  if (!h) return true;
  if (h.endsWith('.vercel.app')) return true;
  return platformHostSet().has(h);
}
