import { getDb } from '@/lib/repo';
import {
  CERT_MONTHLY_XAF,
  CERT_YEARLY_XAF,
  priceForCertPlan,
  type CertPlan,
} from '@/lib/learn/certPricing';

export {
  CERT_MONTHLY_XAF,
  CERT_YEARLY_XAF,
  priceForCertPlan,
  type CertPlan,
} from '@/lib/learn/certPricing';

export type CertSubscriptionView = {
  id: string;
  userId: string;
  plan: CertPlan;
  priceXAF: number;
  status: 'active' | 'expired' | 'cancelled';
  startsAt: string;
  endsAt: string;
  transactionId?: string | null;
};

function planEndsAt(plan: CertPlan, from = new Date()): Date {
  const d = new Date(from);
  if (plan === 'yearly') d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d;
}

async function ensureCertCollection() {
  try {
    const db = await getDb();
    await db
      .collection('cert_subscriptions')
      .createIndex({ userId: 1, status: 1, endsAt: -1 })
      .catch(() => {});
  } catch {
    /* ignore */
  }
}

export async function hasActiveCertSubscription(userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    await ensureCertCollection();
    const db = await getDb();
    const now = new Date();
    const doc = await db.collection('cert_subscriptions').findOne({
      userId,
      status: 'active',
      endsAt: { $gt: now },
    });
    return Boolean(doc);
  } catch {
    return false;
  }
}

export async function getActiveCertSubscription(
  userId: string,
): Promise<CertSubscriptionView | null> {
  if (!userId) return null;
  try {
    await ensureCertCollection();
    const db = await getDb();
    const now = new Date();
    const doc = await db.collection('cert_subscriptions').findOne({
      userId,
      status: 'active',
      endsAt: { $gt: now },
    });
    if (!doc) return null;
    return {
      id: String(doc._id),
      userId: String(doc.userId),
      plan: (doc.plan as CertPlan) || 'monthly',
      priceXAF: Number(doc.priceXAF) || 0,
      status: 'active',
      startsAt: new Date(doc.startsAt as Date).toISOString(),
      endsAt: new Date(doc.endsAt as Date).toISOString(),
      transactionId: doc.transactionId ? String(doc.transactionId) : null,
    };
  } catch {
    return null;
  }
}

export async function activateCertSubscription(opts: {
  userId: string;
  plan: CertPlan;
  priceXAF: number;
  transactionId?: string | null;
}): Promise<CertSubscriptionView> {
  await ensureCertCollection();
  const db = await getDb();
  const startsAt = new Date();
  const endsAt = planEndsAt(opts.plan, startsAt);

  await db.collection('cert_subscriptions').updateMany(
    { userId: opts.userId, status: 'active' },
    { $set: { status: 'expired' } },
  );

  const res = await db.collection('cert_subscriptions').insertOne({
    userId: opts.userId,
    plan: opts.plan,
    priceXAF: opts.priceXAF,
    status: 'active',
    startsAt,
    endsAt,
    transactionId: opts.transactionId || null,
    createdAt: startsAt,
  });

  return {
    id: res.insertedId.toString(),
    userId: opts.userId,
    plan: opts.plan,
    priceXAF: opts.priceXAF,
    status: 'active',
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    transactionId: opts.transactionId || null,
  };
}
