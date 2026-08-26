/**
 * Email + password auth.
 * Signup emails a verification link. Sign-in is password then a 6-digit email OTP.
 * Forgot-password emails a one-time reset link.
 *
 * Mongo is the source of truth for credentials. Prisma/Postgres is synced
 * when reachable and must never block sending mail.
 */

import { createHash, randomBytes } from 'crypto';
import { getDb } from '@/lib/repo';
import { prisma } from '@/lib/db/prisma';
import {
  generateOtpCode,
  hashOtp,
  hashPassword,
  normalizeEmail,
  verifyOtpCode,
  verifyPassword,
} from '@/lib/adminAuth';
import {
  isSmtpConfigured,
  sendLearnerLoginOtpEmail,
  sendLearnerPasswordResetEmail,
  sendLearnerVerifyEmail,
} from '@/lib/email';
import { createSession, type SessionUser } from '@/lib/auth/session';
import { isOnboardingComplete } from '@/lib/learn/identity';
import {
  ensureUniqueLearnerEmails,
  findLearnerByEmail,
  getLearner,
  type LearnerDoc,
} from '@/lib/learn/repo';
import { PERSONAL_CONTEXT } from '@/lib/learn/identity';
import { withTimeout } from '@/lib/withTimeout';

const PRISMA_MS = 3_500;

export const AUTH_LINK = {
  verifyTtlMs: 24 * 60 * 60 * 1000,
  resetTtlMs: 24 * 60 * 60 * 1000,
  resendMs: 60 * 1000,
} as const;

/** After password succeeds, a 6-digit email OTP must be confirmed. */
export const LOGIN_OTP = {
  ttlMs: 10 * 60 * 1000,
  resendMs: 60 * 1000,
  lockMs: 60 * 1000,
  maxAttempts: 4,
  passwordWindowMs: 15 * 60 * 1000,
} as const;

type LoginOtpDoc = {
  email: string;
  codeHash: string;
  attempts: number;
  lockedUntil?: Date | null;
  passwordOkAt: Date;
  createdAt: Date;
  expiresAt: Date;
};

type PendingSignup = {
  email: string;
  name: string;
  passwordHash: string;
  tokenHash?: string;
  tokenSentAt?: Date;
  createdAt: Date;
  expiresAt: Date;
};

type AuthLinkDoc = {
  tokenHash: string;
  purpose: 'verify' | 'reset';
  email: string;
  createdAt: Date;
  expiresAt: Date;
  usedAt?: Date | null;
};

export type AuthLinkPeek = {
  purpose: 'verify' | 'reset';
  email: string;
  used: boolean;
  expired: boolean;
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

type AuthError = {
  error: string;
  status: number;
  unverified?: boolean;
  remainingAttempts?: number;
  retryAfterSec?: number;
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

function generateLinkToken() {
  // Hex only — email clients and query parsers never mangle 0-9a-f.
  return randomBytes(32).toString('hex');
}

function normalizeToken(raw: string) {
  return String(raw || '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/^token=/i, '');
}

function hashLinkToken(token: string) {
  return createHash('sha256').update(normalizeToken(token)).digest('hex');
}

function smtpErrorMessage(err: unknown) {
  if (err instanceof Error && err.message === 'smtp_not_configured') {
    return 'Email delivery is not configured.';
  }
  if (err instanceof Error && err.message === 'smtp_timeout') {
    return 'Could not send the email in time. Please try again.';
  }
  if (err instanceof Error && err.message === 'smtp_auth') {
    return 'Email credentials were rejected. Check SMTP user, password, and From address.';
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
  await ensureUniqueLearnerEmails().catch(() => {});
  return db.collection('auth_credentials');
}

async function resetsCol() {
  const db = await getDb();
  await db.collection('auth_password_resets').createIndex({ tokenHash: 1 }, { unique: true }).catch(() => {});
  await db.collection('auth_password_resets').createIndex({ email: 1 }).catch(() => {});
  return db.collection('auth_password_resets');
}

async function linksCol() {
  const db = await getDb();
  await db.collection('auth_links').createIndex({ tokenHash: 1 }, { unique: true }).catch(() => {});
  await db.collection('auth_links').createIndex({ email: 1, purpose: 1, createdAt: -1 }).catch(() => {});
  return db.collection('auth_links');
}

async function loginOtpsCol() {
  const db = await getDb();
  await db.collection('login_otps').createIndex({ email: 1 }, { unique: true }).catch(() => {});
  await db.collection('login_otps').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => {});
  return db.collection('login_otps');
}

async function issueAuthLink(opts: {
  email: string;
  purpose: 'verify' | 'reset';
  ttlMs: number;
}): Promise<{ token: string } | AuthError> {
  const email = normalizeEmail(opts.email);
  const col = await linksCol();
  const recent = await col.findOne(
    { email, purpose: opts.purpose },
    { sort: { createdAt: -1 } },
  );
  if (
    recent?.createdAt &&
    !recent.usedAt &&
    Date.now() - new Date(recent.createdAt).getTime() < AUTH_LINK.resendMs
  ) {
    return { error: 'Please wait a minute before requesting another email.', status: 429 };
  }

  const token = generateLinkToken();
  const now = new Date();
  await col.insertOne({
    tokenHash: hashLinkToken(token),
    purpose: opts.purpose,
    email,
    createdAt: now,
    expiresAt: new Date(now.getTime() + opts.ttlMs),
    usedAt: null,
  } satisfies AuthLinkDoc);
  return { token };
}

async function lookupAuthLink(token: string): Promise<
  | (AuthLinkDoc & { source: 'links' | 'pending' | 'resets' })
  | null
> {
  const tokenHash = hashLinkToken(token);
  if (!tokenHash || !normalizeToken(token)) return null;

  const links = await linksCol();
  const modern = (await links.findOne({ tokenHash })) as AuthLinkDoc | null;
  if (modern?.email) return { ...modern, source: 'links' };

  const pending = await pendingCol();
  const p = (await pending.findOne({ tokenHash })) as PendingSignup | null;
  if (p?.email) {
    return {
      tokenHash,
      purpose: 'verify',
      email: p.email,
      createdAt: p.createdAt,
      expiresAt: p.expiresAt,
      usedAt: null,
      source: 'pending',
    };
  }

  const resets = await resetsCol();
  const r = await resets.findOne({ tokenHash });
  if (r?.email) {
    return {
      tokenHash,
      purpose: 'reset',
      email: String(r.email),
      createdAt: r.createdAt ? new Date(r.createdAt as Date) : new Date(),
      expiresAt: new Date(r.expiresAt as Date),
      usedAt: null,
      source: 'resets',
    };
  }
  return null;
}

export async function inspectAuthLink(token: string): Promise<AuthLinkPeek | null> {
  const raw = normalizeToken(token);
  if (!raw) return null;
  const row = await lookupAuthLink(raw);
  if (!row) return null;
  return {
    purpose: row.purpose,
    email: row.email,
    used: Boolean(row.usedAt),
    expired: new Date(row.expiresAt).getTime() < Date.now(),
  };
}

async function markLinkUsed(row: AuthLinkDoc & { source: 'links' | 'pending' | 'resets' }) {
  const now = new Date();
  if (row.source === 'links') {
    const col = await linksCol();
    await col.updateOne({ tokenHash: row.tokenHash }, { $set: { usedAt: now } });
    return;
  }
  if (row.source === 'pending') {
    const pending = await pendingCol();
    await pending.updateOne({ tokenHash: row.tokenHash }, { $unset: { tokenHash: '' } }).catch(() => {});
    return;
  }
  const resets = await resetsCol();
  await resets.deleteMany({ tokenHash: row.tokenHash }).catch(() => {});
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
    await ensureUniqueLearnerEmails().catch(() => {});
    const email = opts.email.trim().toLowerCase();
    const existing = await findLearnerByEmail(email);
    if (existing && existing.lbId !== opts.id) {
      await col.updateOne(
        { lbId: existing.lbId },
        {
          $set: {
            email,
            name: opts.name || existing.name,
            lastLoginAt: new Date(),
          },
        },
      );
      return (await getLearner(existing.lbId)) ?? existing;
    }
    try {
      await col.updateOne(
        { lbId: opts.id },
        {
          $set: {
            email,
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
    } catch (err) {
      const code = err && typeof err === 'object' && 'code' in err ? Number((err as { code?: number }).code) : 0;
      if (code === 11000) {
        const raced = await findLearnerByEmail(email);
        if (raced) {
          await col.updateOne(
            { lbId: raced.lbId },
            { $set: { email, name: opts.name || raced.name, lastLoginAt: new Date() } },
          );
          return (await getLearner(raced.lbId)) ?? raced;
        }
      }
      throw err;
    }
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

async function activateVerifiedAccount(opts: {
  email: string;
  name: string;
  passwordHash: string;
  existingUserId?: string;
}): Promise<{ userId: string }> {
  const email = normalizeEmail(opts.email);
  const now = new Date();
  const { account: existingCred } = await loadAccount(email);
  const prismaUser = await syncPrismaUser({
    email,
    name: opts.name,
    passwordHash: opts.passwordHash,
    emailVerified: now,
    touchLogin: false,
  });
  const existingLearner = await findLearnerByEmail(email);
  const userId =
    existingLearner?.lbId ||
    existingCred?.userId ||
    opts.existingUserId ||
    prismaUser?.id ||
    newLocalUserId();
  await persistAccount({
    email,
    passwordHash: opts.passwordHash,
    userId,
    name: opts.name,
    emailVerified: now,
    createdAt: existingCred?.createdAt || now,
    updatedAt: now,
  });
  await upsertLearnerLocal({ id: userId, email, name: opts.name });
  const pending = await pendingCol();
  await pending.deleteOne({ email }).catch(() => {});
  return { userId };
}

async function sendVerificationForPending(opts: {
  pending: PendingSignup;
  origin: string;
}): Promise<{ ok: true } | AuthError> {
  const email = opts.pending.email;
  const issued = await issueAuthLink({
    email,
    purpose: 'verify',
    ttlMs: AUTH_LINK.verifyTtlMs,
  });
  if ('error' in issued) return issued;

  const pending = await pendingCol();
  const now = new Date();
  await pending.updateOne(
    { email },
    {
      $set: {
        tokenHash: hashLinkToken(issued.token),
        tokenSentAt: now,
        expiresAt: new Date(now.getTime() + AUTH_LINK.verifyTtlMs),
      },
    },
  );

  const verifyUrl = `${opts.origin.replace(/\/$/, '')}/verify-email?token=${issued.token}`;
  try {
    await sendLearnerVerifyEmail({ to: email, verifyUrl });
  } catch (err) {
    console.error('verify email failed:', err);
    const col = await linksCol();
    await col.deleteOne({ tokenHash: hashLinkToken(issued.token) }).catch(() => {});
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
  if (account?.passwordHash) {
    return { error: 'An account with this email already exists. Sign in instead.', status: 409 };
  }
  const existingLearner = await findLearnerByEmail(email);
  if (existingLearner?.lbId) {
    const prismaLookup = await prismaUserByEmail(email);
    if (prismaLookup.user?.passwordHash) {
      return { error: 'An account with this email already exists. Sign in instead.', status: 409 };
    }
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
): Promise<{ ok: true; email: string } | { redirect: string } | AuthError> {
  const raw = normalizeToken(token);
  if (!raw) return { error: 'Missing verification link.', status: 400 };

  const row = await lookupAuthLink(raw);
  if (!row) {
    return {
      error: 'This link is invalid or has already been used. If you already verified, sign in.',
      status: 400,
    };
  }

  if (row.purpose === 'reset') {
    return { redirect: `/reset-password?token=${raw}` };
  }

  if (row.usedAt) {
    return { ok: true, email: normalizeEmail(row.email) };
  }
  if (new Date(row.expiresAt).getTime() < Date.now()) {
    return { error: 'This verification link expired. Sign up again to get a new one.', status: 400 };
  }

  const email = normalizeEmail(row.email);
  const pending = await pendingCol();
  const p = (await pending.findOne({ email })) as PendingSignup | null;
  const { account } = await loadAccount(email);

  if (account?.emailVerified) {
    await markLinkUsed(row);
    await pending.deleteOne({ email }).catch(() => {});
    return { ok: true, email };
  }

  const passwordHash = p?.passwordHash || account?.passwordHash;
  const name = p?.name || account?.name || email.split('@')[0];
  if (!passwordHash) {
    return { error: 'Signup expired. Start again.', status: 400 };
  }

  await activateVerifiedAccount({
    email,
    name,
    passwordHash,
    existingUserId: account?.userId,
  });
  await markLinkUsed(row);
  return { ok: true, email };
}

export async function completeLogin(opts: {
  email: string;
  password: string;
}): Promise<{ ok: true; email: string; expiresInSec: number } | AuthError> {
  return beginLogin(opts);
}

export async function beginLogin(opts: {
  email: string;
  password: string;
}): Promise<{ ok: true; email: string; expiresInSec: number } | AuthError> {
  const identifier = String(opts.email || '').trim();
  if (!identifier) return { error: 'Enter your email or matricule.', status: 400 };
  if (!opts.password) return { error: 'Enter your password.', status: 400 };

  let email = identifier.includes('@') ? normalizeEmail(identifier) : '';
  if (!email) {
    const { findAccountByMatricule } = await import('@/lib/learn/studentAccess');
    const byMatricule = await findAccountByMatricule(identifier);
    if (!byMatricule) return { error: 'Invalid matricule or password.', status: 401 };
    email = normalizeEmail(byMatricule.email);
  }

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

  return issueLoginOtp({ email, passwordAlreadyOk: true });
}

async function issueLoginOtp(opts: {
  email: string;
  passwordAlreadyOk: boolean;
}): Promise<{ ok: true; email: string; expiresInSec: number } | AuthError> {
  const email = normalizeEmail(opts.email);
  const col = await loginOtpsCol();
  const existing = (await col.findOne({ email })) as LoginOtpDoc | null;
  const now = Date.now();

  if (existing?.lockedUntil && new Date(existing.lockedUntil).getTime() > now) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((new Date(existing.lockedUntil).getTime() - now) / 1000),
    );
    return {
      error: `Too many incorrect codes. Wait ${retryAfterSec} seconds, then try again.`,
      status: 429,
      remainingAttempts: 0,
      retryAfterSec,
    };
  }

  if (
    existing?.createdAt &&
    existing.expiresAt &&
    new Date(existing.expiresAt).getTime() > now &&
    (existing.attempts || 0) < LOGIN_OTP.maxAttempts &&
    now - new Date(existing.createdAt).getTime() < LOGIN_OTP.resendMs
  ) {
    if (opts.passwordAlreadyOk) {
      return {
        ok: true,
        email,
        expiresInSec: Math.max(
          1,
          Math.ceil((new Date(existing.expiresAt).getTime() - now) / 1000),
        ),
      };
    }
    return {
      error: 'Please wait a minute before requesting another code.',
      status: 429,
      retryAfterSec: Math.max(
        1,
        Math.ceil((LOGIN_OTP.resendMs - (now - new Date(existing.createdAt).getTime())) / 1000),
      ),
    };
  }

  const code = generateOtpCode();
  const codeHash = await hashOtp(code);
  const createdAt = new Date();
  await col.updateOne(
    { email },
    {
      $set: {
        email,
        codeHash,
        attempts: 0,
        lockedUntil: null,
        passwordOkAt: opts.passwordAlreadyOk
          ? createdAt
          : existing?.passwordOkAt || createdAt,
        createdAt,
        expiresAt: new Date(createdAt.getTime() + LOGIN_OTP.ttlMs),
      } satisfies LoginOtpDoc,
    },
    { upsert: true },
  );

  try {
    await sendLearnerLoginOtpEmail({ to: email, code });
  } catch (err) {
    if (!isSmtpConfigured() && process.env.NODE_ENV !== 'production') {
      console.info(`[dev] login OTP for ${email}: ${code}`);
    } else {
      console.error('login OTP email failed:', err);
      await col.deleteOne({ email }).catch(() => {});
      return { error: smtpErrorMessage(err), status: 503 };
    }
  }

  return {
    ok: true,
    email,
    expiresInSec: Math.floor(LOGIN_OTP.ttlMs / 1000),
  };
}

export async function resendLoginOtp(opts: {
  email: string;
}): Promise<{ ok: true; email: string; expiresInSec: number } | AuthError> {
  const email = normalizeEmail(opts.email);
  if (!email.includes('@')) return { error: 'Enter a valid email.', status: 400 };
  const col = await loginOtpsCol();
  const existing = (await col.findOne({ email })) as LoginOtpDoc | null;
  if (!existing?.passwordOkAt) {
    return { error: 'Sign in with your password first to get a code.', status: 400 };
  }
  if (Date.now() - new Date(existing.passwordOkAt).getTime() > LOGIN_OTP.passwordWindowMs) {
    await col.deleteOne({ email }).catch(() => {});
    return { error: 'That sign-in expired. Enter your password again.', status: 400 };
  }
  return issueLoginOtp({ email, passwordAlreadyOk: false });
}

export async function finishLoginWithOtp(opts: {
  email: string;
  code: string;
}): Promise<
  | { ok: true; session: string; nextPath: string; user: Omit<SessionUser, 'iat'> }
  | AuthError
> {
  const email = normalizeEmail(opts.email);
  const code = String(opts.code || '').replace(/\s+/g, '');
  if (!email.includes('@')) return { error: 'Enter your email.', status: 400 };
  if (!/^\d{6}$/.test(code)) return { error: 'Enter the 6-digit code from your email.', status: 400 };

  const col = await loginOtpsCol();
  const doc = (await col.findOne({ email })) as LoginOtpDoc | null;
  if (!doc?.codeHash) {
    return { error: 'No code pending — sign in with your password first.', status: 400 };
  }

  const now = Date.now();
  if (new Date(doc.expiresAt).getTime() < now) {
    await col.deleteOne({ email });
    return { error: 'That code expired. Sign in again to get a new one.', status: 400 };
  }

  if (doc.lockedUntil && new Date(doc.lockedUntil).getTime() > now) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((new Date(doc.lockedUntil).getTime() - now) / 1000),
    );
    return {
      error: `Too many incorrect codes. Wait ${retryAfterSec} seconds, then try again.`,
      status: 429,
      remainingAttempts: 0,
      retryAfterSec,
    };
  }

  if (doc.lockedUntil && new Date(doc.lockedUntil).getTime() <= now) {
    await col.updateOne({ email }, { $set: { attempts: 0, lockedUntil: null } });
    doc.attempts = 0;
    doc.lockedUntil = null;
  }

  const valid = await verifyOtpCode(code, doc.codeHash);
  if (!valid) {
    const attempts = (doc.attempts || 0) + 1;
    if (attempts >= LOGIN_OTP.maxAttempts) {
      const lockedUntil = new Date(now + LOGIN_OTP.lockMs);
      await col.updateOne({ email }, { $set: { attempts, lockedUntil } });
      return {
        error: 'Too many incorrect codes. Wait 60 seconds, then try again.',
        status: 429,
        remainingAttempts: 0,
        retryAfterSec: Math.floor(LOGIN_OTP.lockMs / 1000),
      };
    }
    await col.updateOne({ email }, { $set: { attempts } });
    return {
      error: `Incorrect code. ${LOGIN_OTP.maxAttempts - attempts} ${LOGIN_OTP.maxAttempts - attempts === 1 ? 'try' : 'tries'} left.`,
      status: 401,
      remainingAttempts: LOGIN_OTP.maxAttempts - attempts,
    };
  }

  await col.deleteOne({ email });

  const loaded = await loadAccount(email);
  if (!loaded.account?.passwordHash || !loaded.account.emailVerified) {
    return { error: 'Could not finish sign-in. Try again.', status: 400 };
  }
  const account = loaded.account;

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
  const canonicalId = learner.lbId || userId;
  if (canonicalId !== account.userId) {
    await persistAccount({ ...account, userId: canonicalId, updatedAt: new Date() }).catch(() => {});
  }

  const sessionUser = {
    uid: canonicalId,
    name: learner.name || account.name || 'Learner',
    email,
  };
  const session = createSession(sessionUser);
  const nextPath = isOnboardingComplete(learner) ? '/dashboard' : '/dashboard/onboarding';
  return { ok: true, session, nextPath, user: sessionUser };
}

export async function changePassword(opts: {
  email: string;
  currentPassword: string;
  newPassword: string;
}): Promise<{ ok: true } | AuthError> {
  const email = normalizeEmail(opts.email);
  if (!opts.currentPassword) return { error: 'Enter your current password.', status: 400 };
  if (!opts.newPassword || opts.newPassword.length < 8) {
    return { error: 'New password must be at least 8 characters.', status: 400 };
  }
  if (opts.currentPassword === opts.newPassword) {
    return { error: 'Choose a different password from the current one.', status: 400 };
  }

  const loaded = await loadAccount(email);
  if (!loaded.account?.passwordHash) {
    return { error: 'Could not update password. Sign in again and retry.', status: 400 };
  }
  const ok = await verifyPassword(opts.currentPassword, loaded.account.passwordHash);
  if (!ok) return { error: 'Current password is incorrect.', status: 401 };

  const passwordHash = await hashPassword(opts.newPassword);
  const account = loaded.account;
  await persistAccount({
    ...account,
    passwordHash,
    updatedAt: new Date(),
  });
  await syncPrismaUser({
    email,
    name: account.name,
    passwordHash,
    emailVerified: account.emailVerified,
    touchLogin: false,
  });
  return { ok: true };
}

export async function requestPasswordReset(opts: {
  email: string;
  origin: string;
}): Promise<{ ok: true } | AuthError> {
  const email = normalizeEmail(opts.email);
  if (!email.includes('@')) return { error: 'Enter a valid email.', status: 400 };
  if (!opts.origin) return { error: 'Could not build a reset link.', status: 500 };

  const { account } = await loadAccount(email);
  const pending = await pendingCol();
  const p = (await pending.findOne({ email })) as PendingSignup | null;
  const hasPassword = Boolean(account?.passwordHash || p?.passwordHash);
  if (!hasPassword) return { ok: true };

  const issued = await issueAuthLink({
    email,
    purpose: 'reset',
    ttlMs: AUTH_LINK.resetTtlMs,
  });
  if ('error' in issued) return issued;

  const resetUrl = `${opts.origin.replace(/\/$/, '')}/reset-password?token=${issued.token}`;
  try {
    await sendLearnerPasswordResetEmail({ to: email, resetUrl });
  } catch (err) {
    if (!isSmtpConfigured() && process.env.NODE_ENV !== 'production') {
      console.info(`[dev] password reset link for ${email}: ${resetUrl}`);
    } else {
      console.error('password reset email failed:', err);
      const col = await linksCol();
      await col.deleteOne({ tokenHash: hashLinkToken(issued.token) }).catch(() => {});
      return { error: smtpErrorMessage(err), status: 503 };
    }
  }
  return { ok: true };
}

export async function resetPassword(opts: {
  token: string;
  password: string;
}): Promise<{ ok: true } | AuthError> {
  const raw = normalizeToken(opts.token);
  if (!raw) return { error: 'Missing reset link.', status: 400 };
  if (opts.password.length < 8) {
    return { error: 'Password must be at least 8 characters.', status: 400 };
  }

  const row = await lookupAuthLink(raw);
  if (!row || row.purpose !== 'reset') {
    return { error: 'This reset link is invalid or has already been used.', status: 400 };
  }
  if (row.usedAt) {
    return { error: 'This reset link has already been used. Sign in, or request a new one.', status: 400 };
  }
  if (new Date(row.expiresAt).getTime() < Date.now()) {
    return { error: 'This reset link expired. Request a new one.', status: 400 };
  }

  const email = normalizeEmail(row.email);
  const loaded = await loadAccount(email);
  const pending = await pendingCol();
  const p = (await pending.findOne({ email })) as PendingSignup | null;
  if (!loaded.account?.passwordHash && !p?.passwordHash) {
    return { error: 'No account found for this reset link.', status: 400 };
  }

  const passwordHash = await hashPassword(opts.password);
  const name = loaded.account?.name || p?.name || email.split('@')[0];
  await activateVerifiedAccount({
    email,
    name,
    passwordHash,
    existingUserId: loaded.account?.userId,
  });
  await markLinkUsed(row);
  const resets = await resetsCol();
  await resets.deleteMany({ email }).catch(() => {});
  return { ok: true };
}
