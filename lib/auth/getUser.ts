import { cookies, headers } from 'next/headers';
import { SESSION_COOKIE, verifySession, type SessionUser } from '@/lib/auth/session';
import { cookieValues } from '@/lib/auth/cookies';

/**
 * Read + verify the learner session from the request cookies (server-side).
 * Browsers send duplicate `intellex_session` cookies when an old domain-wide
 * cookie coexists with the host-only one; use whichever one verifies.
 */
export function getSessionUser(): SessionUser | null {
  const primary = verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (primary) return primary;
  let raw: string | null = null;
  try {
    raw = headers().get('cookie');
  } catch {
    return null;
  }
  for (const token of cookieValues(raw, SESSION_COOKIE)) {
    const user = verifySession(token);
    if (user) return user;
  }
  return null;
}
