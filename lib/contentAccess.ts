import { getDb } from '@/lib/repo';
import type { LessonLevel } from '@/lib/tutorials/types';
import { hasActiveCertSubscription } from '@/lib/learn/certSubscription';

export type { LessonLevel };

export type ContentKind = 'tutorial' | 'course';
export type PricingMode = 'free' | 'one_time' | 'per_level';

export interface LevelPrices {
  beginner: number;
  intermediate: number;
  advanced: number;
}

export interface ContentAccessConfig {
  kind: ContentKind;
  slug: string;
  title: string;
  /** free | one_time (full track) | per_level */
  mode: PricingMode;
  /** Used when mode === 'one_time' */
  oneTimePriceXAF: number;
  /** Used when mode === 'per_level' */
  levelPrices: LevelPrices;
  /** Optional note shown on the paywall (e.g. "Includes mentor Q&A"). */
  pricingNote?: string;
  certificateGuarantee: boolean;
  updatedAt: string;
  updatedBy?: string;
}

export interface ContentPurchase {
  userId: string;
  kind: ContentKind;
  slug: string;
  /** 'full' or a LessonLevel */
  scope: 'full' | LessonLevel;
  priceXAF: number;
  purchasedAt: string;
}

const DEFAULT_LEVEL_PRICES: LevelPrices = {
  beginner: 0,
  intermediate: 4999,
  advanced: 4999,
};

export function defaultAccessConfig(
  kind: ContentKind,
  slug: string,
  title: string,
): ContentAccessConfig {
  return {
    kind,
    slug,
    title,
    mode: 'free',
    oneTimePriceXAF: 9999,
    levelPrices: { ...DEFAULT_LEVEL_PRICES },
    certificateGuarantee: true,
    updatedAt: new Date(0).toISOString(),
  };
}

async function dbOrNull() {
  try {
    return await getDb();
  } catch {
    return null;
  }
}

export async function ensureContentAccessCollections() {
  const db = await dbOrNull();
  if (!db) return;
  await Promise.all([
    db.collection('content_access').createIndex({ kind: 1, slug: 1 }, { unique: true }),
    db
      .collection('content_purchases')
      .createIndex({ userId: 1, kind: 1, slug: 1, scope: 1 }, { unique: true }),
  ]);
}

export async function getContentAccess(
  kind: ContentKind,
  slug: string,
  title = slug,
): Promise<ContentAccessConfig> {
  const db = await dbOrNull();
  if (!db) return defaultAccessConfig(kind, slug, title);
  try {
    await ensureContentAccessCollections();
    const doc = await db.collection('content_access').findOne({ kind, slug });
    if (!doc) return defaultAccessConfig(kind, slug, title);
    return {
      kind,
      slug,
      title: String(doc.title || title),
      mode: (doc.mode as PricingMode) || 'free',
      oneTimePriceXAF: Number(doc.oneTimePriceXAF) || 0,
      levelPrices: {
        beginner: Number(doc.levelPrices?.beginner) || 0,
        intermediate: Number(doc.levelPrices?.intermediate) || 0,
        advanced: Number(doc.levelPrices?.advanced) || 0,
      },
      pricingNote: doc.pricingNote ? String(doc.pricingNote) : undefined,
      certificateGuarantee: Boolean(doc.certificateGuarantee),
      updatedAt: doc.updatedAt ? String(doc.updatedAt) : new Date().toISOString(),
      updatedBy: doc.updatedBy ? String(doc.updatedBy) : undefined,
    };
  } catch {
    return defaultAccessConfig(kind, slug, title);
  }
}

export async function listContentAccess(): Promise<ContentAccessConfig[]> {
  const db = await dbOrNull();
  if (!db) return [];
  try {
    await ensureContentAccessCollections();
    const docs = await db.collection('content_access').find({}).toArray();
    return docs.map((doc) => ({
      kind: doc.kind as ContentKind,
      slug: String(doc.slug),
      title: String(doc.title || doc.slug),
      mode: (doc.mode as PricingMode) || 'free',
      oneTimePriceXAF: Number(doc.oneTimePriceXAF) || 0,
      levelPrices: {
        beginner: Number(doc.levelPrices?.beginner) || 0,
        intermediate: Number(doc.levelPrices?.intermediate) || 0,
        advanced: Number(doc.levelPrices?.advanced) || 0,
      },
      pricingNote: doc.pricingNote ? String(doc.pricingNote) : undefined,
      certificateGuarantee: Boolean(doc.certificateGuarantee),
      updatedAt: doc.updatedAt ? String(doc.updatedAt) : new Date().toISOString(),
      updatedBy: doc.updatedBy ? String(doc.updatedBy) : undefined,
    }));
  } catch {
    return [];
  }
}

export async function upsertContentAccess(
  patch: Omit<ContentAccessConfig, 'updatedAt'> & { updatedBy?: string },
): Promise<ContentAccessConfig> {
  const db = await getDb();
  await ensureContentAccessCollections();
  const updatedAt = new Date().toISOString();
  const doc: ContentAccessConfig = {
    kind: patch.kind,
    slug: patch.slug,
    title: patch.title,
    mode: patch.mode,
    oneTimePriceXAF: Math.max(0, Math.round(Number(patch.oneTimePriceXAF) || 0)),
    levelPrices: {
      beginner: Math.max(0, Math.round(Number(patch.levelPrices.beginner) || 0)),
      intermediate: Math.max(0, Math.round(Number(patch.levelPrices.intermediate) || 0)),
      advanced: Math.max(0, Math.round(Number(patch.levelPrices.advanced) || 0)),
    },
    pricingNote: patch.pricingNote?.trim() || undefined,
    certificateGuarantee: Boolean(patch.certificateGuarantee),
    updatedAt,
    updatedBy: patch.updatedBy,
  };
  await db.collection('content_access').updateOne(
    { kind: doc.kind, slug: doc.slug },
    { $set: doc },
    { upsert: true },
  );
  return doc;
}

export async function getUserPurchases(
  userId: string,
  kind: ContentKind,
  slug: string,
): Promise<ContentPurchase[]> {
  const db = await dbOrNull();
  if (!db) return [];
  try {
    const docs = await db
      .collection('content_purchases')
      .find({ userId, kind, slug })
      .toArray();
    return docs.map((d) => ({
      userId: String(d.userId),
      kind: d.kind as ContentKind,
      slug: String(d.slug),
      scope: d.scope as ContentPurchase['scope'],
      priceXAF: Number(d.priceXAF) || 0,
      purchasedAt: String(d.purchasedAt),
    }));
  } catch {
    return [];
  }
}

export function priceForScope(config: ContentAccessConfig, scope: 'full' | LessonLevel): number {
  if (config.mode === 'free') return 0;
  if (scope === 'full' || config.mode === 'one_time') return config.oneTimePriceXAF;
  return config.levelPrices[scope] ?? 0;
}

export async function recordContentPurchase(input: {
  userId: string;
  kind: ContentKind;
  slug: string;
  scope: 'full' | LessonLevel;
  priceXAF: number;
}): Promise<void> {
  const db = await getDb();
  await ensureContentAccessCollections();
  await db.collection('content_purchases').updateOne(
    {
      userId: input.userId,
      kind: input.kind,
      slug: input.slug,
      scope: input.scope,
    },
    {
      $set: {
        ...input,
        purchasedAt: new Date().toISOString(),
      },
    },
    { upsert: true },
  );
}

import { isIntellexCourse } from '@/lib/googleDrive';

export type AccessGate =
  | { allowed: true }
  | { allowed: false; reason: 'login_required' | 'subscribe_required' | 'cert_required' };

/**
 * Free tracks: beginner is open to signed-in students.
 * Intermediate → Pro require an active “Subscribe to get certified” plan
 * (1,999 XAF/month, or yearly with 10% off) for Intellex courses.
 * Non-Intellex courses must be purchased individually and are NOT included in subscription plans.
 */
export async function canAccessContent(opts: {
  userId: string | null | undefined;
  kind: ContentKind;
  slug: string;
  level: LessonLevel;
  config?: ContentAccessConfig;
  courseOrigin?: string | null;
}): Promise<AccessGate> {
  const config =
    opts.config ?? (await getContentAccess(opts.kind, opts.slug));

  if (!opts.userId) return { allowed: false, reason: 'login_required' };

  const isIntellex = isIntellexCourse(opts.courseOrigin);

  // Non-Intellex courses are NOT part of subscription. They require individual purchase!
  if (!isIntellex) {
    const purchases = await getUserPurchases(opts.userId, opts.kind, opts.slug);
    if (purchases.some((p) => p.scope === 'full' || p.scope === opts.level)) {
      return { allowed: true };
    }
    return { allowed: false, reason: 'subscribe_required' };
  }

  // Free tracks - beginner open; Intermediate/Pro need cert subscription.
  if (config.mode === 'free') {
    if (opts.level === 'beginner') return { allowed: true };
    if (await hasActiveCertSubscription(opts.userId)) return { allowed: true };
    return { allowed: false, reason: 'cert_required' };
  }

  const purchases = await getUserPurchases(opts.userId, opts.kind, opts.slug);
  if (purchases.some((p) => p.scope === 'full')) return { allowed: true };

  // Cert subscription unlocks Intermediate→Pro for Intellex courses.
  if (
    (opts.level === 'intermediate' || opts.level === 'advanced') &&
    (await hasActiveCertSubscription(opts.userId))
  ) {
    return { allowed: true };
  }

  if (config.mode === 'one_time') {
    return { allowed: false, reason: 'subscribe_required' };
  }

  // per_level: full unlock OR matching level
  if (purchases.some((p) => p.scope === opts.level)) return { allowed: true };

  if (opts.level === 'beginner' && (config.levelPrices.beginner || 0) <= 0) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'subscribe_required' };
}
