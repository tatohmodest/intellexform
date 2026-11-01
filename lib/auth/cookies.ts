import { NextRequest, NextResponse } from 'next/server';

export const SESSION_COOKIE = 'intellex_session';
export const OAUTH_STATE_COOKIE = 'lb_oauth_state';
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

const AUTH_COOKIE_NAMES = [SESSION_COOKIE, OAUTH_STATE_COOKIE] as const;

/** Domains older builds may have written auth cookies on. */
const LEGACY_DOMAINS = ['.loopingbinary.com', 'intellex.loopingbinary.com', '.intellex.loopingbinary.com'];

function isProd() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Serialize an expiry Set-Cookie line.
 * NOTE: `res.cookies.set` keys cookies by name only, so writing several
 * variants of the same cookie through it keeps just the last one. We append
 * raw headers instead so every variant actually reaches the browser.
 */
function expiryLine(name: string, opts: { domain?: string; secure?: boolean }): string {
  const parts = [
    `${name}=`,
    'Path=/',
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (opts.domain) parts.push(`Domain=${opts.domain}`);
  if (opts.secure) parts.push('Secure');
  return parts.join('; ');
}

function appendExpiry(res: NextResponse, includeHostOnly: boolean, names: readonly string[]) {
  for (const name of names) {
    if (includeHostOnly) res.headers.append('set-cookie', expiryLine(name, { secure: isProd() }));
    for (const domain of LEGACY_DOMAINS) {
      res.headers.append('set-cookie', expiryLine(name, { domain, secure: true }));
    }
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: 'lax' as const,
    secure: isProd(),
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}

/** Drop every leftover session cookie, then write a fresh host-only one. */
export function writeSessionCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  // Appended after `cookies.set` (which rewrites Set-Cookie headers) so they survive.
  // Host-only expiry is skipped: the fresh cookie above replaces it.
  appendExpiry(res, false, [SESSION_COOKIE]);
  appendExpiry(res, true, [OAUTH_STATE_COOKIE]);
  return res;
}

/**
 * Expire auth cookies on every host/domain variant.
 * Call this LAST on a response: a later `res.cookies.set(...)` rewrites the
 * Set-Cookie header list and would drop these lines.
 */
export function expireAuthCookies(res: NextResponse): NextResponse {
  appendExpiry(res, true, AUTH_COOKIE_NAMES);
  return res;
}

/** Every value sent for `name` (browsers send duplicates when host + domain cookies coexist). */
export function cookieValues(rawCookieHeader: string | null | undefined, name: string): string[] {
  if (!rawCookieHeader) return [];
  const out: string[] = [];
  for (const part of rawCookieHeader.split(';')) {
    const pair = part.trim();
    const eq = pair.indexOf('=');
    if (eq === -1 || pair.slice(0, eq) !== name) continue;
    const value = pair.slice(eq + 1);
    if (!value) continue;
    try {
      out.push(decodeURIComponent(value));
    } catch {
      out.push(value);
    }
  }
  return out;
}

/** Rebuild the request Cookie header with auth cookies removed, optionally keeping one session token. */
export function stripAuthCookiesHeader(req: NextRequest, keepSession?: string | null): Headers {
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
  if (keepSession) kept.push(`${SESSION_COOKIE}=${keepSession}`);
  if (kept.length) headers.set('cookie', kept.join('; '));
  else headers.delete('cookie');
  return headers;
}

function hex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * A value is only usable as a signing secret if it is long and not a placeholder.
 * `vercel env pull` writes sensitive variables as the literal text "[SENSITIVE]";
 * signing with that (or any short, public string) would let anyone forge a session.
 */
export function isUsableSecret(value: string | undefined | null): value is string {
  const v = String(value ?? '').trim();
  if (v.length < 24) return false;
  if (/^\[.*\]$/.test(v) || /^<.*>$/.test(v)) return false;
  if (/change[-_ ]?me|your[-_ ]?secret|placeholder/i.test(v)) return false;
  return true;
}

/**
 * Resolve the HMAC signing secret for learner sessions: SESSION_SECRET, then other
 * dedicated server secrets. Returns '' when none is usable - never a hard-coded or
 * guessable value, or anyone could forge a session.
 */
export function resolveSessionSecret(): string {
  const candidates = [
    process.env.SESSION_SECRET,
    process.env.LB_OAUTH_CLIENT_SECRET,
    process.env.NEXTAUTH_SECRET,
    process.env.ADMIN_SECRET,
  ];
  for (const c of candidates) {
    if (isUsableSecret(c)) return c.trim();
  }
  return '';
}

/** Edge-safe HMAC check. Returns false for rotated secrets or stale cookies. */
export async function sessionCookieIsValid(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = resolveSessionSecret();
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
