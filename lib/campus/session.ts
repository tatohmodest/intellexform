/**
 * Enter / bind a learner session to a campus institution.
 * Ensures Mongo affiliation + activeContext match Prisma membership when present.
 */

import { prisma } from '@/lib/db/prisma';
import { joinInstitution } from '@/lib/learn/ecosystem';
import { setActiveContext, upsertAffiliation } from '@/lib/learn/repo';
import type { AffiliationRole } from '@/lib/learn/identity';

function mapPrismaRole(role: string): AffiliationRole {
  switch (role) {
    case 'INSTITUTION_OWNER':
      return 'owner';
    case 'ORG_ADMIN':
    case 'DEPARTMENT_ADMIN':
      return 'admin';
    case 'INSTRUCTOR':
    case 'TEACHING_ASSISTANT':
      return 'instructor';
    case 'MENTOR':
      return 'mentor';
    default:
      return 'student';
  }
}

export type CampusEntry = {
  slug: string;
  institutionId: string;
  name: string;
  role: AffiliationRole;
  isStaff: boolean;
  portalHref: string;
  adminHref: string;
};

/**
 * Attach the signed-in user to a campus and set activeContext to that institution.
 * - If Prisma membership exists, use that role.
 * - Else if `allowJoin`, create student membership (public campuses).
 * - Always sets activeContext so /dashboard routes stay on this campus.
 */
export async function enterCampusContext(opts: {
  userId: string;
  userName: string;
  userEmail?: string | null;
  slug: string;
  allowJoin?: boolean;
}): Promise<CampusEntry | null> {
  const slug = opts.slug.trim().toLowerCase().slice(0, 64);
  if (!slug) return null;

  const inst = await prisma.institution.findFirst({
    where: {
      OR: [{ slug }, { subdomain: slug }],
      status: { notIn: ['ARCHIVED', 'REJECTED'] },
    },
    select: { id: true, slug: true, name: true },
  });
  if (!inst) return null;

  let prismaUserId = opts.userId;
  let membership = await prisma.institutionMembership.findUnique({
    where: {
      institutionId_userId: { institutionId: inst.id, userId: prismaUserId },
    },
    select: { role: true, isActive: true, suspendedAt: true },
  });

  // Session uid may be Prisma id already; also try email / loopingBinaryId.
  if (!membership && opts.userEmail) {
    const byEmail = await prisma.user.findUnique({
      where: { email: opts.userEmail.trim().toLowerCase() },
      select: { id: true },
    });
    if (byEmail) {
      prismaUserId = byEmail.id;
      membership = await prisma.institutionMembership.findUnique({
        where: {
          institutionId_userId: { institutionId: inst.id, userId: byEmail.id },
        },
        select: { role: true, isActive: true, suspendedAt: true },
      });
    }
  }

  if ((!membership || !membership.isActive || membership.suspendedAt) && opts.allowJoin) {
    await prisma.institutionMembership.upsert({
      where: {
        institutionId_userId: { institutionId: inst.id, userId: prismaUserId },
      },
      create: {
        institutionId: inst.id,
        userId: prismaUserId,
        role: 'STUDENT',
        isActive: true,
      },
      update: { isActive: true, suspendedAt: null },
    });
    membership = { role: 'STUDENT', isActive: true, suspendedAt: null };
  }

  const role: AffiliationRole =
    membership && membership.isActive && !membership.suspendedAt
      ? mapPrismaRole(String(membership.role))
      : 'student';
  const isStaff = ['owner', 'admin', 'instructor', 'mentor'].includes(role);

  await joinInstitution(inst.slug, opts.userId, opts.userName).catch(() => {});
  // Promote Mongo member role for owners/admins
  if (isStaff) {
    try {
      const { getDb } = await import('@/lib/repo');
      const db = await getDb();
      await db.collection('institution_members').updateOne(
        { institutionSlug: inst.slug, userId: opts.userId },
        {
          $set: {
            institutionSlug: inst.slug,
            userId: opts.userId,
            userName: opts.userName,
            role: role === 'owner' ? 'owner' : 'member',
            joinedAt: new Date(),
          },
        },
        { upsert: true },
      );
    } catch {
      /* ignore */
    }
  }

  await upsertAffiliation(opts.userId, {
    institutionSlug: inst.slug,
    institutionName: inst.name,
    role,
    status: 'verified',
    profileComplete: isStaff ? true : false,
    joinedAt: new Date(),
    verifiedAt: new Date(),
  }).catch(() => {});

  await setActiveContext(opts.userId, {
    kind: 'institution',
    institutionSlug: inst.slug,
  }).catch(() => {});

  return {
    slug: inst.slug,
    institutionId: inst.id,
    name: inst.name,
    role,
    isStaff,
    portalHref: `/dashboard/institutions/${inst.slug}`,
    adminHref: `/dashboard/institutions/${inst.slug}/admin`,
  };
}
