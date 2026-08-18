import webpush from 'web-push';
import { getDb } from '@/lib/repo';

export const PUSH_SUBSCRIPTIONS = 'push_subscriptions';
const APP_SETTINGS = 'app_settings';
const VAPID_SETTING_KEY = 'vapid';

export type PushPayload = {
  title: string;
  body: string;
  url?: string | null;
  tag?: string;
  kind?: string;
  category?: string;
};

type VapidKeys = {
  publicKey: string;
  privateKey: string;
  subject: string;
};

type StoredSubscription = {
  userId: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent?: string;
  updatedAt: Date;
};

let indexesReady = false;
let cachedVapid: VapidKeys | null = null;

function vapidSubject() {
  return (
    process.env.VAPID_SUBJECT ||
    process.env.EMAIL_FROM ||
    'mailto:intellex@loopingbinary.com'
  );
}

async function ensurePushIndexes() {
  if (indexesReady) return;
  const db = await getDb();
  await Promise.all([
    db.collection(PUSH_SUBSCRIPTIONS).createIndex({ userId: 1 }),
    db.collection(PUSH_SUBSCRIPTIONS).createIndex({ endpoint: 1 }, { unique: true }),
    db.collection(APP_SETTINGS).createIndex({ key: 1 }, { unique: true }),
  ]).catch(() => {});
  indexesReady = true;
}

export async function getVapidKeys(): Promise<VapidKeys> {
  if (cachedVapid) return cachedVapid;

  const envPublic = process.env.VAPID_PUBLIC_KEY?.trim();
  const envPrivate = process.env.VAPID_PRIVATE_KEY?.trim();
  if (envPublic && envPrivate) {
    cachedVapid = {
      publicKey: envPublic,
      privateKey: envPrivate,
      subject: vapidSubject(),
    };
    return cachedVapid;
  }

  await ensurePushIndexes();
  const db = await getDb();
  const existing = await db.collection(APP_SETTINGS).findOne({ key: VAPID_SETTING_KEY });
  if (existing?.publicKey && existing?.privateKey) {
    cachedVapid = {
      publicKey: String(existing.publicKey),
      privateKey: String(existing.privateKey),
      subject: String(existing.subject || vapidSubject()),
    };
    return cachedVapid;
  }

  const generated = webpush.generateVAPIDKeys();
  const keys: VapidKeys = {
    publicKey: generated.publicKey,
    privateKey: generated.privateKey,
    subject: vapidSubject(),
  };
  await db.collection(APP_SETTINGS).updateOne(
    { key: VAPID_SETTING_KEY },
    {
      $set: {
        key: VAPID_SETTING_KEY,
        publicKey: keys.publicKey,
        privateKey: keys.privateKey,
        subject: keys.subject,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );
  cachedVapid = keys;
  return keys;
}

function applyVapid(keys: VapidKeys) {
  webpush.setVapidDetails(keys.subject, keys.publicKey, keys.privateKey);
}

export async function savePushSubscription(opts: {
  userId: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent?: string;
}) {
  await ensurePushIndexes();
  const db = await getDb();
  const doc: StoredSubscription = {
    userId: opts.userId,
    endpoint: opts.endpoint,
    keys: opts.keys,
    userAgent: opts.userAgent,
    updatedAt: new Date(),
  };
  await db.collection(PUSH_SUBSCRIPTIONS).updateOne(
    { endpoint: opts.endpoint },
    { $set: doc },
    { upsert: true },
  );
}

export async function deletePushSubscription(endpoint: string, userId?: string) {
  const db = await getDb();
  const filter: Record<string, unknown> = { endpoint };
  if (userId) filter.userId = userId;
  await db.collection(PUSH_SUBSCRIPTIONS).deleteOne(filter);
}

export async function userHasPushSubscription(userId: string): Promise<boolean> {
  const db = await getDb();
  const found = await db.collection(PUSH_SUBSCRIPTIONS).findOne({ userId }, { projection: { _id: 1 } });
  return Boolean(found);
}

function statusOf(err: unknown): number | null {
  if (!err || typeof err !== 'object') return null;
  const rec = err as { statusCode?: number; status?: number };
  return rec.statusCode ?? rec.status ?? null;
}

async function sendOne(sub: StoredSubscription, body: string, keys: VapidKeys): Promise<void> {
  applyVapid(keys);
  try {
    await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: sub.keys,
      },
      body,
      {
        TTL: 60 * 60 * 24,
        urgency: 'high',
        vapidDetails: {
          subject: keys.subject,
          publicKey: keys.publicKey,
          privateKey: keys.privateKey,
        },
      },
    );
  } catch (err) {
    const status = statusOf(err);
    if (status === 404 || status === 410 || status === 403) {
      await deletePushSubscription(sub.endpoint);
      return;
    }
    console.error('[push] send failed', status, err instanceof Error ? err.message : err);
  }
}

export async function sendPushToUser(userId: string, payload: PushPayload): Promise<number> {
  if (!userId) return 0;
  const keys = await getVapidKeys();
  const db = await getDb();
  const subs = (await db
    .collection(PUSH_SUBSCRIPTIONS)
    .find({ userId })
    .toArray()) as unknown as StoredSubscription[];
  if (!subs.length) return 0;

  const body = JSON.stringify({
    title: (payload.title || 'InTelleX').slice(0, 120),
    body: (payload.body || 'You have a new update.').slice(0, 240),
    url: payload.url || '/dashboard/notifications',
    tag: payload.tag || `intellex-${userId}-${Date.now()}`,
    kind: payload.kind || 'system',
    category: payload.category || 'system',
  });

  await Promise.allSettled(subs.map((sub) => sendOne(sub, body, keys)));
  return subs.length;
}

export async function sendPushToUsers(userIds: string[], payload: PushPayload): Promise<number> {
  const unique = Array.from(new Set(userIds.filter(Boolean)));
  if (!unique.length) return 0;
  const keys = await getVapidKeys();
  const db = await getDb();
  const subs = (await db
    .collection(PUSH_SUBSCRIPTIONS)
    .find({ userId: { $in: unique } })
    .toArray()) as unknown as StoredSubscription[];
  if (!subs.length) return 0;

  const grouped = new Map<string, StoredSubscription[]>();
  for (const sub of subs) {
    const list = grouped.get(sub.userId) || [];
    list.push(sub);
    grouped.set(sub.userId, list);
  }

  await Promise.allSettled(
    unique.flatMap((userId) => {
      const userSubs = grouped.get(userId);
      if (!userSubs?.length) return [];
      const body = JSON.stringify({
        title: (payload.title || 'InTelleX').slice(0, 120),
        body: (payload.body || 'You have a new update.').slice(0, 240),
        url: payload.url || '/dashboard/notifications',
        tag: payload.tag || `intellex-${userId}-${Date.now()}`,
        kind: payload.kind || 'system',
        category: payload.category || 'system',
      });
      return userSubs.map((sub) => sendOne(sub, body, keys));
    }),
  );
  return subs.length;
}

export async function dispatchNotificationPush(opts: {
  userId: string;
  notificationId?: string | null;
  title: string;
  body: string;
  href?: string | null;
  kind?: string;
  category?: string;
}) {
  try {
    await sendPushToUser(opts.userId, {
      title: opts.title,
      body: opts.body,
      url: opts.href || '/dashboard/notifications',
      tag: opts.notificationId ? `intellex-${opts.notificationId}` : undefined,
      kind: opts.kind,
      category: opts.category,
    });
  } catch (err) {
    console.error('[push] dispatch failed', err instanceof Error ? err.message : err);
  }
}

export async function dispatchNotificationPushToUsers(
  userIds: string[],
  payload: {
    title: string;
    body: string;
    href?: string | null;
    kind?: string;
    category?: string;
  },
) {
  try {
    await sendPushToUsers(userIds, {
      title: payload.title,
      body: payload.body,
      url: payload.href || '/dashboard/notifications',
      kind: payload.kind,
      category: payload.category,
    });
  } catch (err) {
    console.error('[push] batch dispatch failed', err instanceof Error ? err.message : err);
  }
}
