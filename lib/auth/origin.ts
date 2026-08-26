import type { NextRequest } from 'next/server';
import { CANONICAL_SITE_URL } from '@/lib/platformHosts';

function isLocalHost(host: string) {
  const h = host.split(':')[0].toLowerCase();
  return h === 'localhost' || h === '127.0.0.1' || h === '::1';
}

/** Origin for auth emails — use the incoming request so local/dev links work. */
export function requestOrigin(req: NextRequest): string {
  const host = (
    req.headers.get('x-forwarded-host') ||
    req.headers.get('host') ||
    req.nextUrl.host ||
    ''
  )
    .split(',')[0]
    .trim();
  if (!host) return req.nextUrl.origin.replace(/\/$/, '');
  const local = isLocalHost(host);
  const forwarded = (req.headers.get('x-forwarded-proto') || '').split(',')[0].trim();
  const proto = local
    ? forwarded || (req.nextUrl.protocol === 'https:' ? 'https' : 'http')
    : 'https';
  return `${proto}://${host}`.replace(/\/$/, '');
}

/**
 * Public origin used in emailed links. Localhost keeps the request host so
 * reset/verify links work in development; production prefers APP_PUBLIC_URL.
 */
export function emailOrigin(req: NextRequest): string {
  const incoming = requestOrigin(req);
  if (isLocalHost(incoming.replace(/^https?:\/\//, ''))) return incoming;
  const configured = (
    process.env.APP_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    CANONICAL_SITE_URL
  ).replace(/\/$/, '');
  if (configured.startsWith('http')) return configured;
  return incoming;
}
