/**
 * Email + password auth with OTP verification (signup + login).
 * Replaces LoopingBinary OAuth for learner accounts.
 */

import { getDb } from '@/lib/repo';
import { prisma } from '@/lib/db/prisma';
import {
  generateOtpCode,
  hashOtp,
  hashPassword,
  normalizeEmail,
  verifyOtpCode,
  verifyPassword,
  ADMIN_OTP,
} from '@/lib/adminAuth';
import { sendLearnerAuthOtpEmail } from '@/lib/email';
import { createSession, type SessionUser } from '@/lib/auth/session';
import { isOnboardingComplete } from '@/lib/learn/identity';
import type { LearnerDoc } from '@/lib/learn/repo';
import { PERSONAL_CONTEXT } from '@/lib/learn/identity';

export const AUTH_OTP = {
  ttlMs: ADMIN_OTP.ttlMs,
  resendMs: ADMIN_OTP.resendMs,
  maxAttempts: ADMIN_OTP.maxAttempts,
} as const;

export type AuthOtpPurpose = 'signup' | 'login';

type PendingSignup = {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  expiresAt: Date;
};

function splitName(name: string): { firstName: string | null; lastName: string | null } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: null, lastName: null };
  if (parts.length === 1) return { firstName: parts[0], lastName: null };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

async function otpsCol() {
  const db = await getDb();
  await db.collection('auth_otps').createIndex({ email: 1, purpose: 1 }).catch(() => {});
  return db.collection('auth_otps');
}

async function pendingCol() {
  const db = await getDb();
  await db.collection('auth_pending_signups').createIndex({ email: 1 }, { unique: true }).catch(() => {});
  return db.collection('auth_pending_signups');
}

export async function upsertLearnerLocal(opts: {
  id: string;
  email: string;
  name: string;
}): Promise<LearnerDoc> {
  const base: LearnerDoc = {
    lbId: opts.id,
    email: opts.email,
    name: opts.name,
    avatar: undefined,
    roles: ['student'],
    onboardingComplete: false,
    primaryIntent: null,
    joinPath: null,
    affiliations: [],
    activeContext: PERSONAL_CONTEXT,
    xp: 0,
    streakCount: 0,
    lastActiveDay: null,
    weeklyGoalMinutes: 150,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };
  try {
    const db = await getDb();
    const col = db.collection('learners');
    await col.createIndex({ lbId: 1 }, { unique: true }).catch(() => {});
    await col.createIndex({ email: 1 }).catch(() => {});
    await col.updateOne(
      { lbId: opts.id },
      {
        $set: {
          email: opts.email,
          name: opts.name,
          lastLoginAt: new Date(),
        },
        $setOnInsert: {
          lbId: opts.id,
          roles: ['student'],
          onboardingComplete: false,
          primaryIntent: null,
          joinPath: null,
          affiliations: [],
          activeContext: PERSONAL_CONTEXT,
          xp: 0,
          streakCount: 0,
          lastActiveDay: null,
          weeklyGoalMinutes: 150,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
    const doc = await col.findOne({ lbId: opts.id }, { projection: { _id: 0 } });
    return (doc as unknown as LearnerDoc) ?? base;
  } catch (err) {
    console.error('upsertLearnerLocal failed:', err);
    return base;
  }
}

async function issueOtp(opts: {
  email: string;
  purpose: AuthOtpPurpose;
}): Promise<{ ok: true; expiresInSec: number } | { error: string; status: number }> {
  const email = normalizeEmail(opts.email);
  const col = await otpsCol();
  const existing = await col.findOne({ email, purpose: opts.purpose });
  if (
    existing?.createdAt &&
    Date.now() - new Date(existing.createdAt).getTime() < AUTH_OTP.resendMs
  ) {
    return { error: 'Please wait a minute before requesting another code.', status: 429 };
  }

  const code = generateOtpCode();
  const codeHash = await hashOtp(code);
  const now = new Date();
  await col.updateOne(
    { email, purpose: opts.purpose },
    {
      $set: {
        email,
        purpose: opts.purpose,
        codeHash,
        attempts: 0,
        expiresAt: new Date(now.getTime() + AUTH_OTP.ttlMs),
        createdAt: now,
      },
    },
    { upsert: true },
  );

  try {
    await sendLearnerAuthOtpEmail({
      to: email,
      code,
      purpose: opts.purpose,
    });
  } catch (err) {
    console.error('auth otp email failed:', err);
    const msg =
      err instanceof Error && err.message === 'smtp_not_configured'
        ? 'Email delivery is not configured.'
        : 'Could not send code. Please try again.';
    return { error: msg, status: 503 };
  }

  return { ok: true, expiresInSec: Math.floor(AUTH_OTP.ttlMs / 1000) };
}

export async function startSignup(opts: {
  name: string;
  email: string;
  password: string;
}): Promise<{ ok: true; email: string; expiresInSec: number } | { error: string; status: number }> {
  const email = normalizeEmail(opts.email);
  const name = opts.name.trim().slice(0, 120);
  const password = opts.password;

  if (name.length < 2) return { error: 'Enter your name.', status: 400 };
  if (!email.includes('@')) return { error: 'Enter a valid email.', status: 400 };
  if (password.length < 8) return { error: 'Password must be at least 8 characters.', status: 400 };

  const existing = await prisma.user.findUnique({ where: { email } }).catch(() => null);
  if (existing?.passwordHash && existing.emailVerified) {
    return { error: 'An account with this email already exists. Sign in instead.', status: 409 };
  }

  const passwordHash = await hashPassword(password);
  const pending = await pendingCol();
  const now = new Date();
  await pending.updateOne(
    { email },
    {
      $set: {
        email,
        name,
        passwordHash,
        createdAt: now,
        expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      } satisfies PendingSignup,
    },
    { upsert: true },
  );

  const otp = await issueOtp({ email, purpose: 'signup' });
  if ('error' in otp) return otp;
  return { ok: true, email, expiresInSec: otp.expiresInSec };
}

export async function startLogin(opts: {
  email: string;
  password: string;
}): Promise<{ ok: true; email: string; expiresInSec: number } | { error: string; status: number }> {
  const email = normalizeEmail(opts.email);
  if (!email.includes('@')) return { error: 'Enter a valid email.', status: 400 };
  if (!opts.password) return { error: 'Enter your password.', status: 400 };

  const user = await prisma.user.findUnique({ where: { email } }).catch(() => null);
  if (!user?.passwordHash) {
    return { error: 'Invalid email or password.', status: 401 };
  }
  if (!user.emailVerified) {
    // Allow completing signup verification
    const pending = await pendingCol();
    const p = await pending.findOne({ email });
    if (!p) {
      return {
        error: 'Verify your email first. Request a new code from Sign up.',
        status: 403,
      };
    }
  }

  const ok = await verifyPassword(opts.password, user.passwordHash);
  if (!ok) return { error: 'Invalid email or password.', status: 401 };

  const otp = await issueOtp({ email, purpose: 'login' });
  if ('error' in otp) return otp;
  return { ok: true, email, expiresInSec: otp.expiresInSec };
}

export async function resendAuthOtp(opts: {
  email: string;
  purpose: AuthOtpPurpose;
}): Promise<{ ok: true; expiresInSec: number } | { error: string; status: number }> {
  const email = normalizeEmail(opts.email);
  if (opts.purpose === 'signup') {
    const pending = await pendingCol();
    const p = await pending.findOne({ email });
    if (!p) return { error: 'Start signup again — this email is not pending verification.', status: 400 };
  } else {
    const user = await prisma.user.findUnique({ where: { email } }).catch(() => null);
    if (!user?.passwordHash) return { error: 'No account found for this email.', status: 404 };
  }
  const otp = await issueOtp({ email, purpose: opts.purpose });
  if ('error' in otp) return otp;
  return { ok: true, expiresInSec: otp.expiresInSec };
}

async function consumeOtp(
  email: string,
  purpose: AuthOtpPurpose,
  code: string,
): Promise<{ ok: true } | { error: string; status: number }> {
  const col = await otpsCol();
  const row = await col.findOne({ email, purpose });
  if (!row?.codeHash) return { error: 'No code found. Request a new one.', status: 400 };
  if (new Date(row.expiresAt).getTime() < Date.now()) {
    return { error: 'Code expired. Request a new one.', status: 400 };
  }
  if (Number(row.attempts || 0) >= AUTH_OTP.maxAttempts) {
    return { error: 'Too many attempts. Request a new code.', status: 429 };
  }

  const match = await verifyOtpCode(code.trim(), String(row.codeHash));
  if (!match) {
    await col.updateOne({ email, purpose }, { $inc: { attempts: 1 } });
    return { error: 'Incorrect code. Try again.', status: 401 };
  }

  await col.deleteOne({ email, purpose });
  return { ok: true };
}

export async function verifySignupOtp(opts: {
  email: string;
  code: string;
}): Promise<
  | { ok: true; session: string; nextPath: string; user: Omit<SessionUser, 'iat'> }
  | { error: string; status: number }
> {
  const email = normalizeEmail(opts.email);
  const consumed = await consumeOtp(email, 'signup', opts.code);
  if ('error' in consumed) return consumed;

  const pending = await pendingCol();
  const p = (await pending.findOne({ email })) as PendingSignup | null;
  if (!p?.passwordHash) {
    return { error: 'Signup expired. Start again.', status: 400 };
  }

  const { firstName, lastName } = splitName(p.name);
  const now = new Date();
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: p.name,
      firstName,
      lastName,
      passwordHash: p.passwordHash,
      emailVerified: now,
      lastLoginAt: now,
      globalRole: 'USER',
    },
    update: {
      name: p.name,
      firstName,
      lastName,
      passwordHash: p.passwordHash,
      emailVerified: now,
      lastLoginAt: now,
    },
  });

  await pending.deleteOne({ email });
  const learner = await upsertLearnerLocal({
    id: user.id,
    email,
    name: p.name,
  });

  const sessionUser = {
    uid: user.id,
    name: learner.name || p.name,
    email,
  };
  const session = createSession(sessionUser);
  const nextPath = isOnboardingComplete(learner) ? '/dashboard' : '/dashboard/onboarding';
  return { ok: true, session, nextPath, user: sessionUser };
}

export async function verifyLoginOtp(opts: {
  email: string;
  code: string;
}): Promise<
  | { ok: true; session: string; nextPath: string; user: Omit<SessionUser, 'iat'> }
  | { error: string; status: number }
> {
  const email = normalizeEmail(opts.email);
  const consumed = await consumeOtp(email, 'login', opts.code);
  if ('error' in consumed) return consumed;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) return { error: 'Account not found.', status: 404 };

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date(), emailVerified: user.emailVerified ?? new Date() },
  });

  const learner = await upsertLearnerLocal({
    id: user.id,
    email,
    name: user.name || email.split('@')[0],
  });

  const sessionUser = {
    uid: user.id,
    name: learner.name || user.name || 'Learner',
    email,
    avatar: user.image || undefined,
  };
  const session = createSession(sessionUser);
  const nextPath = isOnboardingComplete(learner) ? '/dashboard' : '/dashboard/onboarding';
  return { ok: true, session, nextPath, user: sessionUser };
}
