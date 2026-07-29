import type { LBProfile } from '@/lib/auth/oauth';
import { prisma } from '@/lib/db/prisma';
import { getDb } from '@/lib/repo';

/**
 * Keep Supabase Prisma `User` in sync with LoopingBinary OAuth / Mongo learners
 * so Platform Admin Personnel shows real registered accounts.
 */

function splitName(name: string | null | undefined): { firstName: string | null; lastName: string | null } {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return { firstName: null, lastName: null };
  if (parts.length === 1) return { firstName: parts[0], lastName: null };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function normalizeEmail(email: string | null | undefined): string | null {
  const e = String(email || '')
    .trim()
    .toLowerCase();
  return e.includes('@') ? e : null;
}

/** Upsert a Prisma User from LoopingBinary OAuth profile. */
export async function upsertPrismaUserFromOAuth(profile: LBProfile) {
  const email = normalizeEmail(profile.email);
  if (!email) return null;

  const name = (profile.name || email.split('@')[0] || 'Learner').slice(0, 120);
  const { firstName, lastName } = splitName(name);
  const loopingBinaryId = String(profile.sub || '').slice(0, 120) || null;
  const image = profile.picture ? String(profile.picture).slice(0, 500) : null;
  const now = new Date();

  try {
    // Prefer match by LoopingBinary id when present.
    if (loopingBinaryId) {
      const byLb = await prisma.user.findUnique({ where: { loopingBinaryId } });
      if (byLb) {
        return prisma.user.update({
          where: { id: byLb.id },
          data: {
            email,
            name,
            firstName,
            lastName,
            image: image || undefined,
            lastLoginAt: now,
            emailVerified: byLb.emailVerified ?? now,
          },
        });
      }
    }

    return await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name,
        firstName,
        lastName,
        image,
        loopingBinaryId,
        lastLoginAt: now,
        emailVerified: now,
        globalRole: 'USER',
      },
      update: {
        name,
        firstName,
        lastName,
        image: image || undefined,
        loopingBinaryId: loopingBinaryId || undefined,
        lastLoginAt: now,
      },
    });
  } catch (err) {
    console.error('upsertPrismaUserFromOAuth failed:', err);
    return null;
  }
}

/**
 * Backfill Prisma Users from Mongo `learners` so existing registrations
 * appear in Platform Admin. Safe to call on each personnel list (batched).
 */
export async function syncMongoLearnersToPrisma(limit = 500): Promise<number> {
  let synced = 0;
  try {
    const db = await getDb();
    const docs = await db
      .collection('learners')
      .find(
        {},
        {
          projection: {
            lbId: 1,
            email: 1,
            name: 1,
            avatar: 1,
            lastLoginAt: 1,
            createdAt: 1,
            roles: 1,
          },
        },
      )
      .sort({ lastLoginAt: -1 })
      .limit(limit)
      .toArray();

    for (const doc of docs) {
      const email = normalizeEmail(doc.email as string | undefined);
      if (!email) continue;
      const lbId = String(doc.lbId || '').slice(0, 120) || null;
      const name = String(doc.name || email.split('@')[0] || 'Learner').slice(0, 120);
      const { firstName, lastName } = splitName(name);
      const image = doc.avatar ? String(doc.avatar).slice(0, 500) : null;
      const lastLoginAt =
        doc.lastLoginAt instanceof Date ? doc.lastLoginAt : doc.lastLoginAt ? new Date(String(doc.lastLoginAt)) : null;
      const createdAt =
        doc.createdAt instanceof Date ? doc.createdAt : doc.createdAt ? new Date(String(doc.createdAt)) : undefined;
      const roles = (doc.roles as string[] | undefined) || [];
      const globalRole = roles.includes('admin') ? 'PLATFORM_ADMIN' : 'USER';

      try {
        if (lbId) {
          const byLb = await prisma.user.findUnique({ where: { loopingBinaryId: lbId } });
          if (byLb) {
            await prisma.user.update({
              where: { id: byLb.id },
              data: {
                email,
                name,
                firstName,
                lastName,
                image: image || undefined,
                lastLoginAt: lastLoginAt || undefined,
                globalRole:
                  byLb.globalRole === 'PLATFORM_OWNER' || byLb.globalRole === 'PLATFORM_ADMIN'
                    ? byLb.globalRole
                    : (globalRole as never),
              },
            });
            synced += 1;
            continue;
          }
        }

        await prisma.user.upsert({
          where: { email },
          create: {
            email,
            name,
            firstName,
            lastName,
            image,
            loopingBinaryId: lbId,
            lastLoginAt: lastLoginAt || undefined,
            createdAt: createdAt || undefined,
            emailVerified: createdAt || new Date(),
            globalRole: globalRole as never,
          },
          update: {
            name,
            firstName,
            lastName,
            image: image || undefined,
            loopingBinaryId: lbId || undefined,
            lastLoginAt: lastLoginAt || undefined,
          },
        });
        synced += 1;
      } catch (err) {
        console.error('sync learner failed', email, err);
      }
    }
  } catch (err) {
    console.error('syncMongoLearnersToPrisma failed:', err);
  }
  return synced;
}
