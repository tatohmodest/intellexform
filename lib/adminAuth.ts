import crypto from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(crypto.scrypt);

export const COOKIE_NAME = 'intellex_admin';
export const DEFAULT_PASSWORD = 'modestwilton';

function getSecret(): string {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error('ADMIN_SECRET environment variable is not set');
  return s;
}

// ── Password hashing (scrypt — memory-hard, secure) ───────────────────────────

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

// ── Session token (HMAC-signed, stateless, 8-hour expiry) ─────────────────────

export function createSessionToken(): string {
  const payload = JSON.stringify({ sub: 'admin', iat: Date.now() });
  const b64 = Buffer.from(payload).toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSecret())
    .update(b64)
    .digest('hex');
  return `${b64}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    const dot = token.lastIndexOf('.');
    if (dot === -1) return false;

    const b64 = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const expected = crypto
      .createHmac('sha256', getSecret())
      .update(b64)
      .digest('hex');

    // Constant-time comparison
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return false;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;

    const { iat } = JSON.parse(Buffer.from(b64, 'base64url').toString());
    return Date.now() - iat < 8 * 60 * 60 * 1000; // 8 hours
  } catch {
    return false;
  }
}
