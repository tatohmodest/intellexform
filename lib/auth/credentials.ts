/**
 * Email + password auth with OTP verification (signup + login).
 * Replaces LoopingBinary OAuth for learner accounts.
 *
 * Mongo is the source of truth for credentials (same store as learners).
 * Prisma/Postgres is synced when reachable, but a hung DATABASE_URL must
 * never block sending the OTP email.
 */

import { randomBytes } from 'crypto';
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
import { withTimeout } from '@/lib/withTimeout';

export const AUTH_OTP = {
  ttlMs: ADMIN_OTP.ttlMs,
  resendMs: ADMIN_OTP.resendMs,
  maxAttempts: ADMIN_OTP.maxAttempts,
} as const;

const PRISMA_MS = 3_500;

export type AuthOtpPurpose = 'signup' | 'login';

type PendingSignup = {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  expiresAt: Date;
};

type CredentialAccount = {
  email: string;
  passwordHash: string;
  userId: string;
  name: string;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function splitName(name: string): { firstName: string | null; lastName: string | null } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: null, lastName: null };
  if (parts.length === 1) return { firstName: parts[0], lastName: null };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function newLocalUserId() {
  return `usr_${randomBytes(12).toString('hex')}`;
}

function smtpErrorMessage(err: unknown) {
  if (err instanceof Error && err.message === 'smtp_not_configured') {
    return 'Email delivery is not configured.';
  }
  if (err instanceof Error && err.message === 'smtp_timeout') {
    return 'Could not send the code in time. Please try again.';
  }
  return 'Could not send code. Please try again.';
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

async function credentialsCol() {
  const db = await getDb();
  await db.collection('auth_credentials').createIndex({ email: 1 }, { unique: true }).catch(() => {});
  await db.collection('auth_credentials').createIndex({ userId: 1 }).catch(() => {});
  return db.collection('auth_credentials');
}

async function prismaUserByEmail(email: string): Promise<{
  user: {
    id: string;
    email: string;
    name: string | null;
    passwordHash: string | null;
    emailVerified: Date | null;
    image: string | null;
  } | null;
  timedOut: boolean;
}> {
  try {
    const user = await withTimeout(
      prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          passwordHash: true,
          emailVerified: true,
          image: true,
        },
      }),
      PRISMA_MS,
      'prisma',
    );
    return { user, timedOut: false };
  } catch (err) {
    console.error('prisma user lookup failed:', err);
    return { user: null, timedOut: true };
  }
}

async function syncPrismaUser(opts: {
  email: string;
  name: string;
  passwordHash: string;
}): Promise<{ id: string } | null> {
  const { firstName, lastName } = splitName(opts.name);
  const now = new Date();
  try {
    const user = await withTimeout(
      prisma.user.upsert({
        where: { email: opts.email },
        create: {
          email: opts.email,
          name: opts.name,
          firstName,
          lastName,
          passwordHash: opts.passwordHash,
          emailVerified: now,
          lastLoginAt: now,
          globalRole: 'USER',
        },
        update: {
          name: opts.name,
          firstName,
          lastName,
          passwordHash: opts.passwordHash,
          emailVerified: now,
          lastLoginAt: now,
        },
        select: { id: true },
      }),
      PRISMA_MS,
      'prisma',
    );
    return user;
  } catch (err) {
    console.error('prisma user sync failed:', err);
    return null;
  }
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
    const doc = await col.findOne(
      { lbId: opts.id },
      { projection: { _id: 0, passwordHash: 0 } },
    );
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
    await col.deleteOne({ email, purpose: opts.purpose }).catch(() => {});
    return { error: smtpErrorMessage(err), status: 503 };
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

  const creds = await credentialsCol();
  const existingCred = (await creds.findOne({ email })) as CredentialAccount | null;
  if (existingCred?.passwordHash && existingCred.emailVerified) {
    return { error: 'An account with this email already exists. Sign in instead.', status: 409 };
  }

  const prismaLookup = await prismaUserByEmail(email);
  if (prismaLookup.user?.passwordHash && prismaLookup.user.emailVerified) {
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

  const creds = await credentialsCol();
  let account = (await creds.findOne({ email })) as CredentialAccount | null;

  if (!account?.passwordHash) {
    const prismaLookup = await prismaUserByEmail(email);
    if (prismaLookup.user?.passwordHash) {
      const now = new Date();
      account = {
        email,
        passwordHash: prismaLookup.user.passwordHash,
        userId: prismaLookup.user.id,
        name: prismaLookup.user.name || email.split('@')[0],
        emailVerified: prismaLookup.user.emailVerified,
        createdAt: now,
        updatedAt: now,
      };
      await creds
        .updateOne(
          { email },
          {
            $set: {
              email,
              passwordHash: account.passwordHash,
              userId: account.userId,
              name: account.name,
              emailVerified: account.emailVerified,
              updatedAt: now,
            },
            $setOnInsert: { createdAt: now },
          },
          { upsert: true },
        )
        .catch((err) => console.error('backfill auth_credentials failed:', err));
    } else if (prismaLookup.timedOut) {
      return {
        error: 'Sign-in is taking too long. Please try again in a moment.',
        status: 503,
      };
    }
  }

  if (!account?.passwordHash) {
    return { error: 'Invalid email or password.', status: 401 };
  }

  if (!account.emailVerified) {
    const pending = await pendingCol();
    const p = await pending.findOne({ email });
    if (!p) {
      return {
        error: 'Verify your email first. Request a new code from Sign up.',
        status: 403,
      };
    }
  }

  const ok = await verifyPassword(opts.password, account.passwordHash);
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
    if (!p) {
      return { error: 'Start signup again — this email is not pending verification.', status: 400 };
    }
  } else {
    const creds = await credentialsCol();
    const account = await creds.findOne({ email });
    if (!account?.passwordHash) {
      const prismaLookup = await prismaUserByEmail(email);
      if (!prismaLookup.user?.passwordHash) {
        if (prismaLookup.timedOut) {
          return {
            error: 'Could not look up this account in time. Please try again.',
            status: 503,
          };
        }
        return { error: 'No account found for this email.', status: 404 };
      }
    }
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

  const creds = await credentialsCol();
  const existingCred = (await creds.findOne({ email })) as CredentialAccount | null;
  const prismaUser = await syncPrismaUser({
    email,
    name: p.name,
    passwordHash: p.passwordHash,
  });
  const userId = prismaUser?.id || existingCred?.userId || newLocalUserId();
  const now = new Date();

  await creds.updateOne(
    { email },
    {
      $set: {
        email,
        passwordHash: p.passwordHash,
        userId,
        name: p.name,
        emailVerified: now,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  await pending.deleteOne({ email });
  const learner = await upsertLearnerLocal({
    id: userId,
    email,
    name: p.name,
  });

  const sessionUser = {
    uid: userId,
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

  const creds = await credentialsCol();
  let account = (await creds.findOne({ email })) as CredentialAccount | null;
  if (!account?.passwordHash) {
    const prismaLookup = await prismaUserByEmail(email);
    if (!prismaLookup.user?.passwordHash) {
      return { error: 'Account not found.', status: 404 };
    }
    account = {
      email,
      passwordHash: prismaLookup.user.passwordHash,
      userId: prismaLookup.user.id,
      name: prismaLookup.user.name || email.split('@')[0],
      emailVerified: prismaLookup.user.emailVerified,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  const now = new Date();
  const prismaUser = await syncPrismaUser({
    email,
    name: account.name,
    passwordHash: account.passwordHash,
  });
  const userId = prismaUser?.id || account.userId;

  await creds.updateOne(
    { email },
    {
      $set: {
        email,
        passwordHash: account.passwordHash,
        userId,
        name: account.name,
        emailVerified: now,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  const learner = await upsertLearnerLocal({
    id: userId,
    email,
    name: account.name || email.split('@')[0],
  });

  const sessionUser = {
    uid: userId,
    name: learner.name || account.name || 'Learner',
    email,
  };
  const session = createSession(sessionUser);
  const nextPath = isOnboardingComplete(learner) ? '/dashboard' : '/dashboard/onboarding';
  return { ok: true, session, nextPath, user: sessionUser };
}
