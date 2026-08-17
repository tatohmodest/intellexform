import crypto from 'crypto';

/**
 * Learner session - stateless HMAC-signed cookie (same pattern as the admin
 * session in lib/adminAuth.ts).
 */

export const SESSION_COOKIE = 'intellex_session';
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days (seconds)

export interface SessionUser {
  /** Local account id (Prisma User.id / learner lbId). */
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  iat: number;
}

function getSecret(): string {
  const s = process.env.SESSION_SECRET || process.env.LB_OAUTH_CLIENT_SECRET;
  if (!s) throw new Error('SESSION_SECRET (or LB_OAUTH_CLIENT_SECRET) is not set');
  return s;
}

export function createSession(user: Omit<SessionUser, 'iat'>): string {
  const payload: SessionUser = { ...user, iat: Date.now() };
  const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', getSecret()).update(b64).digest('hex');
  return `${b64}.${sig}`;
}

export function verifySession(token: string | undefined | null): SessionUser | null {
  if (!token) return null;
  try {
    const dot = token.lastIndexOf('.');
    if (dot === -1) return null;
    const b64 = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const expected = crypto.createHmac('sha256', getSecret()).update(b64).digest('hex');
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString()) as SessionUser;
    if (!payload.uid) return null;
    if (Date.now() - payload.iat > SESSION_MAX_AGE * 1000) return null;
    return payload;
  } catch {
    return null;
  }
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
