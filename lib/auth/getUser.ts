import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySession, type SessionUser } from '@/lib/auth/session';

/** Read + verify the learner session from the request cookies (server-side). */
export function getSessionUser(): SessionUser | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySession(token);
}
