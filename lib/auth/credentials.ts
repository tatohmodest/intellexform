/**
 * Email + password auth.
 * Signup emails a verification link. After the learner verifies, they sign in
 * with email and password. Forgot-password uses a one-time reset link.
 *
 * Mongo is the source of truth for credentials. Prisma/Postgres is synced
 * when reachable and must never block sending mail.
 */

import { createHash, randomBytes } from 'crypto';
import { getDb } from '@/lib/repo';
import { prisma } from '@/lib/db/prisma';
import { hashPassword, normalizeEmail, verifyPassword } from '@/lib/adminAuth';
import {
  sendLearnerPasswordResetEmail,
  sendLearnerVerifyEmail,
} from '@/lib/email';
import { createSession, type SessionUser } from '@/lib/auth/session';
import { isOnboardingComplete } from '@/lib/learn/identity';
import type { LearnerDoc } from '@/lib/learn/repo';
import { PERSONAL_CONTEXT } from '@/lib/learn/identity';
import { withTimeout } from '@/lib/withTimeout';

const PRISMA_MS = 3_500;

export const AUTH_LINK = {
  verifyTtlMs: 24 * 60 * 60 * 1000,
  resetTtlMs: 60 * 60 * 1000,
  resendMs: 60 * 1000,
} as const;

type PendingSignup = {
  email: string;
  name: string;
  passwordHash: string;
  tokenHash?: string;
  tokenSentAt?: Date;
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

type AuthError = { error: string; status: number; unverified?: boolean };

function splitName(name: string): { firstName: string | null; lastName: string | null } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: null, lastName: null };
  if (parts.length === 1) return { firstName: parts[0], lastName: null };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function newLocalUserId() {
  return `usr_${randomBytes(12).toString('hex')}`;
}

function generateLinkToken() {
  return randomBytes(32).toString('base64url');
}

function hashLinkToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function smtpErrorMessage(err: unknown) {
  if (err instanceof Error && err.message === 'smtp_not_configured') {
    return 'Email delivery is not configured.';
  }
  if (err instanceof Error && err.message === 'smtp_timeout') {
    return 'Could not send the email in time. Please try again.';
  }
  return 'Could not send the email. Please try again.';
}

async function pendingCol() {
  const db = await getDb();
  await db.collection('auth_pending_signups').createIndex({ email: 1 }, { unique: true }).catch(() => {});
  await db.collection('auth_pending_signups').createIndex({ tokenHash: 1 }).catch(() => {});
  return db.collection('auth_pending_signups');
}

async function credentialsCol() {
  const db = await getDb();
  await db.collection('auth_credentials').createIndex({ email: 1 }, { unique: true }).catch(() => {});
  await db.collection('auth_credentials').createIndex({ userId: 1 }).catch(() => {});
  return db.collection('auth_credentials');
}

async function resetsCol() {
  const db = await getDb();
  await db.collection('auth_password_resets').createIndex({ tokenHash: 1 }, { unique: true }).catch(() => {});
  await db.collection('auth_password_resets').createIndex({ email: 1 }).catch(() => {});
  return db.collection('auth_password_resets');
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
  emailVerified?: Date | null;
  touchLogin?: boolean;
}): Promise<{ id: string } | null> {
  const { firstName, lastName } = splitName(opts.name);
  const now = new Date();
  const verifiedAt = opts.emailVerified === undefined ? now : opts.emailVerified;
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
          emailVerified: verifiedAt,
          lastLoginAt: opts.touchLogin ? now : undefined,
          globalRole: 'USER',
        },
        update: {
          name: opts.name,
          firstName,
          lastName,
          passwordHash: opts.passwordHash,
          ...(verifiedAt ? { emailVerified: verifiedAt } : {}),
          ...(opts.touchLogin ? { lastLoginAt: now } : {}),
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

async function loadAccount(email: string): Promise<{
  account: CredentialAccount | null;
  timedOut: boolean;
}> {
  const creds = await credentialsCol();
  const existing = (await creds.findOne({ email })) as CredentialAccount | null;
  if (existing?.passwordHash) return { account: existing, timedOut: false };

  const prismaLookup = await prismaUserByEmail(email);
  if (prismaLookup.user?.passwordHash) {
    const now = new Date();
    const account: CredentialAccount = {
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
    return { account, timedOut: false };
  }

  return { account: existing, timedOut: prismaLookup.timedOut };
}

async function persistAccount(account: CredentialAccount) {
  const creds = await credentialsCol();
  const now = new Date();
  await creds.updateOne(
    { email: account.email },
    {
      $set: {
        email: account.email,
        passwordHash: account.passwordHash,
        userId: account.userId,
        name: account.name,
        emailVerified: account.emailVerified,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: account.createdAt || now },
    },
    { upsert: true },
  );
}

async function sendVerificationForPending(opts: {
  pending: PendingSignup;
  origin: string;
}): Promise<{ ok: true } | AuthError> {
  const email = opts.pending.email;
  const pending = await pendingCol();
  if (
    opts.pending.tokenSentAt &&
    Date.now() - new Date(opts.pending.tokenSentAt).getTime() < AUTH_LINK.resendMs
  ) {
    return { error: 'Please wait a minute before requesting another email.', status: 429 };
  }

  const token = generateLinkToken();
  const tokenHash = hashLinkToken(token);
  const now = new Date();
  await pending.updateOne(
    { email },
    {
      $set: {
        tokenHash,
        tokenSentAt: now,
        expiresAt: new Date(now.getTime() + AUTH_LINK.verifyTtlMs),
      },
    },
  );

  const verifyUrl = `${opts.origin.replace(/\/$/, '')}/verify-email?token=${encodeURIComponent(token)}`;
  try {
    await sendLearnerVerifyEmail({ to: email, verifyUrl });
  } catch (err) {
    console.error('verify email failed:', err);
    await pending
      .updateOne({ email }, { $unset: { tokenHash: '', tokenSentAt: '' } })
      .catch(() => {});
    return { error: smtpErrorMessage(err), status: 503 };
  }
  return { ok: true };
}

export async function startSignup(opts: {
  name: string;
  email: string;
  password: string;
  origin: string;
}): Promise<{ ok: true; email: string } | AuthError> {
  const email = normalizeEmail(opts.email);
  const name = opts.name.trim().slice(0, 120);
  const password = opts.password;

  if (name.length < 2) return { error: 'Enter your name.', status: 400 };
  if (!email.includes('@')) return { error: 'Enter a valid email.', status: 400 };
  if (password.length < 8) return { error: 'Password must be at least 8 characters.', status: 400 };
  if (!opts.origin) return { error: 'Could not build a verification link.', status: 500 };

  const { account } = await loadAccount(email);
  if (account?.passwordHash && account.emailVerified) {
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
        expiresAt: new Date(now.getTime() + AUTH_LINK.verifyTtlMs),
      } satisfies Omit<PendingSignup, 'tokenHash' | 'tokenSentAt'>,
    },
    { upsert: true },
  );
  const row = (await pending.findOne({ email })) as PendingSignup | null;
  if (!row) return { error: 'Could not start signup. Please try again.', status: 500 };

  const sent = await sendVerificationForPending({ pending: row, origin: opts.origin });
  if ('error' in sent) return sent;
  return { ok: true, email };
}

export async function resendVerification(opts: {
  email: string;
  origin: string;
}): Promise<{ ok: true; email: string } | AuthError> {
  const email = normalizeEmail(opts.email);
  if (!email.includes('@')) return { error: 'Enter a valid email.', status: 400 };

  const { account } = await loadAccount(email);
  if (account?.emailVerified) {
    return { error: 'This email is already verified. Sign in instead.', status: 409 };
  }

  const pending = await pendingCol();
  let row = (await pending.findOne({ email })) as PendingSignup | null;
  if (!row?.passwordHash && account?.passwordHash) {
    const now = new Date();
    await pending.updateOne(
      { email },
      {
        $set: {
          email,
          name: account.name,
          passwordHash: account.passwordHash,
          createdAt: now,
          expiresAt: new Date(now.getTime() + AUTH_LINK.verifyTtlMs),
        },
      },
      { upsert: true },
    );
    row = (await pending.findOne({ email })) as PendingSignup | null;
  }
  if (!row?.passwordHash) {
    return { error: 'Start signup again — this email is not pending verification.', status: 400 };
  }

  const sent = await sendVerificationForPending({ pending: row, origin: opts.origin });
  if ('error' in sent) return sent;
  return { ok: true, email };
}

export async function verifyEmailToken(
  token: string,
): Promise<{ ok: true; email: string } | AuthError> {
  const raw = String(token || '').trim();
  if (!raw) return { error: 'Missing verification link.', status: 400 };

  const tokenHash = hashLinkToken(raw);
  const pending = await pendingCol();
  const p = (await pending.findOne({ tokenHash })) as PendingSignup | null;
  if (!p?.passwordHash) {
    return {
      error: 'This link is invalid or has already been used. If you already verified, sign in.',
      status: 400,
    };
  }
  if (new Date(p.expiresAt).getTime() < Date.now()) {
    return { error: 'This verification link expired. Sign up again to get a new one.', status: 400 };
  }

  const email = normalizeEmail(p.email);
  const { account: existingCred } = await loadAccount(email);
  if (existingCred?.emailVerified) {
    await pending.deleteOne({ email }).catch(() => {});
    return { ok: true, email };
  }

  const now = new Date();
  const prismaUser = await syncPrismaUser({
    email,
    name: p.name,
    passwordHash: p.passwordHash,
    emailVerified: now,
    touchLogin: false,
  });
  const userId = prismaUser?.id || existingCred?.userId || newLocalUserId();

  await persistAccount({
    email,
    passwordHash: p.passwordHash,
    userId,
    name: p.name,
    emailVerified: now,
    createdAt: existingCred?.createdAt || now,
    updatedAt: now,
  });
  await upsertLearnerLocal({ id: userId, email, name: p.name });
  await pending.deleteOne({ email });
  return { ok: true, email };
}

export async function completeLogin(opts: {
  email: string;
  password: string;
}): Promise<
  | { ok: true; session: string; nextPath: string; user: Omit<SessionUser, 'iat'> }
  | AuthError
> {
  const email = normalizeEmail(opts.email);
  if (!email.includes('@')) return { error: 'Enter a valid email.', status: 400 };
  if (!opts.password) return { error: 'Enter your password.', status: 400 };

  const loaded = await loadAccount(email);
  if (!loaded.account?.passwordHash) {
    if (loaded.timedOut) {
      return {
        error: 'Sign-in is taking too long. Please try again in a moment.',
        status: 503,
      };
    }
    return { error: 'Invalid email or password.', status: 401 };
  }

  const account = loaded.account;
  const ok = await verifyPassword(opts.password, account.passwordHash);
  if (!ok) return { error: 'Invalid email or password.', status: 401 };

  if (!account.emailVerified) {
    return {
      error: 'Verify your email first. Open the link we sent, then come back and sign in.',
      status: 403,
      unverified: true,
    };
  }

  const prismaUser = await syncPrismaUser({
    email,
    name: account.name,
    passwordHash: account.passwordHash,
    emailVerified: account.emailVerified,
    touchLogin: true,
  });
  const userId = account.userId || prismaUser?.id || newLocalUserId();

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

export async function requestPasswordReset(opts: {
  email: string;
  origin: string;
}): Promise<{ ok: true }> {
  const email = normalizeEmail(opts.email);
  if (!email.includes('@') || !opts.origin) return { ok: true };

  const { account } = await loadAccount(email);
  if (!account?.passwordHash) {
    const pending = await pendingCol();
    const p = (await pending.findOne({ email })) as PendingSignup | null;
    if (p?.passwordHash) {
      await sendVerificationForPending({ pending: p, origin: opts.origin }).catch(() => {});
    }
    return { ok: true };
  }
  if (!account.emailVerified) {
    await resendVerification({ email, origin: opts.origin }).catch(() => {});
    return { ok: true };
  }

  const resets = await resetsCol();
  const recent = await resets.findOne({ email });
  if (
    recent?.createdAt &&
    Date.now() - new Date(recent.createdAt).getTime() < AUTH_LINK.resendMs
  ) {
    return { ok: true };
  }

  const token = generateLinkToken();
  const tokenHash = hashLinkToken(token);
  const now = new Date();
  await resets.deleteMany({ email }).catch(() => {});
  await resets.insertOne({
    email,
    tokenHash,
    createdAt: now,
    expiresAt: new Date(now.getTime() + AUTH_LINK.resetTtlMs),
  });

  const resetUrl = `${opts.origin.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
  try {
    await sendLearnerPasswordResetEmail({ to: email, resetUrl });
  } catch (err) {
    console.error('password reset email failed:', err);
    await resets.deleteMany({ email }).catch(() => {});
  }
  return { ok: true };
}

export async function resetPassword(opts: {
  token: string;
  password: string;
}): Promise<{ ok: true } | AuthError> {
  const raw = String(opts.token || '').trim();
  if (!raw) return { error: 'Missing reset link.', status: 400 };
  if (opts.password.length < 8) {
    return { error: 'Password must be at least 8 characters.', status: 400 };
  }

  const tokenHash = hashLinkToken(raw);
  const resets = await resetsCol();
  const row = await resets.findOne({ tokenHash });
  if (!row?.email) {
    return { error: 'This reset link is invalid or has already been used.', status: 400 };
  }
  if (new Date(row.expiresAt).getTime() < Date.now()) {
    await resets.deleteOne({ tokenHash }).catch(() => {});
    return { error: 'This reset link expired. Request a new one.', status: 400 };
  }

  const email = normalizeEmail(String(row.email));
  const loaded = await loadAccount(email);
  if (!loaded.account?.passwordHash) {
    await resets.deleteOne({ tokenHash }).catch(() => {});
    return { error: 'No account found for this reset link.', status: 400 };
  }

  const passwordHash = await hashPassword(opts.password);
  const account = loaded.account;
  const prismaUser = await syncPrismaUser({
    email,
    name: account.name,
    passwordHash,
    emailVerified: account.emailVerified || new Date(),
    touchLogin: false,
  });
  const userId = prismaUser?.id || account.userId;
  await persistAccount({
    ...account,
    userId,
    passwordHash,
    updatedAt: new Date(),
  });
  await resets.deleteMany({ email }).catch(() => {});
  return { ok: true };
}
