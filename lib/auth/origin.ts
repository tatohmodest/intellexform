import type { NextRequest } from 'next/server';

/** Origin for auth emails — use the incoming request so local/dev links work. */
export function requestOrigin(req: NextRequest): string {
  const host =
    req.headers.get('x-forwarded-host') ||
    req.headers.get('host') ||
    req.nextUrl.host;
  if (!host) return req.nextUrl.origin;
  const proto =
    req.headers.get('x-forwarded-proto') ||
    (req.nextUrl.protocol === 'https:' ? 'https' : 'http');
  return `${proto}://${host}`.replace(/\/$/, '');
}
