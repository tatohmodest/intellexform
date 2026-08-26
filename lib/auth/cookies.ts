import { NextRequest, NextResponse } from 'next/server';

export const SESSION_COOKIE = 'intellex_session';
export const OAUTH_STATE_COOKIE = 'lb_oauth_state';
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

const AUTH_COOKIE_NAMES = [SESSION_COOKIE, OAUTH_STATE_COOKIE] as const;

function expireVariants(): Array<{
  httpOnly: true;
  sameSite: 'lax';
  path: string;
  maxAge: number;
  expires: Date;
  secure?: boolean;
  domain?: string;
}> {
  const base = {
    httpOnly: true as const,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  };
  return [
    { ...base },
    { ...base, secure: true },
    { ...base, secure: process.env.NODE_ENV === 'production' },
    { ...base, domain: '.loopingbinary.com', secure: true },
    { ...base, domain: 'intellex.loopingbinary.com', secure: true },
    { ...base, domain: '.intellex.loopingbinary.com', secure: true },
  ];
}

export function sessionCookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}

/** Drop every leftover session cookie, then write a fresh host-only one. */
export function writeSessionCookie(res: NextResponse, token: string): NextResponse {
  expireAuthCookies(res);
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}

export function expireAuthCookies(res: NextResponse): NextResponse {
  for (const name of AUTH_COOKIE_NAMES) {
    for (const opts of expireVariants()) {
      res.cookies.set(name, '', opts);
    }
  }
  return res;
}

export function stripAuthCookiesHeader(req: NextRequest): Headers {
  const headers = new Headers(req.headers);
  const raw = headers.get('cookie');
  if (!raw) return headers;
  const kept = raw
    .split(';')
    .map((part) => part.trim())
    .filter((part) => {
      const name = part.split('=')[0];
      return name !== SESSION_COOKIE && name !== OAUTH_STATE_COOKIE;
    });
  if (kept.length) headers.set('cookie', kept.join('; '));
  else headers.delete('cookie');
  return headers;
}

function hex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Edge-safe HMAC check. Returns false for missing/rotated secrets or stale cookies. */
export async function sessionCookieIsValid(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET || process.env.LB_OAUTH_CLIENT_SECRET;
  if (!secret) return false;
  try {
    const dot = token.lastIndexOf('.');
    if (dot === -1) return false;
    const b64 = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const mac = hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(b64)));
    if (mac.length !== sig.length || mac !== sig) return false;
    const pad = '='.repeat((4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(atob(b64.replace(/-/g, '+').replace(/_/g, '/') + pad)) as {
      uid?: string;
      iat?: number;
    };
    if (!payload?.uid || typeof payload.iat !== 'number') return false;
    if (Date.now() - payload.iat > SESSION_MAX_AGE * 1000) return false;
    return true;
  } catch {
    return false;
  }
}
