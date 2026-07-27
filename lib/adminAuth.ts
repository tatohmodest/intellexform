import crypto from 'crypto';
import { promisify } from 'util';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/lib/auth/session';

const scryptAsync = promisify(crypto.scrypt);

export const COOKIE_NAME = 'intellex_admin';
/** @deprecated Password login replaced by email OTP + learner session. */
export const DEFAULT_PASSWORD = 'modestwilton';

/** Platform owners - only these emails may open /admin. */
export const DEFAULT_ADMIN_EMAILS = [
  'modestwilton@gmail.com',
  'tatohmodest@gmail.com',
] as const;

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_RESEND_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

function getSecret(): string {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error('ADMIN_SECRET environment variable is not set');
  return s;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Allowlist from env (comma-separated) plus the two founder emails. */
export function getAdminEmails(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => normalizeEmail(e))
    .filter(Boolean);
  const set = new Set<string>([...DEFAULT_ADMIN_EMAILS.map(normalizeEmail), ...fromEnv]);
  return Array.from(set);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(normalizeEmail(email));
}

// ── Password hashing (kept for legacy Mongo admin docs) ───────────────────────

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${key.toString('hex')}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  try {
    const [salt, storedHex] = stored.split(':');
    const key = (await scryptAsync(password, salt, 64)) as Buffer;
    const storedBuf = Buffer.from(storedHex, 'hex');
    return (
      key.length === storedBuf.length && crypto.timingSafeEqual(key, storedBuf)
    );
  } catch {
    return false;
  }
}

// ── Session token (HMAC-signed, 8-hour expiry) ────────────────────────────────

export function createSessionToken(email = 'admin'): string {
  const payload = JSON.stringify({
    sub: 'admin',
    email: normalizeEmail(email),
    iat: Date.now(),
  });
  const b64 = Buffer.from(payload).toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSecret())
    .update(b64)
    .digest('hex');
  return `${b64}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  return Boolean(readAdminSession(token));
}

export function readAdminSession(
  token: string | undefined | null,
): { email: string; iat: number } | null {
  if (!token) return null;
  try {
    const dot = token.lastIndexOf('.');
    if (dot === -1) return null;

    const b64 = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const expected = crypto
      .createHmac('sha256', getSecret())
      .update(b64)
      .digest('hex');

    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString()) as {
      sub?: string;
      email?: string;
      iat: number;
    };
    if (Date.now() - payload.iat >= 8 * 60 * 60 * 1000) return null;
    return {
      email: normalizeEmail(payload.email || 'admin'),
      iat: payload.iat,
    };
  } catch {
    return null;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 60 * 60 * 8,
  };
}

/**
 * Admin access via:
 * 1) Valid intellex_admin cookie (OTP or elevated session), or
 * 2) Logged-in learner whose email is on the admin allowlist.
 */
export function getAdminAccess(req: NextRequest):
  | { ok: true; email: string; via: 'admin_cookie' | 'learner_session' }
  | { ok: false } {
  const admin = readAdminSession(req.cookies.get(COOKIE_NAME)?.value);
  if (admin) {
    return { ok: true, email: admin.email, via: 'admin_cookie' };
  }

  const learner = verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (learner?.email && isAdminEmail(learner.email)) {
    return {
      ok: true,
      email: normalizeEmail(learner.email),
      via: 'learner_session',
    };
  }

  return { ok: false };
}

export function assertAdmin(req: NextRequest): boolean {
  return getAdminAccess(req).ok;
}

// ── OTP helpers ───────────────────────────────────────────────────────────────

export function generateOtpCode(): string {
  return String(crypto.randomInt(100000, 999999));
}

export async function hashOtp(code: string): Promise<string> {
  return hashPassword(code);
}

export async function verifyOtpCode(code: string, storedHash: string): Promise<boolean> {
  return verifyPassword(code, storedHash);
}

export const ADMIN_OTP = {
  ttlMs: OTP_TTL_MS,
  resendMs: OTP_RESEND_MS,
  maxAttempts: OTP_MAX_ATTEMPTS,
} as const;
