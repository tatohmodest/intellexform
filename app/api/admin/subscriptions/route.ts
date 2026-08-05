import { NextRequest, NextResponse } from 'next/server';
import { getAdminAccess } from '@/lib/adminAuth';
import { getDb } from '@/lib/repo';
import { priceForCertPlan, type CertPlan } from '@/lib/learn/certPricing';

export const dynamic = 'force-dynamic';

type LearnerLite = {
  lbId: string;
  name: string;
  email: string;
};

function monthsFromPlan(plan: CertPlan): number {
  return plan === 'yearly' ? 12 : 1;
}

function addMonths(from: Date, months: number): Date {
  const d = new Date(from);
  d.setMonth(d.getMonth() + months);
  return d;
}

function normalizeIdentifier(raw: string): string {
  return String(raw || '').trim();
}

async function findLearnerByIdentifier(identifier: string): Promise<LearnerLite | null> {
  const db = await getDb();
  const value = normalizeIdentifier(identifier);
  if (!value) return null;

  const query = value.includes('@')
    ? { email: value.toLowerCase() }
    : { lbId: value };

  const learner = await db
    .collection('learners')
    .findOne(query, { projection: { _id: 0, lbId: 1, name: 1, email: 1 } });

  if (!learner) return null;
  return {
    lbId: String(learner.lbId || ''),
    name: String(learner.name || 'Learner'),
    email: String(learner.email || ''),
  };
}

export async function GET(req: NextRequest) {
  const access = getAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDb();
    const q = normalizeIdentifier(new URL(req.url).searchParams.get('q') || '');

    if (q) {
      const expr = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
      const learners = await db
        .collection('learners')
        .find(
          {
            $or: [{ lbId: expr }, { name: expr }, { email: expr }],
          },
          {
            projection: { _id: 0, lbId: 1, name: 1, email: 1 },
          },
        )
        .sort({ lastLoginAt: -1 })
        .limit(20)
        .toArray();

      const ids = learners.map((l) => String(l.lbId || '')).filter(Boolean);
      const active = ids.length
        ? await db
            .collection('cert_subscriptions')
            .find({ userId: { $in: ids }, status: 'active', endsAt: { $gt: new Date() } })
            .project({ _id: 0, userId: 1, plan: 1, startsAt: 1, endsAt: 1, priceXAF: 1 })
            .toArray()
        : [];
      const byUser = new Map(active.map((s) => [String(s.userId), s]));

      return NextResponse.json({
        learners: learners.map((l) => ({
          lbId: String(l.lbId || ''),
          name: String(l.name || 'Learner'),
          email: String(l.email || ''),
          activeSubscription: byUser.get(String(l.lbId || '')) || null,
        })),
      });
    }

    const recent = await db
      .collection('cert_subscriptions')
      .find({})
      .sort({ createdAt: -1 })
      .limit(40)
      .toArray();

    const ids = Array.from(new Set(recent.map((s) => String(s.userId || '')).filter(Boolean)));
    const learners = ids.length
      ? await db
          .collection('learners')
          .find({ lbId: { $in: ids } }, { projection: { _id: 0, lbId: 1, name: 1, email: 1 } })
          .toArray()
      : [];
    const byLearner = new Map(learners.map((l) => [String(l.lbId || ''), l]));

    return NextResponse.json({
      recent: recent.map((s) => {
        const userId = String(s.userId || '');
        const learner = byLearner.get(userId);
        return {
          id: String(s._id),
          userId,
          learnerName: learner ? String(learner.name || 'Learner') : 'Unknown learner',
          learnerEmail: learner ? String(learner.email || '') : '',
          plan: String(s.plan || 'monthly'),
          status: String(s.status || 'active'),
          startsAt: s.startsAt ? new Date(s.startsAt as Date).toISOString() : null,
          endsAt: s.endsAt ? new Date(s.endsAt as Date).toISOString() : null,
          priceXAF: Number(s.priceXAF) || 0,
          source: String(s.source || 'payment'),
          grantedBy: s.grantedBy ? String(s.grantedBy) : null,
          note: s.note ? String(s.note) : null,
          createdAt: s.createdAt ? new Date(s.createdAt as Date).toISOString() : null,
        };
      }),
    });
  } catch (error) {
    console.error('admin subscriptions GET failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const access = getAdminAccess(req);
  if (!access.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const identifier = normalizeIdentifier(body.identifier || body.userId || body.email || '');
    const plan = (body.plan === 'yearly' ? 'yearly' : 'monthly') as CertPlan;
    const requestedMonths = Number(body.months);
    const months = Number.isFinite(requestedMonths)
      ? Math.max(1, Math.min(36, Math.floor(requestedMonths)))
      : monthsFromPlan(plan);
    const note = normalizeIdentifier(body.note || '');

    if (!identifier) {
      return NextResponse.json({ error: 'identifier_required' }, { status: 400 });
    }

    const learner = await findLearnerByIdentifier(identifier);
    if (!learner) {
      return NextResponse.json({ error: 'learner_not_found' }, { status: 404 });
    }

    const db = await getDb();
    const startsAt = new Date();
    const endsAt = addMonths(startsAt, months);

    await db.collection('cert_subscriptions').updateMany(
      { userId: learner.lbId, status: 'active' },
      { $set: { status: 'expired', revokedAt: startsAt, revokedBy: access.email } },
    );

    const priceXAF = priceForCertPlan(plan);
    const res = await db.collection('cert_subscriptions').insertOne({
      userId: learner.lbId,
      plan,
      priceXAF,
      status: 'active',
      startsAt,
      endsAt,
      transactionId: `admin-grant-${Date.now()}`,
      source: 'admin_grant',
      grantedBy: access.email,
      note: note || null,
      createdAt: startsAt,
    });

    return NextResponse.json({
      ok: true,
      grant: {
        id: res.insertedId.toString(),
        userId: learner.lbId,
        learnerName: learner.name,
        learnerEmail: learner.email,
        plan,
        months,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        priceXAF,
      },
    });
  } catch (error) {
    console.error('admin subscriptions POST failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
